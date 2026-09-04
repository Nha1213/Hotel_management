'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StaffRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StaffRoom.belongsTo(models.Room, {
        foreignKey: 'room_id',
        as: 'room'
      });

      StaffRoom.belongsTo(models.Staff, {
        foreignKey: 'staff_id',
        as: 'staff'
      });
    }
  }
  StaffRoom.init({
    room_id: DataTypes.INTEGER,
    staff_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StaffRoom',
  });
  return StaffRoom;
};