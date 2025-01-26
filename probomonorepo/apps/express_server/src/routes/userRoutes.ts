import express, { Request, Response, Router } from "express";
import { redisClient } from "../services/redisClient.js";
import { pubSubRedisClient } from "../services/redisClient.js";
import { PrismaClient } from "@repo/db/client";
const prisma = new PrismaClient();
export const userRouter: Router = express.Router();

userRouter.post("/recharge", (req: Request, res: Response) => {
  try {
  } catch (error) {}
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
    //wait for the response
    //separate queue(not elemen of queue) for this response
    console.log(uniqueRequestId);
    const response = await waitForMessage(`signupResponse${uniqueRequestId}`);
    const receivedResponse = JSON.stringify
    res.status(200).json({ message: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal error", error });
  }
});
userRouter.post("/buy", (req: Request, res: Response) => {
  console.log("buy request");
  res.send("buy request");
});

userRouter.post("/sell", (req: Request, res: Response) => {});

//write a fxn that return a promise which resolves on the message or timeout after 30/specified sec
//why this fxn is asycn? can't a sync return promise
function waitForMessage(channel: string) {
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
