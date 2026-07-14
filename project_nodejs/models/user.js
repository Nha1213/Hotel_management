"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserProfile, {
        foreignKey: "user_id",
        as: "userp_rofile",
      });

      User.hasMany(models.UserRole, {
        foreignKey: "user_id",
        as: "user_roles",
      });
      
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: "user_id",
        as: "roles",
      }); 
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};