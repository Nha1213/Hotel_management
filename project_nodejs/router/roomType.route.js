const {getAllRoomType,createRoomType,updateRoomType, deleteRoomType} = require("../controllers/RoomType.controller")
const {uploadAny} = require("../uploads/upload")
const roomTypeRoute = (app) => {
    app.get("/api/roomtype", getAllRoomType);
    app.post("/api/roomtype", uploadAny, createRoomType);
    app.put("/api/roomtype/:id", updateRoomType);
    app.delete("/api/roomtype/:id", deleteRoomType);
}

module.exports = roomTypeRoute