import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis connection error:", err));

(async () => {
  try {
    await redisClient.connect(); //its a promise based function thats why we use async here
    console.log("Connected to Redis ");
  } catch (err) {
    console.error("Redis connection failed ", err);
  }
})();

export default redisClient;
