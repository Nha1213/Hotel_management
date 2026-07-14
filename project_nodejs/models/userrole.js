"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {

      UserRole.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

      UserRole.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });

    }
  }

  UserRole.init(
    {
      user_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserRole",
    }
  );

  return UserRole;
};