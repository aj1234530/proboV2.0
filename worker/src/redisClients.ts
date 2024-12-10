import {createClient} from 'redis';
export const redisClient = createClient();
async function redisConnect() {
    await redisClient.connect(); 
    console.log("redis connected")
}
redisConnect();
