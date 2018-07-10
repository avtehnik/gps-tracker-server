const config = require('./config');
var Sequelize = require('sequelize');

const Op = Sequelize.Op;

var connection = new Sequelize(config.sql.db, config.sql.user, config.sql.pass,{
	host: config.sql.host,
  	dialect: config.sql.dialect,
  	//operatorsAliases: false,
    operatorsAliases: { $between: Op.between },
  	logging: false,
  	pool: {
    	max: 5,
    	min: 0,
    	acquire: 30000,
    	idle: 10000
  	}
});

var TrackerDatabase = connection.define(config.sql.table, {
	lat: Sequelize.FLOAT(8,6),
	lng: Sequelize.FLOAT(9,6),
	speed: Sequelize.FLOAT(4,1),
	direction: Sequelize.FLOAT(5,2),
	gpsUid: Sequelize.STRING(12),
  trackerTime: Sequelize.DATE
});

module.exports = {
	TrackerDatabase
}
