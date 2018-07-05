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

var TrackerData = connection.define('track_data', {
	date: Sequelize.INTEGER,
	lat: Sequelize.FLOAT(8,6),
	lng: Sequelize.FLOAT(9,6),
	speed: Sequelize.FLOAT(4,1),
	direction: Sequelize.FLOAT(5,2),
	gpsUid: Sequelize.STRING(12)
});

//connection.sync();

module.exports = {
	connection,
	TrackerData
}