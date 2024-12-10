"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
exports.redisClient = new ioredis_1.default(); //this client is connecting to redis db default connection to localhost:6379
// redisClient.on('error',(error)=>console.log(error))
// redisClient.on('ready',()=>{
//     console.log('connected to redis')
// });
exports.redisClient.set("mykey", "value");
exports.redisClient.get("mykey", (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
