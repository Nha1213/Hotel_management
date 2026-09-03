const {getAllStaffs,createStaff,deleteStaff,unRelationshipStaffRoom, updateStaffRoomID,updateStaff,} = require("../controllers/staff.controller");

const staffRouter = (app) =>{
    app.get("/api/staffs", getAllStaffs);
    app.post("/api/staffs", createStaff);
    app.put("/api/staffs/:id", updateStaff);
    app.delete("/api/staffs/:id", deleteStaff);
    app.put("/api/staffs/unrelationship/:id", unRelationshipStaffRoom);
    app.put("/api/staffs/relationship/:id", updateStaffRoomID);
}
module.exports = staffRouter;