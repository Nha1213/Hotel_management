const { CheckOut } = require("../models");
const { logError } = require("../middlewares/logError");
const { Op, or } = require("sequelize");

const GetAllCheckOut = async (req, res) => {
  try {
    const { CheckOut_timed } = req.query;
    //define empty object
    const where = {};
    if (CheckOut_timed) {
      where.checkout_time = {
        [Op.like]: `%${CheckOut_timed}%`,
      };
    }

    const checkOut = await CheckOut.findAll(
      {
        where,
        include: [
          {
            model: CheckOut,
            as: "reservation",
            include: [
              {
                model: CheckOut,
                as: "employee",
              },
            ],
          },
        ],
      },
      (order = [["id", "DESC"]]),
    );

    res.status(200).json({
      success: true,
      message: "CheckOut fetched successfully",
      data: checkOut,
    });
  } catch (error) {
    logError("GetAllCheckOut", error, res);
  }
};

const createCheckOut = async (req, res) => {
  try {
    const {
      reservation_id,
      eemployee_id,
      checkout_time,
      total_amount,
      damage_fee,
      discount,
    } = req.body;

    if (!reservation_id) {
      return res.status(400).json({
        success: false,
        message: "Reservation id is required",
      });
    }
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee id is required",
      });
    }

    const checkOut = await CheckOut.create({
      reservation_id,
      eemployee_id,
      checkout_time,
      total_amount,
      damage_fee,
      discount,
    });
    return res.status(200).json({
      success: true,
      message: "CheckOut created successfully",
      data: checkOut,
    });
  } catch (error) {
    logError("createCheckOut", error, res);
  }
};

const updateCheckOut = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "CheckOut id is required",
      });
    }
    const checkOut = await CheckOut.findByPk(id);
    if (!checkOut) {
      return res.status(404).json({
        success: false,
        message: "CheckOut not found",
      });
    }
    const {
      reservation_id,
      eemployee_id,
      checkout_time,
      total_amount,
      damage_fee,
      discount,
    } = req.body;

    if (!reservation_id) {
      return res.status(400).json({
        success: false,
        message: "Reservation id is required",
      });
    }
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Employee id is required",
      });
    }
    const result = await checkOut.update(
      {
        reservation_id,
        eemployee_id,
        checkout_time,
        total_amount,
        damage_fee,
        discount,
      },
      { where: { id } },
    );
    return res.status(200).json({
      success: true,
      message: "CheckOut updated successfully",
      data: checkOut,
    });
  } catch (error) {
    logError("updateCheckOut", error, res);
  }
};

const deleteCheckOut = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "CheckOut id is required",
    });
  }
  const checkOut = await CheckOut.findByPk(id);
  if (!checkOut) {
    return res.status(404).json({
      success: false,
      message: "CheckOut not found",
    });
  }
  await checkOut.destroy();
  return res.status(200).json({
    success: true,
    message: "CheckOut deleted successfully",
    data: checkOut,
  });
};

module.exports = {
  GetAllCheckOut,
  createCheckOut,
  updateCheckOut,
  deleteCheckOut,
};
