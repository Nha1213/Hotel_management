const {getAllUsers} = require("../controllers/user.controller");

const UserRouter = (app) => {
    app.get("/api/user",getAllUsers);
}

module.exports = UserRouter