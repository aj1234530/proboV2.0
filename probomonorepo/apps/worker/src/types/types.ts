// //name - export

import { INR_BALANCES } from "../store/inMemoryDb.js";

//orderbook
export type priceRange =
  | 50
  | 100
  | 150
  | 200
  | 250
  | 300
  | 350
  | 400
  | 450
  | 500
  | 550
  | 600
  | 650
  | 700
  | 750
  | 800
  | 850
  | 900
  | 950;

export type Order = {
  userId: string;
  // id: string;//what is this id
  quantity: number;
  // type: "buy" | "exit"; //what is this
}[]; //this is array of objects

export type ORDERDATA = {
  total: number;
  orders: Order;
};

export interface ORDER_BOOK_TYPE {
  [stockSymbol: string]: {
    yes: Map<priceRange, ORDERDATA>;
    no: Map<priceRange, ORDERDATA>;
  };
}

//stock balance
export interface STOCK_BALANCES_TYPE {
  [userId: string]: {
    [stockSymbol: string]: {
      yes?: {
        quantity: number;
        locked: number;
        pending: number;
        exited: number;
      };
      no?: {
        quantity: number;
        locked: number;
        pending: number;
        exited: number;
      };
    };
  };
}

export interface INR_BALANCES_TYPE {
  [userId: string]: {
    balance: number;
    locked: number;
  };
}

// //using INTERFace compoistion
// export interface ORDERBOOKTYPE {
//   //eventName:...
//   [key: string]: ORDERBOOK_YES_NO;
// }
// export interface ORDERBOOK_YES_NO {
//   yes: ORDERBOOK_PRICE; //no effect on quotes,both same
//   no: ORDERBOOK_PRICE;
// }

// export interface ORDERBOOK_PRICE {
//   // Optional values in case a price isn't available
//   "850"?: ORDERBOOK_PRICE_ITEMS;
//   "950"?: ORDERBOOK_PRICE_ITEMS;
//   "900"?: ORDERBOOK_PRICE_ITEMS;
//   "800"?: ORDERBOOK_PRICE_ITEMS;
//   "750"?: ORDERBOOK_PRICE_ITEMS;
//   "700"?: ORDERBOOK_PRICE_ITEMS;
//   "650"?: ORDERBOOK_PRICE_ITEMS;
//   "600"?: ORDERBOOK_PRICE_ITEMS;
//   "550"?: ORDERBOOK_PRICE_ITEMS;
//   "500"?: ORDERBOOK_PRICE_ITEMS;
//   "450"?: ORDERBOOK_PRICE_ITEMS;
//   "400"?: ORDERBOOK_PRICE_ITEMS;
//   "350"?: ORDERBOOK_PRICE_ITEMS;
//   "300"?: ORDERBOOK_PRICE_ITEMS;
//   "250"?: ORDERBOOK_PRICE_ITEMS;
//   "200"?: ORDERBOOK_PRICE_ITEMS;
//   "150"?: ORDERBOOK_PRICE_ITEMS;
//   "100"?: ORDERBOOK_PRICE_ITEMS;
//   "50"?: ORDERBOOK_PRICE_ITEMS;
// }
// export interface ORDERBOOK_PRICE_ITEMS {
//   total?: number;
//   orders?: ORDERBOOK_ORDERS; //i.e. orders:{user:1,user2:3}
// }
// export interface ORDERBOOK_ORDERS {
//   //eg-user:2
//   [key: string]: number;
// }

// export type OrderEntry = {
//   total: number;
//   orders: { [user: string]: number };
// };

// // Use a mapped type to enforce `Price` keys
// export type OrderBookSide = {
//   [P in Price]?: OrderEntry; // Optional so not all prices are required
// };

// export type ORDERBOOKTYPETYPEII = {
//   [market: string]: {
//     yes: OrderBookSide;
//     no: OrderBookSide;
//   };
// };

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
