import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URI,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

export const connectRedis = async (): Promise<void> => {
  await redisClient.connect();
  console.log("Redis Connected");
};
