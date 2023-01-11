const config = require('./config.js'),
  redis = require('ioredis');

var client = redis.createClient(config.redis_port, config.redis_host);

var promiser = (resolve, reject) => {
  return (err, data) => {
    if (err) reject(err);
    resolve(data);
  };
};

var storeUser = (socketID, user) => {
  return new Promise((resolve, reject) => {
    client.setex(socketID, config.expire, user, promiser(resolve, reject));
  });
};

var getUser = (socketID) => {
  return new Promise((resolve, reject) => {
    client.get(socketID, promiser(resolve, reject));
    //test errors here
    //client.get(socketID, 12345, promiser(resolve, reject));
  });
};

module.exports.storeUser = storeUser;
module.exports.getUser = getUser;

// import Redis from 'ioredis';
// import dotenv from 'dotenv';
// import { redis_host, redis_port, expire } from './config.js';

// const env = process.env.NODE_ENV || 'development';
// const config = dotenv.config({ path: `.env.${env}` });

// const UPSTASH_REDIS = config.parsed.UPSTASH_REDIS
// const client = new Redis(UPSTASH_REDIS);


// const storeUser = async (socketID, user) => {
//   try {
//     const result = await client.setex(socketID, expire, user);
//     console.log('result: ', result)
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// const getUser = async (socketID) => {
//   try {
//     const result = await client.get(socketID);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// export { storeUser, getUser };
