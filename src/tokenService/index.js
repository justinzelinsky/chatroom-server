const Redis = require('ioredis');

const ONE_HOUR = 60 * 60;

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

const client = new Redis(redisPort, redisHost);

console.log(`Connected to Redis at ${redisHost}:${redisPort}`);

async function isTokenRevoked (token) {
  const key = `jwt-${token}`;
  const isRevoked = await client.get(key);
  return isRevoked;
}

async function revokeUserToken (token) {
  const key = `jwt-${token}`;
  await client.set(key, true);
  await client.expire(key, ONE_HOUR);
}


module.exports = {
  isTokenRevoked,
  revokeUserToken
};
