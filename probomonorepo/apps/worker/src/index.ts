import { pubSubRedisClient, redisClient } from "./services/redisClient.js";
import { PrismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import serializeObject from "./services/helpers.js";
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const prisma = new PrismaClient();
//prettier-ignore
import { wsClient } from "./ws/index.js";
import { INR_BALANCES, ORDERBOOK, STOCK_BALANCES } from "./store/inMemoryDb.js";
import { ORDERDATA, priceRange } from "./types/types.js";
import {
  DataRecievedFromApiServer,
  PARSED_REDIS_BALANCE,
} from "./types/data.js";

const processQueue = async () => {
  while (true) {
    console.log("code is here 0: root brPop");
    //wait for the task to appear i.e. the above fxn is in event loop
    const response = await redisClient.brPop("probotaskqueue", 0);
    if (!response) continue; //if respnse is null start over
    console.log("code is here 0.1: response of redispop", response.element);
    const dataRecieved: DataRecievedFromApiServer = JSON.parse(
      response.element
    );
    console.log(
      "code is here 0.2:parsed data recieved",
      dataRecieved,
      dataRecieved?.bidQuantity
    );
    //prettier-ignore
    switch (dataRecieved.taskType) {
      case "signup":
        handleUserSignup(dataRecieved);
        break;
      case "recharge":
        console.log("code is here 2: recharge case");
        handleRecharge(dataRecieved);
        break;
      case "buy":
        console.log(`code is here 2.2 ,insided by case  at ${new Date().getHours()}:${new Date().getMinutes()};` );
        handleBuy(dataRecieved);
        break;
      case "getOrderBook":
        console.log('case2.3: inside getOrderBook case');
        handleGetOrderBook(dataRecieved)
        break;
      case "exit":
        console.log('case2.4: inside exit case');
        handleExitOrder(dataRecieved);
    }
  }
};

//prettier-ignore
const handleExitOrder = (data:DataRecievedFromApiServer)=>{
  const {userId,bidQuantity,bidType,eventName} = data;
  console.log('inside exit 0',eventName,userId,bidType)
  console.log('inside exit 0.1',JSON.stringify(STOCK_BALANCES,(key,value)=>value instanceof Map ? Object.entries(value):value));
  const price = data.price
  console.log("inside exit order fn 1");
  //LS1.1 - edge case
  if(!ORDERBOOK[data.eventName]){
    //the event dne
    console.log('inside exit,event dne 2')
    return;
  }
  if(!STOCK_BALANCES[userId]){
    console.log('inside exit fxn , user dne 3');
    return
  }
  if(!STOCK_BALANCES[userId][eventName]){
    console.log('inside exit fxn,no stock of this event 4')
    return 
  }
  if(!STOCK_BALANCES[userId][eventName][bidType]){
    console.log('inside exit fxn,no stock of this type 5')
    return 
  }
  //ls1.3 - check no of stock selling and avalilability
  const availabeQuantity = STOCK_BALANCES[userId][eventName][bidType]['quantity']
  if(data.bidQuantity > availabeQuantity){
    console.log('inside exit fn cannot sell more quantity than available 6')
    return 
  }
  //now insert the bid quantity in the orderbook of the same type because it's sell only
  //TODO 1.insert 2.dec 3.lock(exit pending) &  4. will be money added in 
  if(!ORDERBOOK[eventName]){
    console.log('code inside exit fxn,event dne 7')
    return
  }
  //pushing ot orderbook improve this code using nullish coalescing
  const priceMap =   ORDERBOOK[eventName][bidType];
    priceMap.has(price) || priceMap.set(price,{total:0,orders:[]});// ||(logical or )  if set side is true right is ignored
    const orderData = priceMap.get(price);
    if(orderData){
      const existingOrder = orderData.orders.find(order => order.userId === userId);
      if (existingOrder) {
        existingOrder.quantity += bidQuantity; 
      } else {
        orderData.total += bidQuantity;
        orderData.orders.push({ userId, quantity:bidQuantity });
      }
    }else{
      priceMap.set(price,{total:bidQuantity,orders:[{userId,quantity:bidQuantity}]})
    }
    //deduct the stock balance and inc the locked
    STOCK_BALANCES[userId][eventName][bidType]['quantity'] -= bidQuantity;
    STOCK_BALANCES[userId][eventName][bidType]['locked']+=bidQuantity;
    console.log(
      "inside exit fn 8",
      serializeObject(STOCK_BALANCES),
      serializeObject(ORDERBOOK)
    );
  }

const handleGetOrderBook = async (data: DataRecievedFromApiServer) => {
  try {
    console.log("inside handleGetOderBook fxn 1");
    const dataToSend = JSON.stringify({
      statusCode: "200",
      orderbook: serializeObject(ORDERBOOK),
    });
    await pubSubRedisClient.publish(
      `getOrderBook${data.uniqueRequestId}`,
      dataToSend
    );
  } catch (error) {
    console.log(error);
  }
};
const handleUserSignup = async (data: DataRecievedFromApiServer) => {
  try {
    if (await prisma.user.findFirst({ where: { email: data.email } })) {
      pubSubRedisClient.publish(
        `signupResponse${data.uniqueRequestId.toString()}`,
        JSON.stringify({ statusCode: "400", message: "User Already Exists" })
      );
      return; //exit this fxn
    }
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
      },
    });
    const token = await jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "72h",
    });
    //insert the user to the inr balance,if left side is right
    INR_BALANCES[user.id] = INR_BALANCES[user.id] || { balance: 10, locked: 0 };
    console.log(INR_BALANCES);
    pubSubRedisClient.publish(
      `signupResponse${data.uniqueRequestId}`,
      JSON.stringify({
        statusCode: "200",
        message: "Signup Successful",
        token: token,
      })
    );
  } catch (error) {
    console.log(error);
    pubSubRedisClient.publish(
      `signupResponse${data.uniqueRequestId}`,
      JSON.stringify({
        statusCode: "500",
        message: "Internal redis Server Error",
      })
    );
  }
};
const handleRecharge = async (data: DataRecievedFromApiServer) => {
  const { userId, balanceToAdd, uniqueRequestId } = data;
  console.log("inside rech fxn 1", userId, balanceToAdd);
  try {
    //inr balance increment or add
    INR_BALANCES[userId] = INR_BALANCES[userId] || { balance: 0, locked: 0 };
    INR_BALANCES[userId]["balance"] += balanceToAdd;
    console.log(
      "inide rec fxn 2 updated inrBalance: ",
      serializeObject(INR_BALANCES)
    );
    await pubSubRedisClient.publish(
      `recharge${uniqueRequestId}`,
      JSON.stringify({ statusCode: 200, message: "Recharge Succesfull" })
    );
  } catch (error) {
    console.log(error);
    await pubSubRedisClient.publish(
      `recharge${uniqueRequestId}`,
      JSON.stringify({ statusCode: 500, message: "Recharge sucessaful" })
    );
  }
};
//this handler updates balance to redis(not using now)
const handleRecharge2 = async (data: DataRecievedFromApiServer) => {
  console.log("code is here 3:inside recharge");
  try {
    console.log("code is here 3.1:inside recharge");

    const pubChannel = `recharge${data.uniqueRequestId}`;
    const dataInRedis = await redisClient.hGet("INR_BALANCES", data.userId);
    //we will manipute balance first in redis(if there is entry) then update in postgres so that one flow maintains consisteny
    //if not in redis - update in db else update redis
    console.log("code is here 4:inside recharge");
    if (!dataInRedis) {
      await redisClient.hSet("sdfla", "sdf", "dfas");
      console.log("sdfsf");
      const udateInDb = await prisma.user.update({
        where: { id: data.userId },
        data: { balance: { increment: data.balanceToAdd } },
      });
    } else {
      //parase the balance of redis
      const parseData: PARSED_REDIS_BALANCE = JSON.parse(dataInRedis);
      //now set the incremented ones
      const newData = JSON.stringify({
        balance: parseData.balance + data.balanceToAdd,
        locked: parseData.locked,
      });
      ////ERROR - code not running on one pop yaha tak krke return kar ja rha hai , on second it is coming over here
      //baakit koi bhi code run ho rha ye nhi ho rha
      await redisClient.hSet("INR_BALANCES", data.userId, newData);
      console.log("code is here 5:inside recharge");
    }
    await pubSubRedisClient.publish(
      pubChannel,
      JSON.stringify({ statusCode: "200", message: "On ramp up successful" })
    );
    console.log("code is here 6:inside recharge");
  } catch (error) {
    console.log(error); //log
    await pubSubRedisClient.publish(
      `recharge${data.uniqueRequestId}`,
      JSON.stringify({ statusCode: "500", message: "On ramp up failure" })
    );
    console.log("code is here 7:inside recharge");
  }
};

