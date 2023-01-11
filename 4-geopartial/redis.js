// import { createClient } from 'ioredis';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { redis_host, redis_port } from './config.js';

// const client = createClient(redis_port, redis_host);
// const client = new Redis({
//   host: redis_host,
//   port: redis_port
// })

// const env = process.env.NODE_ENV || 'development';
const config = dotenv.config();

const UPSTASH_REDIS = process.env.UPSTASH_REDIS || config.parsed.UPSTASH_REDIS
const client = new Redis(UPSTASH_REDIS);

const aroundLockm = async (long, lat, km) => {
  return client.geosearch('cities', 'FROMLONLAT', long, lat, 'BYRADIUS', km, 'km', 'ASC', 'WITHDIST');
};


const nearbyCities = async (long, lat, km) => {
  return client.geosearch('cities', 'FROMLONLAT', long, lat, 'BYRADIUS', km, 'km', 'ASC', 'WITHDIST')
}

const fromNorthPole = async (km) => {
  return client.geosearch('cities', 'FROMMEMBER', 'North Pole', 'BYRADIUS', km, 'km', 'WITHDIST');
};

export { fromNorthPole, aroundLockm, nearbyCities, client };
