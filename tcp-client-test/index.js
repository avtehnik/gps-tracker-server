
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
	var test = 0;
	var x = 49;
	var y = 31;
	var invId = setInterval(function() {	//for testing: from 2001 to 2031 year
		var myYearStr = myYear.toString();
		if(myYearStr.length < 2){
			myYearStr = `0${myYear}`;
		}
		
		var myXStr = parseInt(x).toString();
		if(myXStr.length < 2){
			myXStr = `0${myXStr}`;
		}
		var myYStr = parseInt(y).toString();
		if(myYStr.length < 2){
			myYStr = `0${myYStr}`;
		}

		if(myYear > 30){
			myYear = 0;
			clearInterval(invId);
		}

		console.log("Math.sin(test)",Math.sin(test));
		console.log('myXStr!',myXStr);
		console.log('myYStr!',myYStr);
		console.log('myYear!',myYear);

		client.write(`(027043887991BR00${myYearStr}0718A${myXStr}${myYearStr}.5660N0${myYStr}${myYearStr}.8943E000.0035519264.2000000000L00000000)`);
		
		//client.write('(027043887991BR00160718A4928.5660N03159.8943E000.0035519264.2000000000L00000000)');
		console.log('send!');
		myYear += 1;
		x = x + (Math.random()*6-3);
		y = y + (Math.random()*6-3);
	},100);
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
