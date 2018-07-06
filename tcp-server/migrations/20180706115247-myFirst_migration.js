'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    //return 
    queryInterface.removeColumn(
      'track_data',
      'date'
    );
    queryInterface.addColumn(
        'track_data',
        'date_time',
        Sequelize.DATE
    );
  },


  down: (queryInterface, Sequelize) => {
    //return 
    queryInterface.addColumn(
        'track_data',
        'date',
        Sequelize.INTEGER
    );
    queryInterface.removeColumn(
      'track_data',
      'date_time'
    );
  }
};
