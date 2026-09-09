const { UnRelationshipRoom } = require("../controllers/reservation_Detail.controller");

const ReservationDetailRoute = (app) => {
    app.put("/api/reservationDetail/:room_id", UnRelationshipRoom);
};

module.exports = ReservationDetailRoute;