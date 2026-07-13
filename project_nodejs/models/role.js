"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.UserRole, {
        foreignKey: "role_id",
        as: "user_roles",
      });

      Role.hasMany(models.PermissionRole, {
        foreignKey: "role_id",
        as: "permission_roles",
      });
    }
  }

  Role.init(
    {
      role_name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Role",
    }
  );

  return Role;
};