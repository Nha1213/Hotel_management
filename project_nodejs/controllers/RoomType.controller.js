const {RoomType} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");
const {deleteImageFolder} = require("../uploads/upload");

const buildPhotoUrl = (file) => {
    if(!file) return null;
    return `/image/${file.filename}`
}
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

function requireCheck(name, price_per_night, max_guest, description) {
    
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
}

const createRoomType = async (req, res) => {
    try {
        const {name, price_per_night, max_guest, description} = req.body;
        const file = req.files?.[0];
        const image = buildPhotoUrl(file);
        
        requireCheck(name, price_per_night, max_guest, description);

        const roomType = await RoomType.create({name, price_per_night, max_guest, description, image});

        return res.status(200).json({
            success: true,
            message: "Room type created successfully.",
            data: roomType,
        });
    } catch (error) {
        logError("createRoomType", error, res);
    }
};

const updateRoomType = async (req, res) => {
    try {
        const {id} = req.params;

        const {name, price_per_night, max_guest, description} = req.body;

        const file = req.files?.[0];
        const image = buildPhotoUrl(file);
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Room type id is required.",
            });
        }

        requireCheck(name, price_per_night, max_guest, description);

        const roomTypeCheck = await RoomType.findByPk(id);

        if(!roomTypeCheck){
            return res.status(404).json({
                success: false,
                message: "Room type not found.",
            });
        }


        const roomType = await RoomType.update({
            name, 
            price_per_night, 
            max_guest, 
            description, 
            image: image || roomTypeCheck.image
            }, {where: {id}
        });

        return res.status(200).json({
            success: true,
            message: "Room type updated successfully.",
            data: roomTypeCheck,
        });
    } catch (error) {
        logError("updateRoomType", error, res);
    }
};

const deleteRoomType = async (req, res) =>{
    try{
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Room type id is required.",
            });
        }

        const roomType = await RoomType.findByPk(id);

        if(!roomType){
            return res.status(404).json({
                success: false,
                message: "Room type not found.",
            });
        }

        await RoomType.destroy({where:{id}});
        deleteImageFolder(roomType.image);
        return res.status(200).json({
            success: true,
            message: "Room type deleted successfully.",
            data: roomType,
        });
    }catch(error){
        logError("deleteRoomType", error, res);
    }
}

module.exports = {getAllRoomType, createRoomType, updateRoomType, deleteRoomType};