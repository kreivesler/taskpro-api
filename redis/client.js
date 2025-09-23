const { createClient } = require("redis");

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (err) => console.log("Redis Client Error", err));

async function redisConnect() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log("Redis Client Error", error);
  }
}

module.exports = { redisClient, redisConnect };
