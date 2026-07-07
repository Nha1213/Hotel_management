'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CheckOut extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CheckOut.init({
    reservation_id: DataTypes.INTEGER,
    employee_id: DataTypes.INTEGER,
    checkout_time: DataTypes.DATE,
    total_amount: DataTypes.DECIMAL,
    damage_fee: DataTypes.DECIMAL,
    discount: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'CheckOut',
  });
  return CheckOut;
};