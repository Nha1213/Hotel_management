const {StaffRoom} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");

const getAllStaffRoom = (req, res) => {
    try{
        const { search } = req.query
        const where = {}
        if(search){
            where[Op.or] = [
                {staff_id: {[Op.like]: `%${search}%`}},
                {room_id: {[Op.like]: `%${search}%`}},
            ]
        }

        const staffRooms = StaffRoom.findAll({where})
        return res.status(200).json({
            success: true,
            message: "Fetched staffRooms successfully",
            data: staffRooms,
        });
        
    }catch(error){
        logError("getAllStaffRoom", error, res);
    }
}

const createStaffRoom = (req, res) =>{
    try{
        const {room_id, staff_id} = req.body;

        if(!room_id){
            return res.status(400).json({
                success: false,
                message: "Room id is required",
            });
        }
        if(!staff_id){
            return res.status(400).json({
                success: false,
                message: "Staff id is required",
            });
        }
        const staffRoom = StaffRoom.create({room_id, staff_id});
        return res.status(200).json({
            success: true,
            message: "StaffRoom created successfully",
            data: staffRoom,
        });
    }catch(error){
        logError("createStaffRoom", error, res);
    }
}

const updateStaffRoom = (req, res) =>{
    try{
        const {id} = req.params;
        const {room_id, staff_id} = req.body;

        if(!room_id){
            return res.status(400).json({
                success: false,
                message: "Room id is required",
            });
        }
        if(!staff_id){
            return res.status(400).json({
                success: false,
                message: "Staff id is required",
            });
        }
        const staffRoom = StaffRoom.update({room_id, staff_id}, {where: {id}});
        return res.status(200).json({
            success: true,
            message: "StaffRoom updated successfully",
            data: staffRoom,
        });
    }catch(error){
        logError("updateStaffRoom", error, res);
    }
}

const deleteStaffRoom = (req, res)=>{
    try{
        const {id} = req.params;
        const staffRoom = StaffRoom.destroy({where: {id}});
        if(!staffRoom){
            return res.status(404).json({
                success: false,
                message: "StaffRoom not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "StaffRoom deleted successfully",
            data: staffRoom,
        });
    }catch(error){
        logError("deleteStaffRoom", error, res);    
    }
}

module.exports = {getAllStaffRoom, createStaffRoom, updateStaffRoom, deleteStaffRoom};