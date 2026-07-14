const {createRole, getAllRoles}  = require("../controllers/role.controller");

const roleRoute = (app) =>{ 
    app.get('/api/role', getAllRoles);
    app.post('/api/role', createRole);
}

module.exports = roleRoute