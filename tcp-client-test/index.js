
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
	var myYear = 0;
	var invId = setInterval(function() {
					myYear += 1;							//for testing: from 2001 to 2031 year
					var myYearStr = myYear.toString();
					if(myYearStr.length < 2){
						myYearStr = `0${myYear}`;
					}
					if(myYear > 30){
						myYear = 0;
						clearInterval(invId);
					}
					client.write(`(027043887991BR00${myYearStr}0718A4928.5660N03159.8943E000.0035519264.2000000000L00000000)(027043887991BR00${myYearStr}0718A4928.5660N03159.8943E000.0035519264.2000000000L00000000)(027043887991BP00BAra.hlo)`);
					
					//client.write('(027043887991BR00160718A4928.5660N03159.8943E000.0035519264.2000000000L00000000)');
					console.log('send!');
				},200);
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
