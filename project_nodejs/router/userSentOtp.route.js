const {resetPassword, sendOTP, verifyOtp} = require("../controllers/userSentOtp.controller");

const sentOtpRoute = (app) => {
    app.post("/api/user/sentOtp", sendOTP);
    app.post("/api/user/verifyOtp", verifyOtp);
    app.post("/api/user/resetPassword", resetPassword);
};

module.exports =  sentOtpRoute;
