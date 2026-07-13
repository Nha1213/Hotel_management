"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PermissionRole extends Model {
    static associate(models) {
      PermissionRole.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });

      PermissionRole.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        as: "permission",
      });
    }
  }

  PermissionRole.init(
    {
      role_id: DataTypes.INTEGER,
      permission_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PermissionRole",
    }
  );

  return PermissionRole;
};