
var net = require('net');

var velocity = 0;

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	console.log('MATH NUMBER: ',Math.random());
	return Math.floor(Math.random() * (max - min)) + min; //Включно з мінімальним та виключаючи максимальне значення 
}

function getInc(val, min, max) {
	val += 1;
	if(val >= max){
		val = min;
	}
  	return val; 
}

var client = new net.Socket();

function myConnect(message){
	client.connect(1337, '127.0.0.1', function() {
		console.log('Connected');
		client.write(message);
	});
}

client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
	setInterval(function() {

					client.write('(027043887991BR00160718A4928.5660N03159.8943E000.0035519264.2000000000L00000000)');

				},2000);
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

client.on('error', function(err) {
		console.log(err)
});
