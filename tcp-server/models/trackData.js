'use strict';
module.exports = (sequelize, DataTypes) => {
  var trackData = sequelize.define('trackData', {
	lat: Sequelize.FLOAT(8,6),
	lng: Sequelize.FLOAT(9,6),
	speed: Sequelize.FLOAT(4,1),
	direction: Sequelize.FLOAT(5,2),
	gpsUid: Sequelize.STRING(12),
  trackerTime: Sequelize.DATE

  }, {});
  trackData.associate = function(models) {
    // associations can be defined here
  };
  return trackData;
};