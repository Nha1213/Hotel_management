const {createRole, getAllRoles,updateRole, deleteRole}  = require("../controllers/role.controller");

const roleRoute = (app) =>{ 
    app.get('/api/role', getAllRoles);
    app.post('/api/role', createRole);
    app.put('/api/role/:id', updateRole);
    app.delete("/api/role/:id", deleteRole);
}

module.exports = roleRoute