const handleBuy = async (data: DataRecievedFromApiServer) => {
  const { userId, eventName, bidQuantity, bidType, price } = data;
  //LS0 - check if event/game exist
  if (!ORDERBOOK[data.eventName]) {
    console.log("inside buy,market doest not exits 0 ");
    return;
  }
  //check the balance of the user
  if (!INR_BALANCES[userId]) {
    console.log("inside buy , user dne in inb 0.2");
    return;
  }
  if (INR_BALANCES[userId]["balance"] < price * bidQuantity) {
    console.log("inside buy , not suffice balance 0.3");
    return;
  }
  //DECREASE the balance kyuki , buy me to user ko stock milega hi ya to mint hokar ya fir match krke
  INR_BALANCES[userId].balance -= price * bidQuantity;
  console.log("inside buy , balance decrease", serializeObject(INR_BALANCES));

  //LS0.1 - filter price less than equat to deman to match
  const filteredByPrice = new Map(
    Array.from(ORDERBOOK[data.eventName]![data.bidType]).filter(
      ([key, value]) => key <= Number(data.price) && value.total != 0
    )
  );
  //LS0.1 - filter the user that can sell - expect the user itself
  const buyOrderArray = Array.from(filteredByPrice).map(([price, item]) => {
    const orders = item.orders.filter((order) => order.userId !== data.userId);
    const total = orders.reduce((acc, value) => {
      return acc + value.quantity;
    }, 0);
    return { price, total, orders };
  });
  //LS0.2 - know the the availabe quantity
  let availableQuantity = buyOrderArray.reduce(
    (acc, item) => acc + item.total,
    0
  );

  //LS- 1 handling the mint case, i.e. no order availbe to be sold
  if (availableQuantity === 0) {
    handleMinting(data);
    //increase the stock balance of buyer
    //ensure populated with default value(type de) if the prop missin
    STOCK_BALANCES[userId] = STOCK_BALANCES[userId] || {};
    STOCK_BALANCES[userId][eventName] = STOCK_BALANCES[userId][eventName] || {};
    STOCK_BALANCES[userId][eventName][bidType] = STOCK_BALANCES[userId][
      eventName
    ][bidType] || { quantity: 0, locked: 0, pending: 0, exited: 0 };
    //incr the bal
    STOCK_BALANCES[userId][eventName][bidType]["quantity"] += bidQuantity;
    console.log(
      "orderbook :",
      serializeObject(ORDERBOOK),
      "stocke balance",
      serializeObject(STOCK_BALANCES),
      "inr balance",
      serializeObject(INR_BALANCES)
    );
    console.log("code is here : above ORDERBOOK sending over ws");
    const datatosend = serializeObject({
      orderbook: ORDERBOOK,
      stockbalance: STOCK_BALANCES,
    });
    wsClient.send(datatosend); //sending type of msg also
    return;
  }
  //LS -2 handling the case where we can match partial or all orders
  if (availableQuantity > 0) {
    let requiredQuantity = data.bidQuantity;
    for (const item in buyOrderArray) {
      console.log("inside for", item, "buy order array", buyOrderArray);
      const orderPrice = Number(buyOrderArray[item]!.price) as priceRange;
      console.log("code is here,forl, 1");
      //after matching checking if any order left to fullfill
      requiredQuantity = mactchOrder(
        data,
        requiredQuantity,
        orderPrice,
        buyOrderArray[item]!
      );
      //orderbook logging
      console.log(
        JSON.stringify(
          ORDERBOOK,
          (key, value) =>
            value instanceof Map ? Object.fromEntries(value) : value,
          2 // Indentation for better readability
        )
      );
      //deleting the order if
      if (
        ORDERBOOK[data.eventName]![data.bidType].get(orderPrice) &&
        ORDERBOOK[data.eventName]![data.bidType].get(orderPrice)!.total == 0
      ) {
        ORDERBOOK[data.eventName]![data.bidType].delete(orderPrice); //delete if entry is 0
      }
      if (requiredQuantity == 0) {
        console.log("code is here,forl, 2");
        break; //break out of loop if all orders matched
      }
      //check the available order that are avilabe for maching
      console.log("code is here,forl, 3");
      availableQuantity = buyOrderArray.reduce(
        (acc, items) => acc + items.total,
        0
      );
      console.log("code is here,forl, 4");

      if (availableQuantity === 0) {
        console.log("code is here,forl, 5");
        data.bidQuantity = requiredQuantity; //changing because few order have been matched
        handleMinting(data);
        break; //break on mint case
      }
    }
    wsClient.send(serializeObject(ORDERBOOK)); //orderbook on ws
  }
  //log orderbook
  console.log(
    JSON.stringify(
      ORDERBOOK,
      (key, value) =>
        value instanceof Map ? Object.fromEntries(value) : value,
      2 // Indentation for better readability
    )
  );
  console.log(serializeObject(ORDERBOOK), serializeObject(STOCK_BALANCES));
  return "orderMatched";
};

