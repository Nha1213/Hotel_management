const { Customer } = require("../models");
const { logError } = require("../middlewares/logError");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../util/TOKEN_SECRET");
const buildPhoto = (file) => {
  if (!file) {
    return null;
  }
  return `/image/${file.filename}`;
};

const getAllCustomers = async (req, res) => {
  try {
    const { search, email, phone, full_name } = req.query;

    const where = {
      deletedAt: {
        [Op.is]: null,
      },
    };

    // Search across full_name, email, and phone
    if (search) {
      where[Op.or] = [
        {
          full_name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          phone: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    // Search by email
    if (email) {
      where.email = {
        [Op.like]: `%${email}%`,
      };
    }

    // Search by phone
    if (phone) {
      where.phone = {
        [Op.like]: `%${phone}%`,
      };
    }

    // Search by full name
    if (full_name) {
      where.full_name = {
        [Op.like]: `%${full_name}%`,
      };
    }

    const customers = await Customer.findAll({
      where,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      data: customers,
    });
  } catch (error) {
    logError(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

function checkRequire(
  first_name,
  last_name,
  gender,
  phone,
  email,
  nationality,
  address,
  full_name,
  password,
) {
  if (first_name) {
    return res.status(400).json({
      success: false,
      message: "First name is required",
    });
  }
  if (last_name) {
    return res.status(400).json({
      success: false,
      message: "Last name is required",
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
  if (email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (nationality) {
    return res.status(400).json({
      success: false,
      message: "Nationality is required",
    });
  }
  if (address) {
    return res.status(400).json({
      success: false,
      message: "Address is required",
    });
  }
  if (full_name) {
    return res.status(400).json({
      success: false,
      message: "Full name is required",
    });
  }
  if (password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }
}

const registerCustomer = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      phone,
      email,
      nationality,
      passport_no,
      address,
      full_name,
      password,
    } = req.body;

    const file = req.files?.[0];
    const image = buildPhoto(file);

    checkRequire(
      first_name,
      last_name,
      gender,
      phone,
      email,
      nationality,
      address,
      full_name,
      password,
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      first_name,
      last_name,
      gender,
      phone,
      email,
      nationality,
      passport_no,
      address,
      full_name,
      password: hashedPassword,
      image,
    });
    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: customer,
    });
  } catch (error) {
    logError("registerCustomer", error, res);
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const {
      first_name,
      last_name,
      gender,
      phone,
      email,
      nationality,
      address,
      full_name,
      password,
    } = req.body;

    const file = req.files?.[0];
    const image = buildPhoto(file);

    checkRequire(
      first_name,
      last_name,
      gender,
      phone,
      email,
      nationality,
      address,
      full_name,
      password,
    );

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateCustomer = await customer.update(
      {
        first_name: first_name || customer.first_name,
        last_name: last_name || customer.last_name,
        gender: gender || customer.gender,
        phone: phone || customer.phone,
        email: email || customer.emails,
        nationality: nationality || customer.nationality,
        address: address || customer.address,
        full_name: full_name || customer.full_name,
        password: password || hashedPassword,
        image: image || customer.image,
      },
      {
        where: {
          id,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: updateCustomer,
    });
  } catch (error) {
    logError("updateCustomer", error, res);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await customer.destroy();

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    logError("deleteCustomer", error, res);
  }
};

const LoginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Customer password is required",
      });
    }
    // 1. Check customer
    const customer = await Customer.findOne({ where: { email } });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer logged in successfully",
      data: customer,
      access_token: await getAccessToken(customer),
    });
  } catch (error) {
    logError("LoginCustomer", error, res);
  }
};

const getAccessToken = async (paramData) => {
  const access_token = await jwt.sign({ data: paramData }, TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return access_token;
};

module.exports = {
  getAllCustomers,
  registerCustomer,
  updateCustomer,
  deleteCustomer,
  LoginCustomer,
};
