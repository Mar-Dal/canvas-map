var express = require('express');

var app = express();

var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running.");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log('new connection: '+ socket.id);
	socket.on('start', startMsg);

	function startMsg(data){
		socket.broadcast.emit('start', data);
		console.log(data);
	}
	socket.on('paint', paintMsg);

	function paintMsg(data){
		socket.broadcast.emit('paint', data);
		console.log(data);
	}
}
