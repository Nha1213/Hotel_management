"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {

      Role.hasMany(models.UserRole, {
        foreignKey: "role_id",
        as: "user_roles",
      });

      Role.belongsToMany(models.Permission, {
        through: models.PermissionRole,
        foreignKey: "role_id",
        as: "permissions",
      });

      Role.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: "role_id",
        as: "users",
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