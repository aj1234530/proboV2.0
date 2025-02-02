import { Request } from "express";
declare global {
  namespace Express {
    interface Request {
      //type i set to any please fix
      userId: string; // or just `user` if you don't have a specific type for it
    }
  }
}
export {}; //this make file an external module allowing augmentation
