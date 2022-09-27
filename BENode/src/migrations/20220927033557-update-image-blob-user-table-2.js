'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('users', 'image', {
          type: Sequelize.BLOB('long'),
          allowNull: true,
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('users', 'image', {
          type: Sequelize.STRING,
          allowNull: true,
      })
    ])
  }
};
