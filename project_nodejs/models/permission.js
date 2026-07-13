'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // A Permission belongs to one PermissionGroup
      Permission.belongsTo(models.PermissionGroup, {
        foreignKey: 'group_id',
        as: 'group'
      });

      // A Permission has many PermissionRoles
      Permission.hasMany(models.PermissionRole, {
        foreignKey: 'permission_id',
        as: 'permission_roles'
      });
    }
  }

  Permission.init(
    {
      permission_name: DataTypes.STRING,
      group_id: DataTypes.INTEGER,
      route_name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Permission',
    }
  );

  return Permission;
};