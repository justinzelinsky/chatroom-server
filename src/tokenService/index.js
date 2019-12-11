const Redis = require('ioredis');

const ONE_DAY = 10; //60 * 60 * 24;

class TokenService {
  constructor() {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    this.client = new Redis(redisPort, redisHost);
    console.log(`Connected to Redis at ${redisHost}:${redisPort}`);
  }

  async hasValidToken(userId) {
    const key = `jwt-${userId}`;
    const token = await this.client.get(key);
    return token !== null;
  }

  async setToken(userId, token) {
    const key = `jwt-${userId}`;
    await this.client.set(key, token);
    await this.client.expire(key, ONE_DAY);
  }

  async deleteToken(userId) {
    const key = `jwt-${userId}`;
    return await this.client.del(key);
  }
}

module.exports = new TokenService();
