const {getAllRoomType,createRoomType,update} = require("../controllers/RoomType.controller")

const roomTypeRoute = (app) => {
    app.get("/api/roomtype", getAllRoomType);
    app.post("/api/roomtype", createRoomType);
    app.put("/api/roomtype/:id", update);
}

module.exports = roomTypeRoute