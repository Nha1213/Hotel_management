const {getAllRoom, createRoom, deleteRoom, updateRoom} = require("../controllers/Room.controller");
const {validate_token} = require("../middlewares/auth");
const roomRoute = (app) =>{
    app.get("/api/room", validate_token(), getAllRoom);
    app.post("/api/room", validate_token(), createRoom);
    app.put("/api/room/:id", validate_token(), updateRoom);
    app.delete("/api/room/:id", validate_token(), deleteRoom);
}

module.exports = roomRoute
