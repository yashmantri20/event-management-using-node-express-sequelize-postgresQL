'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Guests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id',
          onDelete: "CASCADE"
        },
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Events',
          },
          key: 'id',
          onDelete: "CASCADE"
        },
      },
      eventName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Guests');
  }
};