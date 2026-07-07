'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ServiceOrder.init({
    reservation_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    total: DataTypes.DECIMAL,
    order_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ServiceOrder',
  });
  return ServiceOrder;
};