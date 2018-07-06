const config = require('./config');
var Sequelize = require('sequelize');

var connection = new Sequelize(config.sql.db, config.sql.user, config.sql.pass,{
	host: config.sql.host,
  	dialect: config.sql.dialect,
  	operatorsAliases: false,
  	// disable logging; default: console.log
  	logging: false,
  	pool: {
    	max: 5,
    	min: 0,
    	acquire: 30000,
    	idle: 10000
  	}
});

var TrackerData = connection.define(config.sql.table, {
	lat: Sequelize.FLOAT(8,6),
	lng: Sequelize.FLOAT(9,6),
	speed: Sequelize.FLOAT(4,1),
	direction: Sequelize.FLOAT(5,2),
	gpsUid: Sequelize.STRING(12),
  date_time: Sequelize.DATE
});

module.exports = {
	TrackerData
}
