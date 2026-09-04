const { Staff, Room, StaffRoom } = require("../models");
const { logError } = require("../middlewares/logError");
const { Op } = require("sequelize");
const { sequelize } = require("../models");

const getAllStaffs = async (req, res) => {
  try {
    const { search } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { position: { [Op.like]: `%${search}%` } },
        { gender: { [Op.like]: `%${search}%` } },
        { age: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    const staffs = await Staff.findAll({ where });

    return res.status(200).json({
      success: true,
      message: "Fetched staffs successfully",
      data: staffs,
    });
  } catch (error) {
    logError("getAllStaffs", error, res);
  }
};

const createStaff = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { room_id, name, position, gender, age, phone, } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!position) {
      return res.status(400).json({
        success: false,
        message: "Position is required",
      });
    }
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    const roomId = room_id === "" || room_id === undefined ? null : room_id;
    if (roomId !== null) {
      const room = await Room.findByPk(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }
    }

    const newStaff = await Staff.create({
      room_id: roomId,
      name,
      position,
      gender,
      age,
      phone,
    }, { transaction: t });

    const staffRoom = await StaffRoom.create({
      staff_id: newStaff.id,
      room_id: roomId,
    }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Created staff successfully",
      data: newStaff,
    });
  } catch (error) {
    logError("createStaff", error, res);
  }
};

const updateStaff = (req, res) => {
  try {
    const { id } = req.params;
    const { room_id, name, position, gender, age, phone } = req.body;
    if (!room_id) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!position) {
      return res.status(400).json({
        success: false,
        message: "Position is required",
      });
    }
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    const staff = Staff.update(
      { room_id, name, position, gender, age, phone },
      { where: { id: id } },
    );
    return res.status(200).json({
      success: true,
      message: "Updated staff successfully",
      data: staff,
    });
  } catch (error) {
    logError("updateStaff", error, res);
  }
};

const deleteStaff = (req, res) => {
  try {
    const { id } = req.params;
    const checkId = Staff.findAll({ where: { id: id } });
    if (checkId) {
      return res.status(400).json({
        success: false,
        message: "Staff not found",     
      });
    }
    const staff = Staff.destroy({
      where: { id: id },
    });
    return res.status(200).json({
      success: true,
      message: "Deleted staff successfully",
      data: staff,
    });
  } catch (error) {
    logError("deleteStaff", error, res);
  }
};

const unRelationshipStaffRoom = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Staff id is required",
      });
    }

    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const staffRoom = await StaffRoom.findOne({ where: { staff_id: id } });
    if (!staffRoom) {
      return res.status(404).json({
        success: false,
        message: "Staff room not found",
      });
    }

    await StaffRoom.destroy({ where: { staff_id: id }, transaction: t });
    staff.room_id = null;
    await staff.save();
    return res.status(200).json({
      success: true,
      message: "Unrelated staff and room successfully",
      data: staff,
    });
  } catch (error) {
    logError("unRelationship", error, res);
  }
};

const updateStaffRoomID = async (req, res) => {
  try{
    const {id} = req.params;
    const {room_id} = req.body;

    if(!id){
      return res.status(400).json({
        success: false,
        message: "Room id is required",
      });
    }
    if (!room_id) {
      return res.status(400).json({
        success: false,
        message: "Room id is required",
      });
    }

    const staff = await Staff.findByPk(id);
    if(!staff){
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    await Staff.update({ room_id: null }, { where: { room_id, id: { [Op.ne]: id } } });
    await staff.update({ room_id });
    return res.status(200).json({
      success: true,
      message: "staff updated successfully",
      data: staff
    });
  }catch(error){
    logError("updateStatusRoom", error, res);
  }
};

module.exports = {
  getAllStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
  unRelationshipStaffRoom,
  updateStaffRoomID
};
