import { createClient, RedisClientType } from "redis";
export const redisClient: RedisClientType = createClient({
  url: "redis://proboredis:6379",
});
export const pubSubRedisClient: RedisClientType = createClient({
  url: "redis://proboredis:6379",
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("ready", () => {
  console.log("connected to redis");
});
async function connect() {
  await redisClient.connect();
  console.log("worker connected to redis");
  await pubSubRedisClient.connect();
}
connect();
