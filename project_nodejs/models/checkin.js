'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CheckIn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CheckIn.belongsTo(models.Reservation, {
        foreignKey: 'reservation_id',
        as: 'reservation'
      })

      CheckIn.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee'
      })
      // define association here
    }
  }
  CheckIn.init({
    reservation_id: DataTypes.INTEGER,
    employee_id: DataTypes.INTEGER,
    checkin_time: DataTypes.DATE,
    deposit: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'CheckIn',
  });
  return CheckIn;
};