'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PermissionGroup extends Model {
    static associate(models) {
      // A PermissionGroup has many Permissions
      PermissionGroup.hasMany(models.Permission, {
        foreignKey: 'group_id',
        as: 'permissions'
      });
    }
  }

  PermissionGroup.init(
    {
      group_name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'PermissionGroup',
    }
  );

  return PermissionGroup;
};