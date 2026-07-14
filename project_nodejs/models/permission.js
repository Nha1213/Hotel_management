"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {

      Permission.belongsTo(models.PermissionGroup, {
        foreignKey: "group_id",
        as: "group",
      });

      Permission.hasMany(models.PermissionRole, {
        foreignKey: "permission_id",
        as: "role_permissions",
      });

      Permission.belongsToMany(models.Role, {
        through: models.PermissionRole,
        foreignKey: "permission_id",
        as: "roles",
      });

    }
  }

  Permission.init(
    {
      permission_name: DataTypes.STRING,
      group_id: DataTypes.INTEGER,
      route_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Permission",
    }
  );

  return Permission;
};