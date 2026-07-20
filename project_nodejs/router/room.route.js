const {getAllRoom, createRoom, deleteRoom, updateRoom} = require("../controllers/Room.controller");

const roomRoute = (app) =>{
    app.get("/api/room", getAllRoom);
    app.post("/api/room", createRoom);
    app.put("/api/room/:id", updateRoom);
    app.delete("/api/room/:id", deleteRoom);
}

module.exports = roomRoute
