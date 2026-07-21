const {
  Reservation,
  ReservationDetail,
  Room,
  RoomType,
  sequelize,
} = require("../models");
const { logError } = require("../middlewares/logError");
const { Op } = require("sequelize");

// Helper function that handles response directly
function requireCheck(
  res,
  customer_id,
  reservation_date,
  check_in_date,
  check_out_date,
  total_guest,
  status,
  reservation_details,
) {
  if (!customer_id) {
    res
      .status(400)
      .json({ success: false, message: "Customer id is required" });
    return false;
  }
  if (!reservation_date) {
    res
      .status(400)
      .json({ success: false, message: "Reservation date is required" });
    return false;
  }
  if (!check_in_date) {
    res
      .status(400)
      .json({ success: false, message: "Check in date is required" });
    return false;
  }
  if (!check_out_date) {
    res
      .status(400)
      .json({ success: false, message: "Check out date is required" });
    return false;
  }
  if (!total_guest) {
    res
      .status(400)
      .json({ success: false, message: "Total guest is required" });
    return false;
  }
  if (!status) {
    res.status(400).json({ success: false, message: "Status is required" });
    return false;
  }
  if (
    !reservation_details ||
    !Array.isArray(reservation_details) ||
    reservation_details.length === 0
  ) {
    res
      .status(400)
      .json({ success: false, message: "Reservation details is required" });
    return false;
  }
  return true;
}

const getReservation = async (req, res) => {
  try {
    const { check_in, check_out } = req.query;
    const whereClause = {};

    if (check_in && check_out) {
      whereClause[Op.and] = [
        { check_in: { [Op.gte]: check_in } },
        { check_out: { [Op.lte]: check_out } },
      ];
    }

    const reservation = await Reservation.findAll({
      where: whereClause,
      include: [
        {
          model: ReservationDetail,
          as: "reservation_details",
          include: [
            {
              model: Room,
              as: "room",
              include: [
                {
                  model: RoomType,
                  as: "room_type",
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Reservation found",
      data: reservation,
    });
  } catch (error) {
    return logError("getReservation", error, res);
  }
};

const createReservation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      customer_id,
      reservation_date,
      check_in_date,
      check_out_date,
      total_guest,
      status,
      reservation_details,
    } = req.body;

    // Call check: If validation fails, rollback transaction and stop execution
    const isValid = requireCheck(
      res,
      customer_id,
      reservation_date,
      check_in_date,
      check_out_date,
      total_guest,
      status,
      reservation_details,
    );

    if (!isValid) {
      await t.rollback();
      return; // Stop execution since response was sent inside requireCheck
    }

    const reservation = await Reservation.create(
      {
        customer_id,
        reservation_date,
        check_in_date,
        check_out_date,
        total_guest,
        status,
      },
      { transaction: t },
    );

    const reservationDetails = reservation_details.map((detail) => ({
      reservation_id: reservation.id,
      room_id: detail.room_id,
      price: detail.price,
      nights: detail.nights,
      subtotal: detail.subtotal,
    }));

    await ReservationDetail.bulkCreate(reservationDetails, {
      transaction: t,
    });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: {
        reservation,
        reservationDetails,
      },
    });
  } catch (error) {
    await t.rollback();
    return logError("createReservation", error, res);
  }
};

const updateReservation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    if (!id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Reservation id is required",
      });
    }

    const {
      customer_id,
      reservation_date,
      check_in_date,
      check_out_date,
      total_guest,
      status,
      reservation_details,
    } = req.body;

    const isValid = requireCheck(
      res,
      customer_id,
      reservation_date,
      check_in_date,
      check_out_date,
      total_guest,
      status,
      reservation_details,
    );

    if (!isValid) {
      await t.rollback();
      return; // Stop execution
    }

    const checkById = await Reservation.findByPk(id);
    if (!checkById) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    await checkById.update(
      {
        customer_id,
        reservation_date,
        check_in_date,
        check_out_date,
        total_guest,
        status,
      },
      { transaction: t },
    );

    // Remove existing details before creating updated ones
    await ReservationDetail.destroy({
      where: { reservation_id: id },
      transaction: t,
    });

    const reservationDetails = reservation_details.map((detail) => ({
      reservation_id: id,
      room_id: detail.room_id,
      price: detail.price,
      nights: detail.nights,
      subtotal: detail.subtotal,
    }));

    await ReservationDetail.bulkCreate(reservationDetails, {
      transaction: t,
    });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Reservation updated successfully",
      data: {
        reservation: checkById,
        reservationDetails,
      },
    });
  } catch (error) {
    await t.rollback();
    return logError("updateReservation", error, res);
  }
};

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const checkById = await Reservation.findByPk(id);
    if (!checkById) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    await checkById.destroy();

    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully",
      data: checkById,
    });
  } catch (error) {
    return logError("deleteReservation", error, res);
  }
};

module.exports = {
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};
