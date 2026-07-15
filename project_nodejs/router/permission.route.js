const {getAllPermission,createPermission,deletePermission,updatePermission} = require("../controllers/permission.controller");

const permissionRoute = (app) => {
    app.get("/api/permission", getAllPermission);
    app.post("/api/permission", createPermission);
    app.put("/api/permission/:id", updatePermission);
    app.delete("/api/permission/:id", deletePermission);
}

module.exports = permissionRoute