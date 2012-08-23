const message_server_port = 8000;
const redis_host = '127.0.0.1';
const redis_port = 6379;

var express = require('express');
var redis = require('redis');
var socket = require('socket.io');
var server = express();
var io = socket.listen(server);

// start express server listening
server.listen(message_server_port, function() {
    console.log('Express server started');
    
});

var redisClient = redis.createClient(redis_port, redis_host);

redisClient.on('ready', function() {
	console.log('Redis client connected to server ' + redis_host + ':' + redis_port);	
});


io.sockets.on('connection', function (socket) {
	socket.emit('hello', 'Hi there, this is server');
});	


