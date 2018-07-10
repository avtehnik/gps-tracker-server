const config = require('./config');
var net = require('net');
const { TrackerDatabase } = require('./db');
var { trackerData } = require('./parser');

var server = net.createServer(function(socket) {

	socket.setEncoding('utf8');

	socket.on('error', function(err) {
   		console.log(err)
	});

	socket.on('data', function(data) {
		//console.log(data);
		var parsedData = trackerData.trackParse(data);
		parsedData.forEach(function (object){
			if(object.type == 'BR00'){
				TrackerDatabase.create({
					lat: object.lat,
					lng: object.lng,
					speed: object.speed,
					direction: object.direction,
					gpsUid: object.gpsUid,
					trackerTime: object.trackerDayTime//myDateTime
				});
			}
		});
		//socket.write(data); // test for client
	});
	//socket.write('Echo server\r\n');
});

server.listen(config.tcp.port, config.tcp.host);

/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/
