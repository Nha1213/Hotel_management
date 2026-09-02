'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Staff.belongsTo(models.Room, { 
        foreignKey: 'room_id', 
        resourceKey: 'id',
        as: 'room'
      });
    }
  }
  Staff.init({
    room_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    position: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};