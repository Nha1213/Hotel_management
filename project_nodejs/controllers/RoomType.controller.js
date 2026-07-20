const {RoomType} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");


const getAllRoomType = async (req, res) => {
    try {
        const roomTypes = await RoomType.findAll();

        return res.status(200).json({
            success: true,
            message: "Room types fetched successfully.",
            data: roomTypes,
        });
    } catch (error) {
        logError("getAllRoomType", error, res);
    }
};


const createRoomType = async (req, res) => {
    try {
        const {name, price_per_night, max_guest, description} = req.body;
        if(!name){
            return res.status(400).json({
                success: false,
                message: "Room type name is required.",
            });
        }

        if(!price_per_night){
            return res.status(400).json({
                success: false,
                message: "Room type price per night is required.",
            });
        }

        if(!max_guest){
            return res.status(400).json({
                success: false,
                message: "Room type max guest is required.",
            });
        }
        const roomType = await RoomType.create({name, price_per_night, max_guest, description});

        return res.status(200).json({
            success: true,
            message: "Room type created successfully.",
            data: roomType,
        });
    } catch (error) {
        logError("createRoomType", error, res);
    }
};

const update = async (req, res) => {
    try {
        const {id} = req.params;

        const {name, price_per_night, max_guest, description} = req.body;

        const roomTypeCheck = await RoomType.findByPk(id);
        if(!roomTypeCheck){
            return res.status(404).json({
                success: false,
                message: "Room type not found.",
            });
        }

        if(!name){
            return res.status(400).json({
                success: false,
                message: "Room type name is required.",
            });
        }

        if(!price_per_night){
            return res.status(400).json({
                success: false,
                message: "Room type price per night is required.",
            });
        }

        if(!max_guest){
            return res.status(400).json({
                success: false,
                message: "Room type max guest is required.",
            });
        }

        const roomType = await RoomType.update({name, price_per_night, max_guest, description}, {where: {id}});

        return res.status(200).json({
            success: true,
            message: "Room type updated successfully.",
            data: roomTypeCheck,
        });
    } catch (error) {
        logError("updateRoomType", error, res);
    }
};

module.exports = {getAllRoomType, createRoomType, update};