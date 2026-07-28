"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  UserProfile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      gender: {
        type: DataTypes.STRING,
      },

      address: {
        type: DataTypes.STRING,
      },

      phone: {
        type: DataTypes.STRING,
      },

      image: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "UserProfile",
      tableName: "UserProfiles",
    }
  );

  return UserProfile;
};