'use strict';
module.exports = (sequelize, DataTypes) => {
  var trackData = sequelize.define('trackData', {
	lat: DataTypes.FLOAT(8,6),
	lng: DataTypes.FLOAT(9,6),
	speed: DataTypes.FLOAT(4,1),
	direction: DataTypes.FLOAT(5,2),
	gpsUid: DataTypes.STRING(12),
  trackerTime: DataTypes.DATE

  }, {});
  trackData.associate = function(models) {
    // associations can be defined here
  };
  return trackData;
};