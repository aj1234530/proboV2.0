import express, { json, Request, Response, Router } from "express";
import { redisClient } from "../services/redisClient.js";
import { pubSubRedisClient } from "../services/redisClient.js";
import { PrismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
export const userRouter: Router = express.Router();
interface SignupWorkerResponse {
  statusCode: string;
  message: string;
  token: string;
}
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
    //if promise returned by waitForMessage is rejected then it goes to catch block
    const response: SignupWorkerResponse = JSON.parse(
      await waitForMessage(`signupResponse${uniqueRequestId}`)
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
userRouter.post("/buy", (req: Request, res: Response) => {
  console.log("buy request");
  res.send("buy request");
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
    res.status(200).json({
      message: "Login Sucessful",
      userId: user.id,
      userEmail: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/sell", (req: Request, res: Response) => {});

//write a fxn that return a promise which resolves on the message or timeout after 30/specified sec
//why this fxn is asycn? can't a sync return promise
function waitForMessage(channel: string): Promise<string> {
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
