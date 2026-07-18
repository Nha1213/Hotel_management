const {PermissionGroup} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");

const getAllPermission = async (req, res) => {
    try {
        const { search } = req.query;

        const where = {};

        if (search?.trim()) {
            where.group_name = {
                [Op.like]: `%${search.trim()}%`,
            };
        }

        const permissionGroups = await PermissionGroup.findAll({where, order: [["id", "DESC"]]});

        return res.status(200).json({
            success: true,
            message: "Permission groups fetched successfully.",
            data: permissionGroups,
        });
    } catch (error) {
        logError("getAllPermission", error, res);
    }
};


const createPermissionGroup = async (req, res) => {
    try{
        
        const {group_name} = req.body;

        if(!group_name){
            return res.status(400).json({
                success: false,
                message: "Group name is required",
            });
        }

        const permissionGroup = await PermissionGroup.create({group_name});
        return res.status(200).json({
            success: true,
            message: "Permission group created successfully.",
            data: permissionGroup,
        });
    }catch(error){
        logError("createPermissionGroup", error, res);
    }
}

const updatePermissionGroup = async (req, res) => {
    try{
        const {id} = req.params;
        const {group_name} = req.body;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Group id is required",
            });
        }

        if(!group_name){
            return res.status(400).json({
                success: false,
                message: "Group name is required",
            });
        }

        const permissionGroup = await PermissionGroup.update({group_name}, {where: {id}});
        return res.status(200).json({
            success: true,
            message: "Permission group updated successfully.",
            data: permissionGroup,
        });
    }catch(error){
        logError("updatePermissionGroup", error, res);
    }
}

const deletePermissionGroup = async (req, res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Group id is required",
            });
        }
        const permissionGroup = await PermissionGroup.destroy({where: {id}});

        if(!permissionGroup){
            return res.status(404).json({
                success: false,
                message: "Permission group not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Permission group deleted successfully.",
            data: permissionGroup,
        });
    }catch(error){
        logError("deletePermissionGroup", error, res);
    }
}
module.exports = {
    getAllPermission,
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup
}