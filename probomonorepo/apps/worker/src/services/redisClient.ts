import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
dotenv.config();
console.log(`'received url',${process.env.REDIS_URL}`, "logging ");

export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
  //this is recoonetion strategy - added here after debugging if the db was not av it was not re trying
  //what is socker herer - it an object inside redis client, help cutomise behaviour like recnn..s, tls ,timeout, keepAlive
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Redis recoonect attemp ${retries}`);
      return Math.min(retries * 100, 2000); //increase exponential but highter is 5 sec
    },
  },
});

export const pubSubRedisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Redis recoonect attempt ${retries}`);
      return Math.min(retries * 100, 5000); //increase exponential but highter is 5 sec
    },
  },
});
async function connect() {
  await redisClient.connect();
  await pubSubRedisClient.connect();
  console.log("worker connected to redis");
}
connect();

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});
redisClient.on("ready", () => {
  console.log("worker redis ready");
});

pubSubRedisClient.on("ready", () => {
  console.log("pubsubclient, worker redis ready");
});
