const {getAllEmployee} = require("../controllers/employee.controller");

const employeeRoute = (app) => {
    app.get("/api/employee", getAllEmployee);
}

module.exports = employeeRoute