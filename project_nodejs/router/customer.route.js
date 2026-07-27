const {LoginCustomer,deleteCustomer,getAllCustomers,registerCustomer,updateCustomer} = require("../controllers/customer.controller");
const { validate_token } = require("../middlewares/auth");
const {uploadAny} = require("../uploads/upload")
const {validateCheck} = require("../middlewares/logError")
const { body } = require("express-validator");
const userValidation = [
  body("email")
    .notEmpty()
    .withMessage("email is required"),

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
const userValidation2 = [
  body("email")
    .notEmpty()
    .withMessage("email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
]

const customerRoute = (app) =>{
    app.get("/api/customer",getAllCustomers);
    app.post("/api/customer", uploadAny, userValidation, validateCheck, registerCustomer);
    app.post("/api/customer/login", userValidation2, validateCheck, LoginCustomer);
    app.put("/api/customer/:id",updateCustomer);
    app.delete("/api/customer/:id",deleteCustomer);
}

module.exports = customerRoute