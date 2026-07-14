const {Op} = require("sequelize");
const {Permission, sequelize, PermissionGroup} = require("../models");
const {logError} = require("../middlewares/logError");

const getAllPermission = async (req, res) => {
    try{
        const {search} = req.query;

        const where = {};

        if (search) {
            where.permission_name = {
                [Op.like]: `%${search}%`,
            };
        }

        const permissions = await Permission.findAll({
            where,
            include: [
                {
                    model: PermissionGroup,
                    as: "permission_group",
                },
            ],
            order:[["id", "DESC"]],
        });
        res.status(200).json({
            success: true,
            message: "fetched permission successfully",
            data: permissions
        })
    }catch(error){
        logError("getAllPermission", error, res);
    }
}

module.exports = {
    getAllPermission
}