import Redis from "ioredis";
export const redisClient = new Redis(); //this client is connecting to redis db default connection to localhost:6379
// redisClient.on('error',(error)=>console.log(error))
// redisClient.on('ready',()=>{
//     console.log('connected to redis')
// });
// redisClient.set('mykey','value');
// redisClient.get('mykey',(err,result)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(result)
//     }
// })
redisClient.on('error',(error)=>{
    console.log('errors');
    //will keep retrying if the redis is down
})
//This event is emitted by the Redis client when it successfully establishes a connection to the Redis server and is ready to accept commands.
redisClient.on('ready',()=>{
    console.log("connected to redis")
})
// redisClient.set("user:1","ak",(err,result)=>{
//     console.log('set',result)
// }); //refer to doc if gets confused
