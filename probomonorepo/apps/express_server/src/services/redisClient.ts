import dotenv from "dotenv";
dotenv.config();
import { createClient, RedisClientType } from "redis";
console.log("process.env.REDIS_URL", process.env.PORT, process.env.REDIS_URL);
export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
  //retry strategy - added after debuggin, socket is object that helps us use reccones,tls, timeout ,keepalive on connection
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Redis recoonect attemp ${retries}`);
      return Math.min(retries * 100, 5000); //increase exponential but highter is 5 sec
    },
  },
});
export const pubSubRedisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Redis recoonect attemp ${retries}`);
      return Math.min(retries * 100, 5000); //increase exponential but highter is 5 sec, first is 0
    },
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("ready", () => {
  console.log("connected to redis and ready");
});
async function connect() {
  await redisClient.connect();
  await pubSubRedisClient.connect();
  console.log("express_server connected to redis");
}
connect();

//we need redis to send
