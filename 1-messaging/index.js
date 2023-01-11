// const express = require('express'),
//   config = require('./config.js'),
//   process = require('process'),
//   redis = require('redis');

// var app = express();
// //connect to redis
// var redisClient = redis.createClient(config.redis_port, config.redis_host);
// var publishClient = redis.createClient(config.redis_port, config.redis_host);
// redisClient.on("message", (channel, message) => {
//   console.log(message);
// });

// redisClient.subscribe('REQUESTS');

// app.get('/', (req, res) => {
//   publishClient.publish('REQUESTS', `Request on ${req.socket.localPort} for ${req.url}`);
//   console.log(`Local log for ${req.url}`);
//   res.end();
// });

// app.listen(process.argv[2]);

import express from 'express';
import { redis_port, redis_host } from './config.js';
import process from 'process';
// import { createClient } from 'redis';
import { createClient } from 'redis';

//connect to redis
const redisClient = createClient(redis_port, redis_host);
const publishClient = createClient(redis_port, redis_host);

redisClient.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  redisClient.on('message', (channel, message) => {
    console.log(message);
  });

  redisClient.subscribe('REQUESTS');
});



publishClient.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
});

const app = express();

app.get('/', (req, res) => {
  publishClient.publish('REQUESTS', `Request on ${req.socket.localPort} for ${req.url}`);
  console.log(`Local log for ${req.url}`);
  res.end();
});

app.listen(process.argv[2]);
