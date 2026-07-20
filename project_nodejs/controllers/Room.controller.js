const {Room, RoomType} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");
const { inc } = require("semver");


function requireCheck (room_number, room_type_id, floor, status){
    if(!room_number){
            return res.status(400).json({
                success: false,
                message: "Room number is required",
            });
        }

        if(!room_type_id){
            return res.status(400).json({
                success: false,
                message: "Room type id is required",
            });
        }

        if(!floor){
            return res.status(400).json({
                success: false,
                message: "Floor is required",
            });
        }

        if(!status){
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }
}
const getAllRoom = async (req, res) =>{
    try{
        const {search} = req.query;
        const where = {};

        if(search?.trim()){
            where.room_number = {
                [Op.like]: `%${search.trim()}%`,
            };
        }

        const rooms = await Room.findAll(
            {
                include: [
                    {
                        model: RoomType,
                        as: "room_type",
                        attributes: ["id", "name", "price_per_night", "max_guest", "description"],
                    },
                ]
            },
            {where, order:[["id", "DESC"]]}
        );

        return res.status(200).json({
            success: true,
            message: "fetched rooms successfully",
            data: rooms
        });
    }catch(error){
        logError("getAllRoom", error, res);
    }
}

const createRoom = async (req, res) => {
    try{
        const {room_number, room_type_id, floor, status, description} = req.body;
    
        requireCheck(room_number, room_type_id, floor, status);

        const room = await Room.create({room_number, room_type_id, floor, status, description});
        return res.status(200).json({
            success: true,
            message: "Room created successfully",
            data: room
        });
    }catch(error){
        logError("createRoom", error, res);
    }
};

const updateRoom = async (req, res) => {
    try{
        const {id} = req.params;
        const {room_number, room_type_id, floor, status} = req.body;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Room id is required",
            });
        }
        const checkById = await Room.findByPk(id);
        if(!checkById){
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }

        requireCheck(room_number, room_type_id, floor, status);

        const room = await Room.update({room_number, room_type_id, floor, status}, {where:{id}});

        return res.status(200).json({
            success: true,
            message: "Room updated successfully",
            data: checkById
        });
    }catch(error){
        logError("updateRoom", error, res);
    }
}

const deleteRoom = async (req, res) => {
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Room id is required",
            });
        }
        const room = await Room.destroy({where:{id}});
        if(!room){
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Room deleted successfully",
            data: room
        });
    }catch(error){
        logError("deleteRoom", error, res);
    }
}

module.exports = {getAllRoom, createRoom, updateRoom, deleteRoom};