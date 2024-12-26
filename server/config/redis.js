// const redis = require('redis');
// const redisClient = redis.createClient();

// redisClient.on('error', (err) => console.error('Redis error:', err));

// module.exports = redisClient;

const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://localhost:6379", // Adjust URL as needed
});

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error:", err));

(async () => {
  await redisClient.connect(); // Connect to Redis asynchronously
})();

module.exports = redisClient;
