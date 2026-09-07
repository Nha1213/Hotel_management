const { UnRelationshipRoom } = require("../controllers/reservation_Detail.controller");

const ReservationDetailRoute = (app) => {
    app.put("/api/reservationDetail/:id", UnRelationshipRoom);
};

module.exports = ReservationDetailRoute;