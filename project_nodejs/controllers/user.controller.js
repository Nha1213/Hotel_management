const { User, UserProfile } = require("../models");
const { logError } = require("../middlewares/logError");
const  { invalid } = require("../middlewares/prevent");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const buildPhotoPath = (file) => {
  if (!file) return null;
  return `/image/${file.filename}`;
};

const getAllUsers = async (req, res) => {
  try {
    const { search, id } = req.query;

    if (id) {
      const users = await User.findOne({
        where: {
          id,
        },
      });

      return res.json({
        success: true,
        message: "Fetch User Successful",
        data: users,
      });
    }

    if (search) {
      const users = await User.findAll({
        where: {
          [Op.or]: [{ username: { [Op.like]: `%${search}%` } }],
        },
      });

      return res.json({
        success: true,
        message: "Fetch User Successful",
        data: users,
      });
    }

    const users = await User.findAll();
    res.json({
      success: true,
      message: "Fetch User Successful",
      data: users,
    });
  } catch (error) {
    logError("getAllUsers", error, res);
  }
};

const registerUser = async (req, res) => {
  const t = await User.sequelize.transaction();

  try {
    const {
      username,
      password,
      first_name,
      last_name,
      gender,
      phone,
      address,
    } = req.body;

    const file = req.files?.[0];
    const image = buildPhotoPath(file);

    // Check if username already exists
    const existingUser = await User.findOne({
      where: { username },
      transaction: t,
    });

    if (existingUser) {
      await t.rollback();

      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create(
      {
        username,
        password: hashedPassword,
      },
      {
        transaction: t,
      }
    );

    // Create User Profile
    const profile = await UserProfile.create(
      {
        user_id: user.id,
        first_name,
        last_name,
        gender,
        phone,
        address,
        image,
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    await t.rollback();
    logError("registerUser", error, res);
  }
};

module.exports = {
  getAllUsers,
  registerUser,
};
        