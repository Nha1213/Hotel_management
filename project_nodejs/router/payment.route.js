const {createPayment,deletePayment,getAllPayment,updatePayment} = require("../controllers/Payment.controller");

const paymentRoute = (app) => {
    app.get('/api/payment', getAllPayment);
    app.post('/api/payment', createPayment);
    app.put('/api/payment/:id', updatePayment);
    app.delete('/api/payment/:id', deletePayment);
};

module.exports = paymentRoute;

