const config = require('./config');
var net = require('net');
const db = require('./models/index.js');
var { trackerData } = require('./parser');

var server = net.createServer(function(socket) {

	socket.setEncoding('utf8');

	socket.on('error', function(err) {
   		console.log(err)
	});

	socket.on('data', function(data) {
		//console.log(data);
		var messages = trackerData.trackParse(data);
		messages.forEach(function (message){
			if(message.type == 'BR00'){			// regular GPS message
				db.trackData.create({
					lat: message.lat,
					lng: message.lng,
					speed: message.speed,
					direction: message.direction,
					gpsUid: message.gpsUid,
					trackerTime: message.trackerDayTime//myDateTime
				});
			}else if(message.type == 'BP05'){	// handshake
				socket.write(`(0${message.gpsUid}AP05)`);
			}
		});
		//socket.write(data); // test for client
	});
});

server.listen(config.tcp_port, '0.0.0.0');

/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/
