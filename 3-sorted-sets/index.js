import express from 'express';
import process from 'process';
import Redis from 'ioredis';
import dotenv from 'dotenv';

const app = express();

const env = process.env.NODE_ENV || 'development';
const config = dotenv.config({ path: `.env.${env}` });

const UPSTASH_REDIS = config.parsed.UPSTASH_REDIS
const redis = new Redis(UPSTASH_REDIS);

//setup redis data
await redis.flushall();
await redis.hmset('dog:1', ['name', 'gizmo', 'age', '5']);
await redis.hmset('dog:2', ['name', 'dexter', 'age', '6']);
await redis.hmset('dog:3', ['name', 'fido', 'age', '5']);
//we are using name like username, unique
await redis.set('dog:name:gizmo', 'dog:1');
await redis.set('dog:name:dexter', 'dog:2');
await redis.set('dog:name:fido', 'dog:3');

app.use((req, res, next) => {
  console.time('request');
  next();
});

app.get('/', (req, res) => {
  res.send('Connected')
})

app.get('/dog/name/:name', async (req, res) => {
  var now = Date.now();
  await redis.zadd('dog:last-lookup', [now, 'dog:name:' + req.params.name]);
  //first find the id
  const data = await redis.get('dog:name:' + req.params.name);
  await redis.hset(data, 'last-lookup', now);
  const dog = await redis.hgetall(data);
  res.send(dog);
  console.timeEnd('request');
});

app.get('/dog/any', async (req, res) => {
  const data = await redis.zrevrangebyscore('dog:last-lookup', '+inf', '-inf');
  let dogs = [];
  for await (const key of data) {
    const dogData = await redis.get(key);
    const dog = await redis.hgetall(dogData);
    dogs.push(dog);
  }
  res.send(dogs);
  console.timeEnd('request');
});

app.get('/dog/latest', async (req, res) => {
  var now = Date.now();
  var minuteAgo = now - 60000;
  const data = await redis.zrevrangebyscore('dog:last-lookup', now, minuteAgo);
  let dogs = [];
  for (const key of data) {
    const dogData = await redis.get(key);
    const dog = await redis.hgetall(dogData);
    dogs.push(dog);
  }
  res.send(dogs);
  console.timeEnd('request');
});

app.listen(process.argv[2]);
