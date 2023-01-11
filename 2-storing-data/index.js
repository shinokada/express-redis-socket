// const express = require('express'),
//   process = require('process'),
//   redis = require('./redis.js');

// var app = express();
// //setup redis data
// redis.redis.flushall();
// redis.redis.hmset('dog:1', ['name', 'gizmo', 'age', '5']);
// redis.redis.hmset('dog:2', ['name', 'dexter', 'age', '6']);
// redis.redis.hmset('dog:3', ['name', 'fido', 'age', '5']);
// //we are using name like username, unique
// redis.redis.set('dog:name:gizmo', 'dog:1');
// redis.redis.set('dog:name:dexter', 'dog:2');
// redis.redis.set('dog:name:fido', 'dog:3');
// //ages are not unique
// redis.redis.lpush('dog:age:5', ['dog:1', 'dog:3']);
// redis.redis.lpush('dog:age:6', 'dog:2');

// app.use((req, res, next) => {
//   console.time('request');
//   next();
// });

// app.get('/dog/name/:name', (req, res) => {
//   //first find the id
//   redis.get('dog:name:' + req.params.name)
//   .then(redis.hgetall)
//   .then((data) => res.send(data));
//   console.timeEnd('request');
// });

// app.get('/dog/age/:age', (req, res) => {
//   redis.lrange('dog:age:' + req.params.age)
//   .then((data) => Promise.all(data.map(redis.hgetall)))
//   .then((data) => res.send(data));
//   console.timeEnd('request');
// });

// app.listen(process.argv[2]);


import express from 'express';
import process from 'process';
import redis from 'redis';
import { redis_host, redis_port } from './config.js';

const client = redis.createClient({
  host: redis_host,
  port: redis_port
});

await client.connect()
const app = express();
const PORT = process.argv[2] || 3000;

client.FLUSHALL();
client.set('test', 'my test')
client.hSet('dog:1', ['name', 'gizmo', 'age', '5']);
client.hSet('dog:2', ['name', 'dexter', 'age', '6']);
client.hSet('dog:3', ['name', 'fido', 'age', '5']);
// //we are using name like username, unique
client.set('dog:name:gizmo', 'dog:1');
client.set('dog:name:dexter', 'dog:2');
client.set('dog:name:fido', 'dog:3');
// //ages are not unique
client.lPush('dog:age:5', ['dog:1', 'dog:3']);
client.lPush('dog:age:6', 'dog:2');

app.use((req, res, next) => {
  console.time('request');
  next();
});
app.get('/', async (req, res) => {
  const value = await client.get("test")
  res.send(`Redis connected ${value}`)
})

app.get('/dog/name/:name', async (req, res) => {
  //first find the id
  const data = await client.get('dog:name:' + req.params.name);
  const dog = await client.hGetAll(data);
  res.send(dog);
  console.timeEnd('request');
});

app.get('/dog/age/:age', async (req, res) => {
  try {
    const dogs = []
    const data = await client.lRange(`dog:age:${req.params.age}`, 0, -1)
    for (const id of data) {
      const dog = await client.hGetAll(id);
      dogs.push(dog);
    }
    res.send(dogs);
    console.timeEnd('request');
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}`);
});