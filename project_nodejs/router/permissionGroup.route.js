const {
  getAllPermission,
  createPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
} = require("../controllers/permissionGroup.controller");

const PermissionGroupRoute = (app) => {
  app.get("/api/permissionGroup", getAllPermission);
  app.post("/api/permissionGroup", createPermissionGroup);
  app.put("/api/permissionGroup/:id", updatePermissionGroup);
  app.delete("/api/permissionGroup/:id", deletePermissionGroup);
};

module.exports = PermissionGroupRoute;
