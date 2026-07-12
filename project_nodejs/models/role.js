'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.UserRole, {
        foreignKey: 'role_id',
        as: 'user_roles'
      });
      Role.hasMany(models.RolePermission, {
        foreignKey: 'role_id',
        as: 'role_permissions'
      })
      // define association here
    }
  }
  Role.init({
    role_name: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};