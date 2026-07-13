const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const path = require("path");
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve images statically at /image
app.use('/image', express.static(path.join(__dirname, './public/image ')));

const UserRouter = require("./router/user.route");
UserRouter(app);

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`);
});