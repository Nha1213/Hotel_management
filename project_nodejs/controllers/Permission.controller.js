const { Op } = require("sequelize");
const { Permission, sequelize, PermissionRole, PermissionGroup } = require("../models");
const { logError } = require("../middlewares/logError");

const getAllPermission = async (req, res) => {
  try {
    const { search } = req.query;

    const where = {};

    if (search?.trim()) {
      where.permission_name = {
        [Op.like]: `%${search.trim()}%`,
      };
    }

    const permissions = await Permission.findAll({
      where,
      include: [
        {
          model: PermissionGroup,
          as: "permission_group",
          attributes: ["id", "group_name"],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Permissions fetched successfully.",
      data: permissions,
    });
  } catch (error) {
    return logError("getAllPermission", error, res);
  }
};

const createPermission = async (req, res) => {
  const t = await Permission.sequelize.transaction();
  try {
    const { permission_name, group_id, route_name, role_id } = req.body;
    if (!permission_name) {
      return res.status(400).json({
        success: false,
        message: "Permission name is required",
      });
    }

    if (!group_id) {
      return res.status(400).json({
        success: false,
        message: "Group id is required",
      });
    }
    if (!route_name) {
      return res.status(400).json({
        success: false,
        message: "Route name is required",
      });
    }
    const permission = await Permission.create(
      {
        permission_name,
        group_id,
        route_name,
      },
      { transaction: t },
    );

    const permissionRole = await PermissionRole.create(
      {
        permission_id: permission.id,
        role_id: role_id,
      },
      {
        transaction: t,
      },
    );
    await t.commit();
    res.status(200).json({
      success: true,
      message: "Permission created successfully",
      data: permission,
    });
  } catch (error) {
    logError("createPermission", error, res);
  }
};

const updatePermission = async (req, res) => {
  const t = await Permission.sequelize.transaction();
  try {
    const { id } = req.params;
    const { permission_name, group_id, route_name, role_id } = req.body;

    const checkPermission = await Permission.findByPk(id);
    if (!checkPermission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    const updatedRows = await Permission.update(
      {
        permission_name,
        group_id,
        route_name,
      },
      {
        where: { id },
      },
      { transaction: t },
    );

    const permissionRole = await PermissionRole.update(
      {
        permission_id: id,
        role_id: role_id,
      },
      { where: { permission_id: id } },
      {
        transaction: t,
      },
    );
    await t.commit();
    res.status(200).json({
      success: true,
      message: "Permission updated successfully",
    });
  } catch (error) {
    logError("updatePermission", error, res);
  }
};

const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;


    if(!id){
      return res.status(400).json({
        success: false,
        message: "Permission id is required",
      })
    }

    const permission = await Permission.destroy({ where: { id } }, { transaction: t });

    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    const permissionRole = await PermissionRole.destroy({ where: { permission_id: id } }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    logError("deletePermission", error, res);
  }
};
module.exports = {
  getAllPermission,
  createPermission,
  updatePermission,
  deletePermission
};
