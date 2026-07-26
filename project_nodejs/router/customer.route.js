const {LoginCustomer,deleteCustomer,getAllCustomers,registerCustomer,updateCustomer} = require("../controllers/customer.controller");

const customerRoute = (app) =>{
    app.get("/api/customer",getAllCustomers);
    app.post("/api/customer",registerCustomer);
    app.post("/api/customer/login",LoginCustomer);
    app.put("/api/customer/:id",updateCustomer);
    app.delete("/api/customer/:id",deleteCustomer);
}

module.exports = customerRoute