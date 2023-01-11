const express = require('express'),
  socketio = require('socket.io'),
  redis = require('./redis.js');

var app = express();
var server = app.listen(8080);
var io = socketio(server);

app.use(express.static('static'));

var errorEmit = (socket) => {
  return (err) => {
    console.log(err);
    socket.broadcast.emit('user.events', 'Something went wrong!');
  };
};

io.on('connection', (socket) => {
  socket.broadcast.emit('user.events', 'Someone has joined!');
  socket.on('name', (name) => {
    redis.storeUser(socket.id, name)
      .then(() => {
        console.log(name + ' says hello!');
        socket.broadcast.emit('name', name);
      }, errorEmit(socket));
  });

  socket.on('disconnect', () => {
    redis.getUser(socket.id)
      .then((user) => {
        if (user === null) return 'Someone'
        else return user
      })
      .then((user) => {
        console.log(user + ' left');
        socket.broadcast.emit('user.events', user + ' left');
      }, errorEmit(socket))
  });
});


// import express from 'express';
// import Server from "socket.io";
// import { storeUser, getUser } from './redis.js';
// import Redis from 'ioredis';
// import dotenv from 'dotenv';
// import { redis_host, redis_port, expire } from './config.js';

// const env = process.env.NODE_ENV || 'development';
// const config = dotenv.config({ path: `.env.${env}` });

// const UPSTASH_REDIS = config.parsed.UPSTASH_REDIS
// const client = new Redis(UPSTASH_REDIS);

// const app = express();
// const server = app.listen(8080);
// const io = new Server(server);

// app.use(express.static('static'));

// export const errorEmit = (socket) => {
//   return (err) => {
//     console.log(err);
//     socket.broadcast.emit('user.events', 'Something went wrong!');
//   };
// };

// io.on('connection', async (socket) => {
//   socket.broadcast.emit('user.events', 'Someone has joined!');
//   socket.on('name', (name) => {
//     storeUser(socket.id, name)
//     await client.setex(socket.id, expire, user)
//       .then(() => {
//         console.log(`${name} says hello!`);
//         socket.broadcast.emit('name', name);
//       }, errorEmit(socket));
//   });

//   socket.on('disconnect', () => {
//     // getUser(socket.id)
//     await client.get(socket.id)
//       .then((user) => {
//         if (user === null) return 'Someone';
//         else return user;
//       })
//       .then((user) => {
//         console.log(`${user} left`);
//         socket.broadcast.emit('user.events', `${user} left`);
//       }, errorEmit(socket));
//   });
// });
