const {resetPassword,sendOTP,verifyOtp} = require("../controllers/CustomerSentOtp.controller");
const customerSentOtpRoute = (app) => {
    app.post("/api/customer/sentOtp", sendOTP);
    app.post("/api/customer/verifyOtp", verifyOtp);
    app.post("/api/customer/resetPassword", resetPassword);
}

module.exports = customerSentOtpRoute;