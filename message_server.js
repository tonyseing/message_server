

message_server = function() {
	const default_message_server_port = 8001;
	const redis_host = '127.0.0.1';
	const redis_port = 6379;
	

	// checks to see if any ports specified at command line prompt
	// if no port is specified, the server will run on the default
	// message port stored in default_message_server_port
	if (process.argv[2]) // port specified
	{
		var message_server_port = process.argv[2];
		console.log('port specified -- using port ' + message_server_port);

	}
	else
	{
		var message_server_port = default_message_server_port;
		console.log('no port specified -- using port ' + default_message_server_port);

	}


	console.log('process.argv ' + process.argv[2]);
	var express = require('express'),
		redis = require('redis'),
		socket = require('socket.io'),
		server = require('http').createServer(express);

	var io = socket.listen(server);

	// start express server listening
	server.listen(message_server_port, function() {
	    console.log('Express server started');
	    
	});




	



	io.sockets.on('connection', function (client_socket) {
		client_socket.emit('message', { content: 'Hi there, this is server. Welcome to the chat.'});
		
		// chat functionality -- publish messages as they're sent from clients
		client_socket.on('message', function(message) {
			console.log('client_socket.on: message --' + message.content);
			client_socket.broadcast.emit('message', message);
		});

		// notification functionality
		client_socket.on('subscribe', function(channel) {
			// this should be in here to fix race condition
			var redisClient = redis.createClient(redis_port, redis_host);

			console.log('client_socket on subscribe');
			redisClient.on('ready', function() {
				console.log('Redis client connected to server ' + redis_host + ':' + redis_port);
				redisClient.subscribe(channel);
				console.log('Redis client subscribed to  ' + channel);

				redisClient.on('message', function(channel, message) {
					client_socket.emit('notification', message);	
				});
			});
		});	

	});





};

message_server();

exports = message_server;

