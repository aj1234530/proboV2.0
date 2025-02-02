import {
  INR_BALANCES_TYPE,
  ORDER_BOOK_TYPE,
  ORDERDATA,
  priceRange,
  STOCK_BALANCES_TYPE,
} from "../types/types.js";
export const ORDERBOOK: ORDER_BOOK_TYPE = {
  SAMPLE_STOCK: {
    yes: new Map<priceRange, ORDERDATA>(),
    no: new Map<priceRange, ORDERDATA>(),
  },
  SAMPLE_STOCK2: {
    yes: new Map<priceRange, ORDERDATA>(),
    no: new Map<priceRange, ORDERDATA>(),
  },
};

export const STOCK_BALANCES: STOCK_BALANCES_TYPE = {};

export const INR_BALANCES: INR_BALANCES_TYPE = {
  //hard code-for now
  cm6kebwrb00003g9imp8xbixf: {
    balance: 5000000,
    locked: 0,
  },
  cm6keey8p00013g9i5qej4ov5: {
    balance: 5000000,
    locked: 0,
  },
  admin: {
    balance: 0,
    locked: 0,
  },
};
