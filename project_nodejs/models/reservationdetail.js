'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReservationDetail.belongsTo(models.Room,{
        foreignKey: 'room_id',
        as: 'room'
      });
      ReservationDetail.belongsTo(models.Reservation,{
        foreignKey: 'reservation_id',
        as: 'reservation'
      })
      // define association here
    }
  }
  ReservationDetail.init({
    reservation_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    nights: DataTypes.INTEGER,
    subtotal: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'ReservationDetail',
  });
  return ReservationDetail;
};