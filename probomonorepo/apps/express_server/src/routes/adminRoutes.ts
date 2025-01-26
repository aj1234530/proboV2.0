import express, { Router, Request, Response } from "express";

export const adminRouter: Router = express.Router();

adminRouter.post("/create/event", (req: Request, res: Response) => {
  res.send("hello");
});
