const {
  getAllRoomType,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} = require("../controllers/RoomType.controller");
const { uploadAny } = require("../uploads/upload");
const { validate_token } = require("../middlewares/auth");
const roomTypeRoute = (app) => {
  app.get("/api/roomtype", validate_token(), getAllRoomType);

  app.post("/api/roomtype", validate_token(), uploadAny, createRoomType);

  app.put("/api/roomtype/:id", validate_token(), uploadAny, updateRoomType);

  app.delete("/api/roomtype/:id", validate_token(), deleteRoomType);
};

module.exports = roomTypeRoute;
