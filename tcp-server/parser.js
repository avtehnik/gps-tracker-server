/*	exaple of regular message
(027043887991BR00160718A4928.5660N03159.8943E000.0035519264.2000000000L00000000)
	exaple of handshake message
(027044803070BP05355227044803070180710A4925.4377N03205.8939E000.0145641000.0000000000L00000000)
	needed response:
(027044803070AP05)
where 27044803070 tracker id
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

    decodeBR05: function (data) {			// not finished (not all parsed)
    	var trackerDayTime = new Date();
		var gpsUid = data.substring(2, 13);
		var type = data.substring(13, 17);

		return {
			type: type,
			gpsUid: gpsUid,
		};
    },

	trackParse : function (rawData){						// return Array of valid messages
		rawData = rawData.match(/(\([\w\.]+\))/g);			// grab data in scope: "(message)"

		//console.log(rawData);
		var returnArray = [];
		if(rawData != null){
			rawData.forEach((data) => {
				var type = data.substring(13, 17);
		        if (type == 'BR00') {
		        	returnArray.push(this.decodeBR00(data));
		        } else if (type == 'BP05') {
		            returnArray.push(this.decodeBR05(data));
		        } else if (type == 'BP00') {
		            //result = this.handShake(str)
		        }
			});
		}
		return returnArray;
	}
};

module.exports = {
	trackerData
};
