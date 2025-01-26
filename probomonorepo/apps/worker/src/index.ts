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
  uniqueRequestId:string
}

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
        console.log()
        handleUserSignup(dataRecieved);
    }
  }
};

processQueue();

//prettier-ignore
const handleUserSignup = async (data: DataRecievedFromApiServer) => {
  try {
    if(await prisma.user.findFirst({where:{OR:[{email:data.email,username:data.username}]}})){
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

    pubSubRedisClient.publish(`signupResponse${data.uniqueRequestId}`,JSON.stringify({statusCode:'200',message:"Signup Successful"}))

    const token = await jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "72h",
    });
    //if no error in user crn
    pubSubRedisClient.publish("signupResponse", JSON.stringify({}));
  } catch (error) {
    pubSubRedisClient.publish(`signupResponse${data.uniqueRequestId}`,JSON.stringify({statusCode:'500',message:"Internal Server Error"}))

  }
};
