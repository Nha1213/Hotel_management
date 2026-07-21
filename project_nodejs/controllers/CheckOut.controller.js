const {CheckOut} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");

const GetAllCheckOut = async (req, res) =>{
    try{
        
    }catch(error){
        logError("GetAllCheckOut", error, res);
    }
}