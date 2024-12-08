import { redisClient } from "../services/redisClient";

redisClient.lpop('register-user');
