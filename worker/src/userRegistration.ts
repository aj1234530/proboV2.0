//making another redis client - how it will behave
import { redisClient } from "./redisClients";
const INR_BALANCES= {}; //memory variable 
const stock_balances = {};
export async function main() {
    while (true) {
        try {
            const response = await redisClient.brPop("user_queue:register-user", 0);
            if (response) {
                const data = JSON.parse(response.element);
                console.log(data);
                //account creatin logic goes here
                const backeResponse = {
                    status : 'success',
                    uniqueId : data['uniqueId'],
                    message: 'use registered successfully'
                }
                await redisClient.lPush(`responses:register_user_${backeResponse.uniqueId}`, JSON.stringify(backeResponse)); //will process definitely even if the user leaves the screen after request
                console.log(`processed order with id ${backeResponse.uniqueId}`)
            }
        } catch (error) {
            console.error('Error occurred:', error);
            return
        }
    }

}


