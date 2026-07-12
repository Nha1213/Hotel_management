'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reservation.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      })

      reservation.hasMany(models.ReservationDetail, {
        foreignKey: 'reservation_id',
        as: 'reservation_details'
      })

      reservation.hasMany(models.ServiceOrder, {
        foreignKey: 'reservation_id',
        as: 'service_orders'
      })

      reservation.hasMany(models.Payment, {
        foreignKey: 'reservation_id',
        as: 'payments'
      })

      reservation.belongsTo(models.CheckIn, {
        foreignKey: 'reservation_id',
        as: 'check_ins'
      })

      reservation.belongsTo(models.CheckOut, {
        foreignKey: 'reservation_id',
        as: 'check_outs'
      })


      // define association here
    }
  }
  Reservation.init({
    customer_id: DataTypes.INTEGER,
    reservation_date: DataTypes.DATE,
    check_in_date: DataTypes.DATE,
    check_out_date: DataTypes.DATE,
    total_guest: DataTypes.INTEGER,
    status: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reservation',
  });
  return Reservation;
};