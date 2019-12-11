const Redis = require('ioredis');

const ONE_HOUR = 60 * 60;

class TokenService {
  constructor() {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    this.client = new Redis(redisPort, redisHost);
    console.log(`Connected to Redis at ${redisHost}:${redisPort}`);
  }

  async isRevokedToken(token) {
    const key = `jwt-${token}`;
    const isRevoked = await this.client.get(key);
    return isRevoked;
  }

  async revokeUserToken(token) {
    const key = `jwt-${token}`;
    await this.client.set(key, true);
    await this.client.expire(key, ONE_HOUR);
  }
}

module.exports = new TokenService();
