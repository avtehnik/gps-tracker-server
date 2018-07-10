	//true (027043887991BR00 160718 A49 28.5660 N031 59.8943 E 000.0 035519 264.2 000000000L00000000)
/*
(027043887991BR00160718A4928.5660N03159.8943E000.0035519264.2000000000L00000000)
*/
var trackerData = {
	decodePosition: function (text) {
        var matches = text.match(/^(\d{2,3})(\d{2}\.\d{3,4})([NESW])$/);

        var decdeg = 0.0;

        if (matches) {
            decdeg = parseFloat(matches[1]) + (parseFloat(matches[2]) / 60);
            if ((matches[3] == 'S') || (matches[3] == 'W')) {
                decdeg = decdeg * -1;
            }
        }
        return decdeg.toPrecision(9);
    },

    decodeBR00: function (data) {
    	var trackerDayTime = new Date();
		var gpsUid = data.substring(2, 13);
		var type = data.substring(13, 17);

		trackerDayTime.setUTCHours(parseInt(data.substring(50, 52)))
		trackerDayTime.setMinutes(parseInt(data.substring(52, 54)))
		trackerDayTime.setSeconds(parseInt(data.substring(54, 56)));
		trackerDayTime.setDate(parseInt(data.substring(21, 23)));
		trackerDayTime.setMonth(parseInt(data.substring(19, 21)) - 1);
		trackerDayTime.setYear(parseInt('20' + data.substring(17, 19)));

		var connection = data.substring(23, 24);
		var lat = this.decodePosition(data.substring(24, 34));
		var lng = this.decodePosition(data.substring(34, 45));
		var speed = parseFloat(data.substring(45, 50));
		var direction = parseFloat(data.substring(56, 62));

		return {
			type: type,
			lat: lat,
			lng: lng,
			gpsUid: gpsUid,
			speed: speed,
			direction: direction,
			trackerDayTime: trackerDayTime
		};
    },

	trackParse : function (rawData){						// return Array of valid messages
		rawData = rawData.match(/(\([\w\.]+\))/g);			// grab data in scope: "(message)"

		var returnArray = [];
		rawData.forEach((data) => {
			var type = data.substring(13, 17);
	        if (type == 'BR00') {
	        	returnArray.push(this.decodeBR00(data));
	        } else if (type == 'BP00') {
	            //result = this.handShake(str)
	        }
		});
		return returnArray;
	}
};

module.exports = {
	trackerData
};

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
			//12
	// 		12:	"072.7",				=> direction in degrees. 0=north, 90=east, 180=south, 270=west
	// 		13:	"L",					=> 'L' means Total mileage, unit is meter, mileage statistic
	// 		14:	"00000000",				=> 
	// 		15:	""
	// 	]

	/* MY SUPER CODE FOR PARSE >>*/
			// var typeRegExp = new RegExp(/(BR010)/);
			// var type = typeRegExp.exec(data);
			// if(type != null){
			// 	var myRegExp = new RegExp(/\(([0-9]+)(BR00)([^A-Z]+)(A)([0-9]{2})([0-9\.]+)([NS])([0-9]{3})([0-9\.]+)([EW])([0-9\.]{5})([0-9]{6})([0-9\.]{6})[0-9]+([L])([0-9]+)\)\s*\r*\n*/);
			// 	var execRes = myRegExp.exec(data);
			// 	var myTimeExp = new RegExp(/([0-9]{2})([0-9]{2})([0-9]{2})/);
			// 	var myDateExp = new RegExp(/([0-9]{2})([0-9]{2})([0-9]{2})/);
				
			// 	var timeArray = myTimeExp.exec(execRes[12]);
			// 	var dateArray = myDateExp.exec(execRes[3]);

			// 	var lat = (parseInt(execRes[5],10) + parseFloat(execRes[6])/60) * ( (execRes[7] === "N") ? 1 : -1 );
			// 	var lng = (parseInt(execRes[8],10) + parseFloat(execRes[9])/60) * ( (execRes[10] === "E") ? 1 : -1 );
			// 	var gpsUid = execRes[1];
			// 	var speed = execRes[11];
			// 	var direction = execRes[13];

			// 	var trackerDayTime = new Date();
			// 	trackerDayTime.setFullYear(parseInt(`20${dateArray[1]}`,10));
			// 	trackerDayTime.setMonth(parseInt(dateArray[2],10)-1); // -1 because start from 0
			// 	trackerDayTime.setDate(parseInt(dateArray[3],10));
			// 	trackerDayTime.setHours(parseInt(timeArray[1],10));
			// 	trackerDayTime.setMinutes(parseInt(timeArray[2],10));
			// 	trackerDayTime.setSeconds(parseInt(timeArray[3],10));

			// 	returnArray.push({
			// 		type:"BR00",
			// 		lat: lat,
			// 		lng: lng,
			// 		gpsUid: gpsUid,
			// 		speed: speed,
			// 		direction: direction,
			// 		trackerDayTime: trackerDayTime
			// 	});
			// }
/* MY SUPER CODE FOR PARSE <<*/