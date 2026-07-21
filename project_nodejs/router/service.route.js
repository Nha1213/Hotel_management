const {getAllService, createService, updateService, deleteService} = require("../controllers/service.controller")

const serviceRoute = (app) => {
    app.get("/api/service", getAllService),
    app.post("/api/service", createService),
    app.put("/api/service/:id", updateService),
    app.delete("/api/service/:id", deleteService)
}

module.exports = serviceRoute