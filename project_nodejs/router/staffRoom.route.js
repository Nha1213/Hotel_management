const {createStaffRoom,getAllStaffRoom,updateStaffRoom,deleteStaffRoom, deleteStaffRoomStaff_id
} = require("../controllers/StaffRoom.controller")
const StaffRoomRoute = (app) =>{
    app.post("/api/staffRoom", createStaffRoom);
    app.get("/api/staffRoom", getAllStaffRoom);
    app.put("/api/staffRoom/:id", updateStaffRoom);
    app.delete("/api/staffRoom/:id", deleteStaffRoom);
    app.delete("/api/staffRoom/staff_id/:staff_id", deleteStaffRoomStaff_id);
}

module.exports = StaffRoomRoute;