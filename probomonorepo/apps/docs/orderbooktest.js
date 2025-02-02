const ORDERBOOK = {
  BTC_USDT_10_Oct_2024_9_30: {
    yes: {
      "950": {
        total: 12,
        orders: {
          user1: 2,
          user2: 10,
        },
      },
      "850": {
        total: 12,
        orders: {
          user1: 3,
          user2: 3,
          user3: 6,
        },
      },
    },
    no: {

    },
  },
  BTC_US2DT_10_Oct_2024_9_30: {
    yes: {},
    no: {},
  },
};

console.log(ORDERBOOK["BTC_USDT_10_Oct_2024_9_30"]["yes"])
