// const express = require('express'),
//   socketio = require('socket.io');

// var app = express();
// var server = app.listen(8080);
// var io = socketio(server);

// app.use(express.static('static'));

// io.on('connection', (socket) => {
//   console.log('A socket is now open');
//   console.log(socket);
// });

import express from 'express';
import socketio from 'socket.io';

const app = express();
const server = app.listen(8080);
const io = socketio(server);

app.use(express.static('static'));

io.on('connection', (socket) => {
  console.log('A socket is now open');
  console.log(socket);
});
