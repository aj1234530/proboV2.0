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

        await redisClient.set("user:1","ak")
       await redisClient.lpush('user_queue:register-user',JSON.stringify({
        username,email,password,uniqueId
       })); 
         // we have to return the response after the worker has finished his work and return via the queue
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
router.post("/balance/inr/:userId",(req:Request,res:Response)=>{
    
})
router.post("/orderbook",(req:Request,res:Response)=>{ //get orderbook
    
})
