import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  console.log(token);
  try {
    if (!token) {
      console.log("here 1", token);
      res.status(401).json({ message: " Unauthorised" });
      return;
    }
    const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
    //next auth is returning userid, so keeping both both option
    req.userId = decode.id || decode.userId;
    // console.log("here 2  ", decode, decode.userId, req.userId);
    next();
  } catch (error: any) {
    console.log("here 3  ");

    console.log(error);
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Access token has expired." });
      return;
    }
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid access token." });
      return;
    }
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};
