"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User 1 : 1 UserProfile
      User.hasOne(models.UserProfile, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "profile",
      });

      // User 1 : Many UserRole
      User.hasMany(models.UserRole, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "user_roles",
      });

      // User Many : Many Role
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: "user_id",
        otherKey: "role_id",
        as: "roles",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );

  return User;
};