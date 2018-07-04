
var net = require('net');

var Sequelize = require('sequelize');

var connection = new Sequelize('tracker_db', 'track-user', 'password',{
	host: 'localhost',
  	dialect: 'mysql',
  	operatorsAliases: false,

  	pool: {
    	max: 5,
    	min: 0,
    	acquire: 30000,
    	idle: 10000
  	}
});

var Article = 	connection.define('track_data', {
	date: Sequelize.INTEGER,
	lat: Sequelize.FLOAT(8,6),
	lng: Sequelize.FLOAT(9,6),
	speed: Sequelize.FLOAT(4,1),
	direction: Sequelize.FLOAT(5,2),
	gpsUid: Sequelize.STRING(12)
});

var server = net.createServer(function(socket) {

	socket.setEncoding('utf8');

	socket.on('error', function(err) {
   		console.log(err)
	});

	socket.on('data', function(data) {
		//console.log(data);
		var myRegExp = new RegExp(/\(([0-9]+)(BR00)([^A-Z]+)(A)([0-9]{2})([0-9\.]+)([NS])([0-9]{3})([0-9\.]+)([EW])([0-9\.]{5})[0-9]{6}([0-9\.]{6})[0-9]+([L])([0-9]+)\)\s*\r*\n*/);
		var execRes = myRegExp.exec(data);

		// for data:
		// 		(027042573071BR00141206A1904.6176N07250.8073E002.50952072.730000000000L00000000)
		// dataArray should contain:
		//	[	0:	"(027042573071BR00141206A1904.6176N07250.8073E002.50952072.730000000000L00000000)",
		// 		1:	"027042573071",			=> imei number (should have been only 10 chars, but its 12)
		// 		2:	"BR00",					=> command word
		// 		3:	"141206",				=> date YYMMDD
		// 		4:	"A",					=> available
		// 		5:	"19", 					=> longitude degrees (0-90 only)
		// 		6:	"04.6176", 				=> longitude minutes
		// 		7:	"N",					=> longitude hemisphere
		// 		8:	"072", 					=> latitude degrees (0-180 only)
		// 		9:	"50.8073", 				=> latitude minutes
		// 		10:	"E", 					=> latitude E/W
		// 		11:	"002.5",	 			=> speed (knot/hr or km/hr)
		// 		12:	"072.7",				=> direction in degrees. 0=north, 90=east, 180=south, 270=west
		// 		13:	"L",					=> 'L' means Total mileage, unit is meter, mileage statistic
		// 		14:	"00000000",				=> 
		// 		15:	""
		// 	]

		var lat = (parseInt(execRes[5]) + parseFloat(execRes[6])/60) * ( (execRes[7] === "N") ? 1 : -1 );
		var lng = (parseInt(execRes[8]) + parseFloat(execRes[9])/60) * ( (execRes[10] === "E") ? 1 : -1 );
		var date = execRes[3];//.split(/([0-9]{2})([0-9]{2})([0-9]{2})/);
		var ctime = (new Date(date[2] + "-" + date[3] + "-" + date[1] )).getTime();
		var gpsUid = execRes[1];
		var speed = execRes[11];
		var direction = execRes[12];

		console.log('latitude: ', lat,
					'\r\nlongitude: ', lng,
					'\r\ndate: ', date,
					'\r\nctime: ', ctime,
					'\r\ngpsUid: ', gpsUid,
					'\r\nspeed: ', speed,
					'\r\ndirection: ', direction
		);

		connection.sync().then(function (){
			Article.create({
				date: date,
				lat: lat,
				lng: lng,
				speed: speed,
				direction: direction,
				gpsUid: gpsUid
			});
		});
 

	//"gpsUid=%s&msgType=locationUpdate&loc=[%s,%s]&speed=%s&direction=%s",
	// deviceId, latitude, longitude, speed, direction)
	// var httpRes =
	// 	  'gpsUid=' + execRes[1]
	// 	+ '&msgType=locationUpdate'
	// 	+ '&loc=['+ lat+','+ lng+']'
	// 	+ '&speed='+ execRes[11]
	// 	+ '&direction='+ execRes[12]
	// 	+ '&ctime='+ ctime;
	//console.log("gt02a:BR00: httpRes is: ", httpRes);
		
		socket.write(data);
	});

	socket.write('Echo server\r\n');
	//socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');

/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo server
*/
