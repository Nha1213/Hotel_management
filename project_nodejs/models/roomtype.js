'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomType.hasMany(models.Room,
        {
          foreignKey: 'room_type_id',
          as: 'rooms'
        }
      );
      // define association here
    }
  }
  RoomType.init({
    name: DataTypes.STRING,
    price_per_night: DataTypes.DECIMAL,
    max_guest: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RoomType',
  });
  return RoomType;
};