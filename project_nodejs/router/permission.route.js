const {getAllPermission} = require("../controllers/permission.controller");

const permissionRoute = (app) => {
    app.get("/api/permissions", getAllPermission);
}

module.exports = permissionRoute