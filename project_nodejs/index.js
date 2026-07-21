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

const roleRoute = require("./router/role.route");
roleRoute(app);

const permissionRoute = require("./router/permission.route");
permissionRoute(app);

const permissionGroupRoute = require("./router/permissionGroup.route");
permissionGroupRoute(app);

const sentOtpRoute = require("./router/userSentOtp.route");
sentOtpRoute(app);

const roomTypeRoute = require("./router/roomType.route");
roomTypeRoute(app);

const roomRoute = require("./router/room.route");
roomRoute(app);

const serviceRoute = require("./router/service.route");
serviceRoute(app);

const  reservationRoute = require("./router/reservation.route");
reservationRoute(app);

const  paymentRoute = require("./router/payment.route");
paymentRoute(app);

app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`);
});