'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.belongsTo(models.RoomType, {
        foreignKey: 'room_type_id',
        as: 'room_type'
      });

      Room.hasMany(models.ReservationDetail, {
        foreignKey: 'room_id',
        as: 'reservation_details'
      });

      // Relationship to Staff through StaffRoom
      Room.belongsToMany(models.Staff, {
        through: models.StaffRoom,
        foreignKey: 'room_id',
        otherKey: 'staff_id',
        as: 'staffs'
      });

      // Relationship to StaffRoom join table
      Room.hasMany(models.StaffRoom, {
        foreignKey: 'room_id',
        as: 'staff_rooms'
      });
    }
  }
  Room.init({
    room_number: DataTypes.STRING,
    room_type_id: DataTypes.INTEGER,
    floor: DataTypes.INTEGER,
    status: DataTypes.STRING,
    description: DataTypes.TEXT,
    // room_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};