function handleMinting(data: DataRecievedFromApiServer) {
  //
  let mintingPrice: priceRange = (1000 - Number(data.price)) as priceRange;

  let mintingType: "yes" | "no" = data.bidType === "yes" ? "no" : "yes";

  //skipping balance increment for now
  // if (orderType == "buy") {
  //   INR_BALANCES[userId].balance -= quantity * price * 100;
  //   INR_BALANCES[userId].locked += quantity * price * 100;
  // }

  //getting the map value at which the mint is to be happened
  const mintOrderArray = ORDERBOOK[data.eventName]![mintingType];
  const mintOrder = mintOrderArray.get(mintingPrice);
  //if for the mint price the price exist in order the simpley push or create price and push
  if (mintOrder) {
    mintOrder.total += data.bidQuantity;

    const existingOrderIndex = mintOrder.orders.findIndex(
      (order) => order.userId === "admin"
    );
    //not creating new entry if user is same
    if (existingOrderIndex !== -1) {
      // If user already exists, increment the quantity
      mintOrder.orders[existingOrderIndex]!.quantity += data.bidQuantity;
    } else {
      mintOrder.orders.push({
        userId: "admin", //why because sell hoga to admin ke pass jayega , so wo jitne wale ko badha kar de sake
        quantity: data.bidQuantity,
      });
    }
  } else {
    mintOrderArray.set(mintingPrice, {
      total: data.bidQuantity,
      orders: [{ userId: "admin", quantity: data.bidQuantity }],
    });
  }
}
//this fxn is for match the buy order only for now at least
function mactchOrder(
  data: DataRecievedFromApiServer,
  requiredQuantity: number,
  orderPrice: priceRange,
  orderObject: ORDERDATA
) {
  const { userId, eventName, bidType, price } = data;
  const allOrders = orderObject.orders; //allorder is array of all user
  let remainingQuantity = requiredQuantity;
  console.log(
    "inside match 1",
    "orderobj",
    orderObject,
    remainingQuantity,
    userId
  );

  for (const order in allOrders) {
    //LS 1if the availbe order is more than remaing, match all and return 0
    //case one order represent one user

    if (allOrders[order]!.quantity > remainingQuantity) {
      console.log("LS 1.1 -case: demand is less  ");
      //decuctin user from orderbook
      allOrders[order]!.quantity -= remainingQuantity;
      //decuction from total
      ORDERBOOK[eventName]![bidType].get(orderPrice)!.total -=
        remainingQuantity;
      //update the balance here, just adding the what another user sold for
      const sellerId = allOrders[order]?.userId; //this user is selling means there has to be entry there
      if (sellerId) {
        console.log(
          "ls 1.1 case, seller id can;t be found in order entry, but letting the order fullfill"
        );
        INR_BALANCES[sellerId]!.balance += price * remainingQuantity;
      }

      STOCK_BALANCES[userId] = STOCK_BALANCES[userId] ?? {};
      STOCK_BALANCES[userId][eventName] =
        STOCK_BALANCES[userId][eventName] ?? {};
      STOCK_BALANCES[userId][eventName]![bidType] = STOCK_BALANCES[userId][
        eventName
      ][bidType] ?? {
        quantity: 0,
        locked: 0,
        pending: 0,
        exited: 0,
      };
      STOCK_BALANCES[userId][eventName][bidType].quantity +=
        allOrders[order]!.quantity;
      console.log(STOCK_BALANCES);
      remainingQuantity = 0;

      return remainingQuantity;
      //if tthe order availabe is less than remaining quantity - orderbook for this type will be empty
    } else {
      console.log("LS 1.2 - order av excaustive "); //here one user has less quantity than required
      remainingQuantity -= allOrders[order]!.quantity;
      orderObject.total -= allOrders[order]!.quantity;
      ORDERBOOK[eventName]![bidType].get(orderPrice)!.total -=
        allOrders[order]!.quantity;
      const sellerId = allOrders[order]?.userId;
      if (sellerId) {
        console.log(
          "ls 1.2 case, seller id can;t be found in order entry, but letting the order fullfill"
        );
        // INR_BALANCES[sellerId]!.balance += price * remainingQuantity; //if the seller id is not there let the balance
      }
      //add the balance to buyer and full fill whose pending order was matched

      STOCK_BALANCES[userId] = STOCK_BALANCES[userId] ?? {};
      STOCK_BALANCES[userId]![eventName] =
        STOCK_BALANCES[userId]![eventName] ?? {};
      STOCK_BALANCES[userId]![eventName]![bidType] = STOCK_BALANCES[userId]![
        eventName
      ]![bidType] ?? {
        quantity: 0,
        locked: 0,
        pending: 0,
        exited: 0,
      };
      STOCK_BALANCES[userId]![eventName]![bidType]!.quantity +=
        allOrders[order]!.quantity;
      console.log(JSON.stringify(STOCK_BALANCES));
      allOrders[order]!.quantity = 0; //as the user had less so his quanity would be zero now
      ORDERBOOK[eventName]![bidType].get(orderPrice)?.orders.shift();
    }
  }
  return remainingQuantity;
}

processQueue();

/*faults in buy algorith
1. on minting you have to add the stock the user account and list the opp for sell 
but there will admin entry

but sell hoga to paisa kha jayega - it will go to probo as 
jitne wale ko to paisa badhakar  dena hai 

*/

var x = 0;

/*
DEFINITIONS of Functions descrisbed above:
1. 



*/
