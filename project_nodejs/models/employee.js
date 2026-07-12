'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Employee.hasMany(models.CheckIn, {
        foreignKey: 'employee_id',
        as: 'check_ins'
      });

      Employee.hasMany(models.CheckOut, {
        foreignKey: 'employee_id',
        as: 'check_outs'
      });
      // define association here

    }
  }
  Employee.init({
    full_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    salary: DataTypes.DECIMAL,
    hire_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};