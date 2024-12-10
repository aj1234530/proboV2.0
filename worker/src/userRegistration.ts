//making another redis client - how it will behave
import { redisClient } from "./redisClients";
const INR_BALANCES: any = {};
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
                await redisClient.lPush('responses:register_user', JSON.stringify(backeResponse));

            }
        } catch (error) {
            console.error('Error occurred:', error);
            return
        }
    }

}


