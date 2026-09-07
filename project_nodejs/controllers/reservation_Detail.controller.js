const { ReservationDetail } = require("../models");
const { logError } = require("../middlewares/logError");

const UnRelationshipRoom = async (req, res) => {
  try {
    const reservationDetailId = req.params.id;

    const checkById = await ReservationDetail.findByPk(reservationDetailId);

    if (!checkById) {
      return res.status(404).json({
        success: false,
        message: "ReservationDetail not found",
      });
    }

    checkById.room_id = null;
    await checkById.save();

    return res.status(200).json({
      success: true,
      message: "Room relationship removed successfully",
      data: checkById,
    });
  } catch (error) {
    return logError("UnRelationshipRoom", error, res);
  }
};

module.exports = {
  UnRelationshipRoom,
};