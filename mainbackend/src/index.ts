//entry point for an express backend
import express,{Request,Response} from 'express';
import { router } from './APIs_gateway/userRoutes';
import { adminRouter } from './APIs_gateway/adminRoutes';
const app = express();

app.use(express.json());
app.get('/ping',(req,res)=>{
    res.status(200).json({message:"Pong"})
})

app.use("/api/v1/user",router);

app.use("/api/v1/admin",adminRouter);

app.listen(3001,()=>console.log('server is running on 3001'))

