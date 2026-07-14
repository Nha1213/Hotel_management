const { Op } = require("sequelize");
const { Role, RolePermission, UserRole } = require("../models");
const { logError } = require("../middlewares/logError");

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createRole = async (req, res) => {
  // Start the transaction
  const t = await Role.sequelize.transaction();
  try {
    const { role_name, status, userId } = req.body || {};

    // 1. Create the Role (bound to transaction)
    const role = await Role.create({ role_name, status }, { transaction: t });

    // 2. Associate the role to the user (bound to transaction)
    // We use .create() here because we are inserting a single record.
    await UserRole.create(
      {
        role_id: role.id,
        user_id: userId,
      },
      { transaction: t },
    );

    // 3. Commit changes if everything succeeded
    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    // 4. ESSENTIAL: Rollback the transaction on failure
    if (t) await t.rollback();
    logError("createRole", error, res);
  }
};

module.exports = { getAllRoles, createRole };
