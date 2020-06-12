const Redis = require('ioredis');

const ONE_HOUR = 60 * 60;

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

const client = new Redis(redisPort, redisHost);

console.log(`Connected to Redis at ${redisHost}:${redisPort}`);

async function setUserToken (userId, token) {
  const userKey = `user-${userId}`;
  await client.set(userKey, token);

  const tokenKey = `jwt-${token}`;
  await client.set(tokenKey, true);
  await client.expire(tokenKey, ONE_HOUR);
}

async function isUserTokenRevoked (userId) {
  const userKey = `user-${userId}`;
  const token = await client.get(userKey);

  const tokenKey = `jwt-${token}`;
  const isValid = await client.get(tokenKey);

  return isValid !== 'true';
}

async function revokeUserToken (userId, token) {
  const key = `jwt-${token}`;
  await client.del(key);
  await client.del(userId);
}

module.exports = {
  isUserTokenRevoked,
  revokeUserToken,
  setUserToken
};
