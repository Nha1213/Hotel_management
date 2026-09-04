const {createStaffRoom,getAllStaffRoom,updateStaffRoom,deleteStaffRoom} = require("../controllers/StaffRoom.controller")
const StaffRoomRoute = (app) =>{
    app.post("/api/staffRoom", createStaffRoom);
    app.get("/api/staffRoom", getAllStaffRoom);
    app.put("/api/staffRoom/:id", updateStaffRoom);
    app.delete("/api/staffRoom/:id", deleteStaffRoom);
}

module.exports = StaffRoomRoute;