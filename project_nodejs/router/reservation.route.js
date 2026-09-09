const { getReservation, createReservation, updateReservationByStatus, deleteReservation, updateReservation } = require("../controllers/Reservation.controller")

const reservationRoute = (app) => {
    app.get("/api/reservation", getReservation),
        app.post("/api/reservation", createReservation),
        app.put("/api/reservation/:id", updateReservation),
        app.delete("/api/reservation/:id", deleteReservation),
        app.put("/api/reservation/status/:id", updateReservationByStatus)
}

module.exports = reservationRoute

