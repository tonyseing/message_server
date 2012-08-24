

message_server = function() {
	const message_server_port = 8001;
	const redis_host = '127.0.0.1';
	const redis_port = 6379;


	var express = require('express'),
		redis = require('redis'),
		socket = require('socket.io'),
		server = require('http').createServer(express);

	var io = socket.listen(server);
	server.listen(message_server_port);

	// start express server listening
	server.listen(message_server_port, function() {
	    console.log('Express server started');
	    
	});



	var redisClient = redis.createClient(redis_port, redis_host);

	redisClient.on('ready', function() {
		console.log('Redis client connected to server ' + redis_host + ':' + redis_port);	
	});



	io.sockets.on('connection', function (client_socket) {
		client_socket.emit('message', { content: 'Hi there, this is server. Welcome to the chat.'});
		

		client_socket.on('message', function(message) {
			console.log('client_socket.on: message --' + message.content);
			client_socket.broadcast.emit('message', message);
		});
	});





};

message_server();

exports = message_server;

