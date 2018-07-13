'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('trackData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lat: {
        type: Sequelize.FLOAT(8,6)
      },
      lng: {
        type: Sequelize.FLOAT(9,6)
      },
      speed: {
        type: Sequelize.FLOAT(4,1)
      },
      direction: {
        type: Sequelize.FLOAT(5,2)
      },
      gpsUid: {
        type: Sequelize.STRING(12)
      },
      trackerTime: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('trackData');
  }
};
