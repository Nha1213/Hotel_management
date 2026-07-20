const {getAllService} = require("../controllers/service.controller")

const serviceRoute = (app) => {
    app.get("/api/service", getAllService)
}

module.exports = serviceRoute