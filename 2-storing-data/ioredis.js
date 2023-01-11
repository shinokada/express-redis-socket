import express from 'express';
import process from 'process';
import Redis from 'ioredis';
import { redis_host, redis_port } from './config.js';

const client = new Redis({
  host: redis_host,
  port: redis_port
})

const app = express();
const PORT = process.argv[2] || 3000;

client.flushall();
client.set('test', 'my test')
client.hset('dog:1', ['name', 'gizmo', 'age', '5']);
client.hset('dog:2', ['name', 'dexter', 'age', '6']);
client.hset('dog:3', ['name', 'fido', 'age', '5']);
// //we are using name like username, unique
client.set('dog:name:gizmo', 'dog:1');
client.set('dog:name:dexter', 'dog:2');
client.set('dog:name:fido', 'dog:3');
// //ages are not unique
client.lpush('dog:age:5', ['dog:1', 'dog:3']);
client.lpush('dog:age:6', 'dog:2');

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
  const dog = await client.hgetall(data);
  res.send(dog);
  console.timeEnd('request');
});

app.get('/dog/age/:age', async (req, res) => {
  try {
    const dogs = []
    const data = await client.lrange(`dog:age:${req.params.age}`, 0, -1)
    for (const id of data) {
      const dog = await client.hgetall(id);
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