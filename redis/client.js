const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6973,
});

redisClient.on("connect", () => {
  console.log("Redis server connected successfully!");
});

redisClient.on("error", (err) => {
  console.log(`Redis server error:`, err);
});

module.exports = redisClient;
