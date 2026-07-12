'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Reservation, {
        foreignKey: 'reservation_id',
        as: 'reservation'
      })
      // define association here
    }
  }
  Payment.init({
    reservation_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    payment_method: DataTypes.STRING,
    payment_date: DataTypes.DATE,
    transaction_id: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};