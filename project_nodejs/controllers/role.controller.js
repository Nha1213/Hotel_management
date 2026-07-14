const { Op } = require("sequelize");
const { Role, Permission, UserRole } = require("../models");
const { logError } = require("../middlewares/logError");

const getAllRoles = async (req, res) => {
  try {
    const {search} = req.query;

    const where = {};

    if (search) {
      where.role_name = {
        [Op.like]: `%${search}%`,
      };
    }

    const roles = await Role.findAll({
      where,
      include: [
        {
          model: Permission,
          as: "permissions",
        },
      ],
      order:[["id", "DESC"]],
    });
    res.status(200).json({
      success: true,
      message: "fetched roles successfully",
      data: roles
    });
  } catch (error) {
    logError("getAllRoles", error, res);
  }
};

const createRole = async (req, res) => {
  // Start the transaction
  const t = await Role.sequelize.transaction();
  try {
    const { role_name, status, userId } = req.body || {};
    if(!userId){
      return res.status(400).json({
        success: false,
        message: "User id is required",
      })
    }

    if(!role_name){
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      })
    }

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

const updateRole = async (req, res) => {
  const t = await Role.sequelize.transaction();
  try{
    const {id} = req.params;
    const {role_name, status, userId} = req.body;

    if(!id){
      return res.status(400).json({
        success: false,
        message: "Role id is required",
      })
    }

    if(!userId){
      return res.status(400).json({
        success: false,
        message: "User id is required",
      })
    }

    const role = await Role.findByPk(id);
    if(!role){
      return res.status(404).json({
        success: false,
        message: "Role not found",
      })
    }

    const roleResult = await Role.update({role_name, status}, {where:{id}}, {transaction: t});

    const userRole = await UserRole.findOne({where:{role_id: id}});
    if(userRole){
      await UserRole.update({user_id: userId}, {where:{role_id: id}}, {transaction: t});
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: [
        roleResult,
        userRole
      ],
    })

  }catch(error){
    logError("updateRole", error, res);
  }
};

const deleteRole = async (req, res) =>{
  try{
    const {id} = req.params;

    if(!id){
      return res.status(400).json({
        success: false,
        message: "Role id is required",
      })
    }

    const role = await Role.findByPk(id);
    if(!role){
      return res.status(404).json({
        success: false,
        message: "Role not found",
      })
    }

    await Role.destroy({where:{id}});

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    })
  }catch(error){
    logError("deleteRole", error, res);
  }
}

module.exports = { getAllRoles, createRole, updateRole, deleteRole };
