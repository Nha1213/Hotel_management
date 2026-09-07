const { StaffRoom, Room, Staff } = require("../models");
const { logError } = require("../middlewares/logError");
const { Op } = require("sequelize");

const getAllStaffRoom = async (req, res) => {
    try {
        const { search } = req.query;
        const where = {};
        if (search && !isNaN(search)) {
            where[Op.or] = [
                { staff_id: Number(search) },
                { room_id: Number(search) },
            ];
        }

        const staffRooms = await StaffRoom.findAll({
            where,
            include: [
                {
                    model: Room,
                    as: "room",
                },
                {
                    model: Staff,
                    as: "staff",
                },
            ],
            order: [["id", "DESC"]],
        });
        return res.status(200).json({
            success: true,
            message: "Fetched staffRooms successfully",
            data: staffRooms,
        });
        
    } catch (error) {
        logError("getAllStaffRoom", error, res);
    }
};

const createStaffRoom = async (req, res) => {
    try {
        const { room_id, staff_id } = req.body;

        if (!room_id) {
            return res.status(400).json({
                success: false,
                message: "Room id is required",
            });
        }
        if (!staff_id) {
            return res.status(400).json({
                success: false,
                message: "Staff id is required",
            });
        }

        let staffRoom = await StaffRoom.findOne({ where: { staff_id } });
        if (staffRoom) {
            await staffRoom.update({ room_id });
        } else {
            staffRoom = await StaffRoom.create({ room_id, staff_id });
        }

        return res.status(200).json({
            success: true,
            message: "StaffRoom created successfully",
            data: staffRoom,
        });
    } catch (error) {
        logError("createStaffRoom", error, res);
    }
};

const updateStaffRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_id, staff_id } = req.body;

        if (!room_id) {
            return res.status(400).json({
                success: false,
                message: "Room id is required",
            });
        }
        if (!staff_id) {
            return res.status(400).json({
                success: false,
                message: "Staff id is required",
            });
        }
        const staffRoom = await StaffRoom.findByPk(id);
        if (!staffRoom) {
            return res.status(404).json({
                success: false,
                message: "StaffRoom not found",
            });
        }
        await staffRoom.update({ room_id, staff_id });
        return res.status(200).json({
            success: true,
            message: "StaffRoom updated successfully",
            data: staffRoom,
        });
    } catch (error) {
        logError("updateStaffRoom", error, res);
    }
};

const deleteStaffRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const staffRoom = await StaffRoom.findByPk(id);
        if (!staffRoom) {
            return res.status(404).json({
                success: false,
                message: "StaffRoom not found",
            });
        }
        await staffRoom.destroy();
        return res.status(200).json({
            success: true,
            message: "StaffRoom deleted successfully",
            data: staffRoom,
        });
    } catch (error) {
        logError("deleteStaffRoom", error, res);    
    }
};

const deleteStaffRoomStaff_id = async (req, res) =>{
    try{
        const {staff_id} = req.params;
        const staffRoom = await StaffRoom.destroy({where:{staff_id}});
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
        logError("deleteStaffRoomStaff_id", error, res);
    }
}

module.exports = { getAllStaffRoom, createStaffRoom, updateStaffRoom, deleteStaffRoom, deleteStaffRoomStaff_id };