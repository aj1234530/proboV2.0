import express, { Router, Request, Response } from "express";
import { pubSubRedisClient, redisClient } from "../services/redisClient.js";
import { waitForMessageOnChannel } from "./userRoutes.js";
import WebSocket from "ws";

//move below fxn to another file
export const adminRouter: Router = express.Router();
interface getOrderBookResponse {
  statusCode: string;
  orderbook: string;
}
//move above fxn to separte, add a event to the database and the orderbook
adminRouter.post("/create/event", (req: Request, res: Response) => {

});


//this is public route i mistakenly wrote this here
adminRouter.get("/get/orderbook", async (req: Request, res: Response) => {
  //but our worker has no websocket server it is connected via websocket only
  //use quues and await on the pubsub
  try {
    const uniqueRequestId = Date.now().toString();
    const subChannel = `getOrderBook${uniqueRequestId}`;
    await redisClient.lPush(
      "probotaskqueue",
      JSON.stringify({
        uniqueRequestId,
        taskType: "getOrderBook",
      })
    );
    console.log("code is here 1");

    const responseOnChannel: getOrderBookResponse = JSON.parse(
      //if promise rejects it will throw error
      await waitForMessageOnChannel(subChannel)
    );

    console.log("code is insed gob 2", responseOnChannel);

    if (responseOnChannel.statusCode == "200") {
      const orderbook = JSON.parse(responseOnChannel.orderbook);
      res
        .status(200)
        .json({ message: "orderbook fetched ", orderbook: orderbook });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
