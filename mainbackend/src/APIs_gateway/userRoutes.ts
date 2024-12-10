import express,{Request,Response} from 'express';
import { redisClient } from '../services/redisClient';
import { v4 as uuidv4 } from 'uuid';
export const router =  express.Router();
import { userRegistrationSchema } from '../lib/zodvalidation'; //zod schema
router.get("/ping",(req:Request,res:Response)=>{
    res.send("pong");
})

router.post("/register",async(req:Request,res:Response)=>{
    try {
        const validateData = userRegistrationSchema.parse(req.body);
        const {username,email,password} = req.body;
        //random unique id to return the response again to the same user
        const uniqueId = uuidv4();
       await redisClient.lpush('user_queue:register-user',JSON.stringify({
        username,email,password,uniqueId
       })); 
       console.log("your order has been picked up")
       const response = await redisClient.brpop(`responses:register_user`,30);//wait unitl a time out //looking for a specific response
       if(response){
        console.log(response);
        res.status(200).send("okay received");
       }else {
        res.status(500).send("our worker is down")
       }
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

router.post("/signin",(req:Request,res:Response)=>{
    //>> will go to the engine and process the request  
})

router.post("/balance/inr/:userId",(req:Request,res:Response)=>{
    
})
router.post("/orderbook",(req:Request,res:Response)=>{ //get orderbook
    
})
router.post('/order/buy',async(req,res)=>{
    const {userId,stockSymbol,qunatity,price,stockType} = req.body;
    await redisClient.lpush("orders:buy",JSON.stringify({
        userId,stockSymbol,qunatity,price,stockType
    }))
})
router.post('/order/sell',async(req,res)=>{
    const {userId,stockSymbol,qunatity,price,stockType} = req.body;
    await redisClient.lpush("orders:sell",JSON.stringify({
        userId,stockSymbol,qunatity,price,stockType
    }))
})