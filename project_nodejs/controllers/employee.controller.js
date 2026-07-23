const {Employee} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");

const getAllEmployee = async (req, res) => {
    try{
        const {search} = req.query;
        const where = {}

        if(search){
            where.name = {
                [Op.like]: `%${search}%`
            }
        }
    }catch(error){
        logError("getAllEmployee", error, res);
    }
}
