'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReservationDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reservation_id: {
        type: Sequelize.INTEGER,
        references:{
          model: "Reservations",
          key: "id",
          onDelete: "CASCADE",
        }
      },
      room_id: {
        type: Sequelize.INTEGER,
        references:{
          model: "Rooms",
          key: "id",
          onDelete: "CASCADE",
        }
      },
      price: {
        type: Sequelize.DECIMAL
      },
      nights: {
        type: Sequelize.INTEGER
      },
      subtotal: {
        type: Sequelize.DECIMAL
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReservationDetails');
  }
};