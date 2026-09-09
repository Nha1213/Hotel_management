
const { ReservationDetail } = require("../models");
const { logError } = require("../middlewares/logError");

const UnRelationshipRoom = async (req, res) => {
  try {
    const { room_id } = req.params;

    // Validate room_id
    if (!room_id) {
      return res.status(400).json({
        success: false,
        message: "room_id is required",
      });
    }

    // Find ReservationDetail by room_id
    const reservationDetail = await ReservationDetail.findOne({
      where: {
        room_id: room_id,
      },
    });

    if (!reservationDetail) {
      return res.status(404).json({
        success: false,
        message: "ReservationDetail with this room_id not found",
      });
    }

    // Remove room relationship
    reservationDetail.room_id = null;

    await reservationDetail.save();

    return res.status(200).json({
      success: true,
      message: "Room relationship removed successfully",
      data: reservationDetail,
    });
  } catch (error) {
    console.error("UnRelationshipRoom error:", error);

    return logError("UnRelationshipRoom", error, res);
  }
};

module.exports = {
  UnRelationshipRoom,
};