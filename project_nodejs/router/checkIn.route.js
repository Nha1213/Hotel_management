const {createCheckIn, getAllCheckIn, updateCheckIn, deleteCheckIn} = require("../controllers/CheckIn.controller");

const checkInRoute= (app) => {
    app.post("/api/checkIn", createCheckIn);
    app.get("/api/checkIn", getAllCheckIn);
    app.put("/api/checkIn/:id", updateCheckIn);
    app.delete("/api/checkIn/:id", deleteCheckIn);
}

module.exports = checkInRoute
