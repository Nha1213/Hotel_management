const { CheckIn, Reservation, Employee } = require("../models");

const { logError } = require("../middlewares/logError");
const { Op } = require("sequelize");

// ==========================================
// GET ALL CHECK-IN
// ==========================================
const getAllCheckIn = async (req, res) => {
  try {
    const { CheckIn_timed } = req.query;

    // Define empty where object
    const where = {};

    // Search by check-in time
    if (CheckIn_timed) {
      where.checkin_time = {
        [Op.like]: `%${CheckIn_timed}%`,
      };
    }

    const checkIn = await CheckIn.findAll({
      where,

      include: [
        {
          model: Reservation,
          as: "reservation",
        },
        {
          model: Employee,
          as: "employee",
        },
      ],

      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Fetched check-in successfully",
      data: checkIn,
    });
  } catch (error) {
    logError("getAllCheckIn", error, res);
  }
};

// ==========================================
// CREATE CHECK-IN
// ==========================================
const createCheckIn = async (req, res) => {
  try {
    const { reservation_id, employee_id, checkin_time, deposit } = req.body;

    // Validate reservation_id
    if (!reservation_id) {
      return res.status(400).json({
        success: false,
        message: "Reservation ID is required",
      });
    }

    // Validate employee_id
    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Create check-in
    const checkIn = await CheckIn.create({
      reservation_id,
      employee_id,
      checkin_time,
      deposit,
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Check-in created successfully",
      data: checkIn,
    });
  } catch (error) {
    logError("createCheckIn", error, res);
  }
};

const updateCheckIn = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "CheckIn id is required",
      });
    }
    const checkIn = await CheckIn.findByPk(id);
    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: "CheckIn not found",
      });
    }
    const { reservation_id, employee_id, checkin_time, deposit } = req.body;

    // Validate reservation_id
    if (!reservation_id) {
      return res.status(400).json({
        success: false,
        message: "Reservation ID is required",
      });
    }

    // Validate employee_id
    if (!employee_id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Create check-in
    const result = await CheckIn.create({
      reservation_id,
      employee_id,
      checkin_time,
      deposit,
      updatedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "CheckIn updated successfully",
      data: result,
    });
  } catch (error) {
    logError("updateCheckIn", error, res);
  }
};

const deleteCheckIn = async (req, res) => {
    try{
        const { id } = req.params;
        const checkIn = await CheckIn.findByPk(id);
        if(!checkIn){
            return res.status(404).json({
                success: false,
                message: "CheckIn not found",
            });
        }
        await checkIn.destroy();
        return res.status(200).json({
            success: true,
            message: "CheckIn deleted successfully",
            data: checkIn,
        });
    }catch(error){
        logError("deleteCheckIn", error, res);
    }
};
module.exports = {
  getAllCheckIn,
  createCheckIn,
  updateCheckIn,
  deleteCheckIn
};
