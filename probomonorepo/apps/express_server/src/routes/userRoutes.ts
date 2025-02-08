import express, { json, Request, Response, Router } from "express";
import { redisClient } from "../services/redisClient.js";
import { pubSubRedisClient } from "../services/redisClient.js";
import { PrismaClient } from "@repo/db/client";
import { authCheck, JWT_SECRET } from "../middlewares/authCheck.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const probotaskqueue = "probotaskqueue";
const prisma = new PrismaClient();
export const userRouter: Router = express.Router();
interface WorkerResponse_Signup {
  statusCode: string;
  message: string;
  token: string;
}
interface WorkerResponse_Recharge {
  statusCode: string;
  message: String;
}
interface RedisUserBalance {
  balance: number;
  locked: number;
}
userRouter.post("/recharge", authCheck, async (req: Request, res: Response) => {
  const { balanceToAdd } = req.body;
  const userId = req.userId;
  const uniqueRequestId = Date.now().toString(); //for comm
  console.log(uniqueRequestId, typeof uniqueRequestId);
  const subChannel = `recharge${uniqueRequestId}`;
  //we should do it by the worker
  console.log("userId", userId, "balancetoadd", balanceToAdd);
  //increasing in the db also, not figured out what is the sourse of t
  const recharging = await prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: parseInt(balanceToAdd) } },
  });
  try {
    await redisClient.lPush(
      "probotaskqueue",
      JSON.stringify({
        uniqueRequestId,
        userId,
        taskType: "recharge",
        balanceToAdd,
      })
    );
    //if promise rejecte caught by the catch
    console.log("code is here 1");
    const responseOnChannel: WorkerResponse_Recharge = JSON.parse(
      await waitForMessageOnChannel(subChannel)
    );
    console.log("code is here 2");

    if (responseOnChannel.statusCode == "200") {
      res
        .status(200)
        .json({ message: "Balance Added", newBalance: recharging.balance });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/withdraw", (req: Request, res: Response) => {});

userRouter.post("/signup", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const uniqueRequestId = Date.now();
  try {
    await redisClient.lPush(
      "probotaskqueue",
      JSON.stringify({
        username,
        email,
        password,
        uniqueRequestId,
        taskType: "signup",
      })
    );
    //if promise returned by waitForMessageOnChannel is rejected then it goes to catch block
    const response: WorkerResponse_Signup = JSON.parse(
      await waitForMessageOnChannel(`signupResponse${uniqueRequestId}`)
    );
    switch (response.statusCode) {
      case "200":
        res.status(200).json({
          message: "Signpu Sucessful",
          token: response.token,
        });
        return;
      case "400":
        res.status(400).json({ message: "User Aleady exist" });
        return;
      case "500":
        res.status(500).json({ message: "our trading engine is down" });
        return;
    }
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json({ message: "internal error", error });
  }
});
//prettier-ignore
userRouter.post("/buy", authCheck,async(req: Request, res: Response) => {
  //addvalidation here
  const {eventName,bidType,bidQuantity,price} = req.body;
    //expecting balance from frontend in paise
    const userId = req.userId;
    const uniqueRequestId = Date.now().toString();
    console.log('data',eventName,bidType,bidQuantity,price,userId,uniqueRequestId)
    try {
      //in frontend also if user has not suffice , button will be disabled
      const balance = await redisClient.hGet('INR_BALANCES',userId);
      //if the user is able the trade means , his balance has been update in redis memory - as /trade/..on any route balance will be loaded
      if(!balance ){
        res.status(400).json({message:"Can't get the balance info"})
        console.log('no balance info',userId)
        return
      }
      console.log('code is here 1:buy',balance)

      const parsedBalance:RedisUserBalance = JSON.parse(balance);
      console.log('code is here 2:buy',parsedBalance.balance)
      if(parsedBalance.balance  < price * bidQuantity){
      console.log('code is here 3:buy')
        res.status(400).json({message:"Insuffice Balance"})
        return
      }
      if( (price % 50 !==0 ||  50 > price || price >= 1000) || bidQuantity <= 0 ){
        console.log(price % 50 !==0,50 > price,price >= 1000)
        console.log(price,)
        console.log('code is here 4:buy, invalid price config')
        //returning a generic response because , user won't  see it, it is for some who hit our api directly
        res.status(400).json({message:"invalid configurations"})
        return
      }
      await redisClient.lPush(probotaskqueue,JSON.stringify({taskType:'buy',userId,uniqueRequestId,eventName,bidQuantity,bidType,price}));
      //we have to submit bid only , nothing else , all the validation will be @ worker , as user has select option(for event,price) we do need validation here - we will prevent at worker if someone does by intercepting
      //we will block the buy button on frontend if less balance
      res.status(200).json({message:"Bid Submitted"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    } 
});
userRouter.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required" });
    return;
  }
  try {
    const user = await prisma.user.findFirst({ where: { email: email } });
    if (!user) {
      res.status(401).json({ message: "Please Signup first" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }
    const token = await jwt.sign({ userId: user.id }, JWT_SECRET);
    console.log("here in singin", token);
    //we need to intialize the balance in local db to make sure user has the balance in in memory
    res.status(200).json({
      message: "Login Sucessful",
      id: user.id,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//prettier-ignore
userRouter.post( "/addusertotrade",authCheck,async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
      //only add if ther is not in memory
      if( await redisClient.hGet('INR_BALANCES',userId)){
        console.log("code is here 1") //log
        res.status(200).json({message:"alrady user is there in memory"})
        return;
      }
      console.log("code is here 2") //log
      const user = await prisma.user.findFirst({where:{id:userId}})
      const data = JSON.stringify({balance:user?.balance,locked:0})
      await redisClient.hSet('INR_BALANCES',userId,data);
      res.status(200).json({message:"User and balance added to the in memory"})

    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

userRouter.post("/exit", authCheck, async (req: Request, res: Response) => {
  //for selling 1. should have stock of the event,
  //sale parice - data sanity,
  //add to order book simply nothing else and lock it
  const { eventName, bidType, bidQuantity, price } = req.body;
  if (!eventName || !bidType || !bidQuantity || !price) {
    res.status(500).json({ message: "all field manadaotry" });
    return;
  }
  const userId = req.userId;
  try {
    await redisClient.lPush(
      probotaskqueue,
      JSON.stringify({
        eventName,
        bidType,
        bidQuantity,
        price,
        userId,
        taskType: "exit",
      })
    );
    res.status(200).json({ message: "Exit Order Placed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/events", async (req: Request, res: Response) => {
  try {
    const events = await prisma.events.findMany();
    res
      .status(200)
      .json({ message: "events fetched successfully", events: events });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error, message: "Internal Server Error" });
  }
});
userRouter.get("/event/:id", async (req: Request, res: Response) => {
  const eventId = req.params.id;
  try {
    const event = await prisma.events.findFirst({
      where: { eventName: eventId },
    });
    if (!event) {
      res.status(404).json({ message: "Event Not Found" });
      return;
    }
    res
      .status(200)
      .json({ message: "events fetched successfully", event: event });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error, message: "Internal Server Error" });
  }
});
userRouter.get("/balance", authCheck, async (req: Request, res: Response) => {
  const userId = req.userId;
  console.log("code in get b 1:id", userId);
  try {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    res
      .status(200)
      .json({ message: "Balance fetched successfull", balance: user?.balance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "we went into the error", error: error });
  }
});

//write a fxn that return a promise which resolves on the message or timeout after 30/specified sec
//why this fxn is asycn? can't a sync return promise

export function waitForMessageOnChannel(channel: string): Promise<string> {
  return new Promise((resolve, reject) => {
    //when the the channel receives the message the , cf executes and resolves
    //if not resolved under delay gives, promise is rejected
    //do we need to put await here before the pub
    pubSubRedisClient.subscribe(channel, (message) => {
      resolve(message);
      redisClient.unsubscribe; //unsub as
    });
    setTimeout(() => {
      reject("Timed Out");
    }, 30000);
  });
}
