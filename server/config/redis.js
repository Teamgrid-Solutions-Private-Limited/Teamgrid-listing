// const redis = require('redis');
// const redisClient = redis.createClient();

// redisClient.on('error', (err) => console.error('Redis error:', err));

// module.exports = redisClient;


const redis = require('redis');
const redisClient = redis.createClient({ url: 'redis://127.0.0.1:6379' });

redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Redis connection error:', err);
});

module.exports = redisClient;
