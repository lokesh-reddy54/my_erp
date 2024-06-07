'use strict';

var Q = require('q');
var moment = require('moment');
var _ = require('lodash');


var config = require('./utils/config').config;
var log = require('./utils/log').log;
var utils = require('./utils/utils').utils;

var server = {};
var io;

server.connect = async (httpServer) => {
  io = require('socket.io')(httpServer);
  exports.io = io;
  initSocket();
}

var initSocket = function() {
  log.write("SocketServer ::: initSocket :: socket server connected and initialised ... !!");
  io.on('connection', socket => {
    // socket.emit('request', /* … */ ); // emit an event to the socket
    // io.emit('broadcast', /* … */ ); // emit an event to all connected sockets
    // socket.on('reply', () => { /* … */ }); // listen to the event
    socket.on('incoming_call', (data) => {
      log.write("Socket ::: incoming_call :: data : ", data);
      io.emit('incoming_call', data);
    });

    socket.on('call_now', (data) => {
      log.write("Socket ::: call_now :: data : ", data);
      io.emit('call_now', data);
    });
    log.write("Server ::: listenSocket  :: client socket connected .. !! ");
  });
}

exports.server = server;