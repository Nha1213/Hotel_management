const { body } = require("express-validator");
const {
  getAllUsers,
  registerUser,
} = require("../controllers/user.controller");
const { validateCheck } = require("../middlewares/logError");
const { uploadAny } = require("../uploads/upload");

const userValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  body("first_name")
    .notEmpty()
    .withMessage("First name is required"),

  body("last_name")
    .notEmpty()
    .withMessage("Last name is required"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required"),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required"),

];

const UserRouter = (app) => {
  app.get("/api/user", getAllUsers);

  app.post(
    "/api/user",
    uploadAny,
    registerUser
  );
};

module.exports = UserRouter;