import { pubSubRedisClient, redisClient } from "./services/redisClient.js";
import { PrismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const prisma = new PrismaClient();
interface DataRecievedFromApiServer {
  taskType: "signup" | "buy" | "sell";
  username: string;
  password: string;
  email: string;
  uniqu: string;
  quantity: String;
  uniqueRequestId: string;
}
//in memory var means it on baacked server ram => (don't dare to  think on browser)
//how the admin will new game
const STOCK_BALANCES = {
  user1: {
    BTC_USDT_10_Oct_2024_9_30: {
      yes: {
        quantity: 1,
        locked: 0,
      },
    },
  },
  user2: {
    BTC_USDT_10_Oct_2024_9_30: {
      no: {
        quantity: 3,
        locked: 4,
      },
    },
  },
};
const ORDERBOOK = {
  BTC_USDT_10_Oct_2024_9_30: {
    yes: {
      "9.5": {
        total: 12,
        orders: {
          user1: 2,
          user2: 10,
        },
      },
      "8.5": {
        total: 12,
        orders: {
          user1: 3,
          user2: 3,
          user3: 6,
        },
      },
    },
    no: {},
  },
  BTC_US2DT_10_Oct_2024_9_30:{
    yes:{

    },
    no:{

    }
  }
};

const processQueue = async () => {
  while (true) {
    //wait for the task to appear i.e. the above fxn is in event loop
    const response = await redisClient.brPop("probotaskqueue", 0);
    if (!response) continue; //if respnse is null start over
    const dataRecieved: DataRecievedFromApiServer = JSON.parse(
      response.element
    );
    switch (dataRecieved.taskType) {
      case "signup":
        console.log();
        handleUserSignup(dataRecieved);
      case "buy":
    }
  }
};

processQueue();

//prettier-ignore
const handleUserSignup = async (data: DataRecievedFromApiServer) => {
  try {
    if(await prisma.user.findFirst({where:{email:data.email,}})){

      pubSubRedisClient.publish(`signupResponse${data.uniqueRequestId}`,JSON.stringify({statusCode:'400',message:"User Already Exists"}))
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
    pubSubRedisClient.publish(`signupResponse${data.uniqueRequestId}`,JSON.stringify({statusCode:'200',message:"Signup Successful",token:token}))

  } catch (error) {
    console.log(error)
    pubSubRedisClient.publish(`signupResponse${data.uniqueRequestId}`,JSON.stringify({statusCode:'500',message:"Internal redis Server Error"}))

  }
};
