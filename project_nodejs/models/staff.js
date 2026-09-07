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
      // Staff.belongsToMany(models.Room, {
      //   through: models.StaffRoom,
      //   foreignKey: 'staff_id',
      //   otherKey: 'room_id',
      //   as: 'room'
      // });

      Staff.belongsToMany(models.Room, {
        through: models.StaffRoom,
        foreignKey: 'staff_id',
        otherKey: 'room_id',
        as: 'rooms'
      });


      Staff.hasMany(models.StaffRoom, {
        foreignKey: 'staff_id',
        as: 'staff_rooms'
      })
    }
  }
  Staff.init({
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