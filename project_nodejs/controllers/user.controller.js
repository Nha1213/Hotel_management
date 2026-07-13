const {User} = require("../models");
const {logError} = require("../middlewares/logError");

const getAllUsers = async (req, res) => {
    try {
        const {search, id} = req.query;

        if(id){
            const users = await User.findOne({
                where: {
                    id
                }
            });

            return res.json({
                success: true,
                message: "Fetch User Successful",
                data: users
            });
        }

        if(search){
            const users = await User.findAll({
                where: {
                    [Op.or]: [
                        { username: { [Op.like]: `%${search}%` } },
                    ],
                },
            })

            return res.json({
                success: true,
                message: "Fetch User Successful",
                data: users
            });
        }

        const users = await User.findAll();
        res.json({
            success: true,
            message: "Fetch User Successful",
            data: users
        });
    } catch (error) {
        logError("getAllUsers", error, res);
    }
};

const 
const registerUser = async(req, res) => {
    const t = await User.sequelize.transaction();
    try{    
        const {username, password, first_name, last_name,
            gender, phone, address
        } = req.body || {};




    }catch(error){
        logError("registerUser", error, res);
    }
}



module.exports = {
    getAllUsers
};