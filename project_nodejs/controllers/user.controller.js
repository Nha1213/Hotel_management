const {User} = require("../models");
const {logError} = require("../middlewares/logError");
const invalid = require("../middlewares/prevent");
const buildPhotoPath = (file)=>{
    if(!file) return null;
    return `/image/${file.filename}`
}

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
        const file = req.files?.[0];
        const image = buildPhotoPath(file);

        if(invalid(username)){
            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }

        if(invalid(password)){
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        if(invalid(first_name)){
            return res.status(400).json({
                success: false,
                message: "First name is required"
            });
        }

        if(invalid(last_name)){
            return res.status(400).json({
                success: false,
                message: "Last name is required"
            });
        }

        if(invalid(gender)){
            return res.status(400).json({
                success: false,
                message: "Gender is required"
            });
        }

        if(invalid(phone)){
            return res.status(400).json({
                success: false,
                message: "Phone is required"
            });
        }



    }catch(error){
        logError("registerUser", error, res);
    }
}



module.exports = {
    getAllUsers
};