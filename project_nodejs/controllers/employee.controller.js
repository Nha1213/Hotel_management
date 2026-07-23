const {Employee} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");

const getAllEmployee = async (req, res) => {
    try{
        const {search} = req.query;
        const where = {}

        if(search){
            where.full_name = {
                [Op.like]: `%${search}%`
            }
        }

        const employees = await Employee.findAll({where});

        return res.status(200).json({
            success: true,
            message: "fetched employees successfully",
            data: employees
        });
    }catch(error){
        logError("getAllEmployee", error, res);
    }
}

module.exports = {getAllEmployee}
