const {
  GetAllCheckOut,
  createCheckOut,
  updateCheckOut,
  deleteCheckOut,
} = require("../controllers/CheckOut.controller");

const checkOutRoute = (app) => {
  app.get("/api/checkOut", GetAllCheckOut);
  app.post("/api/checkOut", createCheckOut);
  app.put("/api/checkOut/:id", updateCheckOut);
  app.delete("/api/checkOut/:id", deleteCheckOut);
};

module.exports = checkOutRoute;