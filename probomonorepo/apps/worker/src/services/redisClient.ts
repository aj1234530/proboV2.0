import { createClient, RedisClientType } from "redis";
export const redisClient: RedisClientType = createClient();
export const pubSubRedisClient: RedisClientType = createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("ready", () => {
  console.log("connected to redis");
});
async function connect() {
  await redisClient.connect();
  await pubSubRedisClient.connect();
}
connect();
