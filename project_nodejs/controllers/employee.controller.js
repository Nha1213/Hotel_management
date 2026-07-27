const { Employee } = require("../models");
const { logError } = require("../middlewares/logError");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getAllEmployee = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where.full_name = {
        [Op.like]: `%${search}%`,
      };
    }

    const employees = await Employee.findAll({ where });

    return res.status(200).json({
      success: true,
      message: "fetched employees successfully",
      data: employees,
    });
  } catch (error) {
    logError("getAllEmployee", error, res);
  }
};

const buildPhoto = (filee) => {
  if (!filee) {
    return null;
  }
  return `/image/${filee.filename}`;
};

function checkRequire(full_name, gender, phone, role, salary, email, password) {
  if (full_name) {
    return res.status(400).json({
      success: false,
      message: "Full name is required",
    });
  }
  if (gender) {
    return res.status(400).json({
      success: false,
      message: "Gender is required",
    });
  }
  if (phone) {
    return res.status(400).json({
      success: false,
      message: "Phone is required",
    });
  }
  if (role) {
    return res.status(400).json({
      success: false,
      message: "Role is required",
    });
  }
  if (salary) {
    return res.status(400).json({
      success: false,
      message: "Salary is required",
    });
  }
  if (email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }
}

const registerEmployee = async (req, res) => {
  try {
    const { full_name, gender, phone, role, salary, email, password } =
      req.body;

    const file = req.files?.[0];
    const image = buildPhoto(file);

    checkRequire(full_name, gender, phone, role, salary, email, password);

    const passwordhash = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      full_name,
      gender,
      phone,
      role,
      salary,
      email,
      password: passwordhash,
      image,
    });

    return res.status(200).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (errpr) {
    logError("registerEmployee", error, res);
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const { full_name, gender, phone, role, salary, email, password } =
      req.body;

    const file = req.files?.[0];
    const image = buildPhoto(file);

    checkRequire(full_name, gender, phone, role, salary, email, password);

    const passwordhash = await bcrypt.hash(password, 10);

    employee.full_name = full_name;
    employee.gender = gender;
    employee.phone = phone;
    employee.role = role;
    employee.salary = salary;
    employee.email = email;
    employee.password = passwordhash;
    employee.image = image;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    logError("updateEmployee", error, res);
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.destroy();

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    logError("deleteEmployee", error, res);
  }
};

const login = async (req, res) => {
    try{
        const  {email, password} = req.body || {};
        if(!email){
          return res.status(400).json({
            success: false,
            message: "Email is required",
          });
        }
        if(!password){
          return res.status(400).json({
            success: false,
            message: "Password is required",
          });
        }
        const employee = await Employee.findOne({where: {email: email}});
        if(!employee){
          return res.status(404).json({
            success: false,
            message: "Employee not found",
          });
        }
        const isMatch = await bcrypt.compare(password, employee.password);
        if(!isMatch){
          return res.status(401).json({
            success: false,
            message: "Password is incorrect",
          });
        }
    }catch(error){
        logError("EmployeeLogin", error, res);
    }
};
module.exports = { getAllEmployee, registerEmployee, updateEmployee, deleteEmployee };
