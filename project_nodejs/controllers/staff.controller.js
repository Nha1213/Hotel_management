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
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    const staffs = await Staff.findAll({
      where,
      include: [
        {
          model: StaffRoom,
          as: "staff_rooms",
          include: [{ model: Room, as: "room" }],
        },
      ],
      order: [["id", "DESC"]],
    });

    // Provide room and room_id for frontend compatibility (e.g. staff.room.room_number)
    const formattedStaffs = staffs.map((staff) => {
      const plain = staff.toJSON();
      const firstStaffRoom = plain.staff_rooms?.[0];
      return {
        ...plain,
        room_id: firstStaffRoom?.room.room_number || null,
        room: firstStaffRoom?.room || null, 
      };
    });

    return res.status(200).json({
      success: true,
      message: "Fetched staffs successfully",
      data: formattedStaffs,
    });
  } catch (error) {
    logError("getAllStaffs", error, res);
  }
};

const createStaff = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { room_id, name, position, gender, age, phone } = req.body;

    if (!name) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!position) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Position is required",
      });
    }
    if (!phone) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    const roomId = room_id === "" || room_id === undefined ? null : room_id;
    if (roomId !== null) {
      const room = await Room.findByPk(roomId);
      if (!room) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }
    }

    const newStaff = await Staff.create(
      {
        name,
        position,
        gender,
        age,
        phone,
      },
      { transaction: t },
    );

    if (roomId !== null) {
      await StaffRoom.create(
        {
          staff_id: newStaff.id,
          room_id: roomId,
        },
        { transaction: t },
      );
    }

    await t.commit();

    const createdStaff = await Staff.findByPk(newStaff.id, {
      include: [
        {
          model: StaffRoom,
          as: "staff_rooms",
          include: [
            { model: Room, as: "room", attributes: ["id", "room_number"] },
          ],
        },
      ],
    });

    const plain = createdStaff.toJSON();
    const firstStaffRoom = plain.staff_rooms?.[0];

    return res.status(200).json({
      success: true,
      message: "Created staff successfully",
      data: {
        ...plain,
        room_id: firstStaffRoom?.room_id || null,
        room: firstStaffRoom?.room || null,
      },
    });
  } catch (error) {
    await t.rollback();
    logError("createStaff", error, res);
  }
};

const updateStaff = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { room_id, name, position, gender, age, phone } = req.body;
    if (!name) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!position) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Position is required",
      });
    }
    if (!phone) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }

    const roomId = room_id === "" || room_id === undefined ? null : room_id;
    if (roomId !== null) {
      const room = await Room.findByPk(roomId);
      if (!room) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }
    }

    const [updatedCount] = await Staff.update(
      { name, position, gender, age, phone },
      { where: { id: id }, transaction: t },
    );
    if (!updatedCount) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    // Sync StaffRoom
    if (roomId !== null) {
      const existing = await StaffRoom.findOne({
        where: { staff_id: id },
        transaction: t,
      });
      if (existing) {
        await existing.update({ room_id: roomId }, { transaction: t });
      } else {
        await StaffRoom.create(
          { staff_id: id, room_id: roomId },
          { transaction: t },
        );
      }
    } else {
      await StaffRoom.destroy({ where: { staff_id: id }, transaction: t });
    }

    await t.commit();

    const updatedStaff = await Staff.findByPk(id, {
      include: [
        {
          model: StaffRoom,
          as: "staff_rooms",
          include: [
            { model: Room, as: "room", attributes: ["id", "room_number"] },
          ],
        },
      ],
    });

    const plain = updatedStaff.toJSON();
    const firstStaffRoom = plain.staff_rooms?.[0];

    return res.status(200).json({
      success: true,
      message: "Updated staff successfully",
      data: {
        ...plain,
        room_id: firstStaffRoom?.room_id || null,
        room: firstStaffRoom?.room || null,
      },
    });
  } catch (error) {
    await t.rollback();
    logError("updateStaff", error, res);
  }
};

const deleteStaff = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id, { transaction: t });
    if (!staff) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }
    await StaffRoom.destroy({ where: { staff_id: id }, transaction: t });
    await Staff.destroy({ where: { id: id }, transaction: t });
    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Deleted staff successfully",
      data: staff,
    });
  } catch (error) {
    await t.rollback();
    logError("deleteStaff", error, res);
  }
};

const unRelationshipStaffRoom = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    if (!id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Staff id is required",
      });
    }

    const staff = await Staff.findByPk(id, { transaction: t });
    if (!staff) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    await StaffRoom.destroy({ where: { staff_id: id }, transaction: t });
    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Unrelated staff and room successfully",
      data: staff,
    });
  } catch (error) {
    await t.rollback();
    logError("unRelationship", error, res);
  }
};

const updateStaffRoomID = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { room_id } = req.body;

    if (!id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Staff id is required",
      });
    }
    if (!room_id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Room id is required",
      });
    }

    const staff = await Staff.findByPk(id, { transaction: t });
    if (!staff) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const staff_room = await StaffRoom.findByPk(room_id, { transaction: t });
    if (!staff_room) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "staff_room not found",
      });
    }

    // Upsert StaffRoom
    const existing = await StaffRoom.findOne({
      where: { staff_id: id },
      transaction: t,
    });
    if (existing) {
      await existing.update({ room_id }, { transaction: t });
    } else {
      await StaffRoom.create({ staff_id: id, room_id }, { transaction: t });
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: staff,
    });
  } catch (error) {
    await t.rollback();
    logError("updateStatusRoom", error, res);
  }
};

module.exports = {
  getAllStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
  unRelationshipStaffRoom,
  updateStaffRoomID,
};
