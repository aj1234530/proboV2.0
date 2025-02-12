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
  SAMPLE_STOCK_2: {
    yes: new Map<priceRange, ORDERDATA>(),
    no: new Map<priceRange, ORDERDATA>(),
  },
  SAMPLE_STOCK_3: {
    yes: new Map<priceRange, ORDERDATA>(),
    no: new Map<priceRange, ORDERDATA>(),
  },
  SAMPLE_STOCK_4: {
    yes: new Map<priceRange, ORDERDATA>(),
    no: new Map<priceRange, ORDERDATA>(),
  },
};

export const STOCK_BALANCES: STOCK_BALANCES_TYPE = {};

export const INR_BALANCES: INR_BALANCES_TYPE = {
  //admin is here for minting thing
  admin: {
    balance: 0,
    locked: 0,
  },
  cm6z366kn00013gabrsqkets4: {
    balance: 10000000,
    locked: 0,
  },
};
