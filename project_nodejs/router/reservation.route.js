const  {getReservation, createReservation, deleteReservation, updateReservation} =  require("../controllers/Reservation.controller")

const reservationRoute = (app) => {
    app.get("/api/reservation", getReservation),
    app.post("/api/reservation", createReservation),
    app.put("/api/reservation/:id", updateReservation),
    app.delete("/api/reservation/:id", deleteReservation)
}

module.exports = reservationRoute

