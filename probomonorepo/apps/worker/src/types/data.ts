import { priceRange } from "./types.js";

export interface DataRecievedFromApiServer {
  taskType:
    | "signup"
    | "buy"
    | "sell"
    | "recharge"
    | "getOrderBook"
    | "exit"
    | "getStockBalance";
  userId: string; //for rech,buy,
  //signup
  username: string;
  password: string;
  email: string;

  uniqueRequestId: string;
  //for recharge

  balanceToAdd: number;
  //buy & sell
  eventName: string;
  price: priceRange;
  bidQuantity: number;
  bidType: "yes" | "no";
}
//if you make it int 1.0 becomes 1 and throws erro

export interface PARSED_REDIS_BALANCE {
  balance: number;
  locked: number;
}

// export type Price =
//   | "50"
//   | "100"
//   | "150"
//   | "200"
//   | "250"
//   | "300"
//   | "350"
//   | "400"
//   | "450"
//   | "500"
//   | "550"
//   | "600"
//   | "650"
//   | "700"
//   | "750"
//   | "800"
//   | "850"
//   | "900"
//   | "950";
