import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { redisClient } from "./services/redisClient.js";
import { userRouter } from "./routes/userRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
