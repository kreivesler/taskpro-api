const { redisClient } = require("../redis/client");

const BAN_KEY_PREFIX = "banIp:";
const REQUEST_COUNT_KEY_PREFIX = "reqCount:";

const MAX_REQUESTS = 50;
const WINDOW_TIME_SECONDS = 60;
const BAN_TIME_SECONDS = 300;

module.exports = redisSecurityMiddleware = async (req, res, next) => {
  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const isBanned = await redisClient.get(BAN_KEY_PREFIX + ip);
  if (isBanned) {
    return res
      .status(429)
      .json({ message: "Too Many Requests. Your IP is temporarily banned." });
  }

  const key = REQUEST_COUNT_KEY_PREFIX + ip;
  let count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, WINDOW_TIME_SECONDS);
  }

  if (count > MAX_REQUESTS) {
    await redisClient.set(BAN_KEY_PREFIX + ip, "true", {
      EX: BAN_TIME_SECONDS,
    });

    await redisClient.del(key);

    return res.status(429).json({
      message: "Too Many Requests. Your IP has been banned for 5 minutes.",
    });
  }
  next();
};
