'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PermissionRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PermissionRole.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      })
      PermissionRole.belongsTo(models.Permission, {
        foreignKey: 'permission_id',
        as: 'permission'
      })
      // define association here
    }
  }
  PermissionRole.init({
    role_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PermissionRole',
  });
  return PermissionRole;
};