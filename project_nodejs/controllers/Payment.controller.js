const {Payment} = require("../models");
const {logError} = require("../middlewares/logError");
const {Op} = require("sequelize");

const getAllPayment = async (req, res) =>{
    try {
        const {payment_method, date} = req.query;
        
        const where = {};

        if (payment_method) {
            where.payment_method = {
                [Op.like]: `%${payment_method}%`,
            };
        }

        if (date) {
            where.payment_date = {
                [Op.like]: `%${date}%`,
            };
        }

        const payments = await Payment.findAll({ where });

        if (payments.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Payments fetched successfully.",
                data: payments,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No payments found.",
            });
        }
    } catch (error) {
        logError("getAllPayment", error, res);
    }
}


function requireCheck(reservation_id, amount, payment_method, payment_date, status) {
    if(!reservation_id){
        return res.status(400).json({
            success: false,
            message: "Reservation id is required",
        });
    }

    if(!amount){
        return res.status(400).json({
            success: false,
            message: "Amount is required",
        });
    }

    if(!payment_method){
        return res.status(400).json({
            success: false,
            message: "Payment method is required",
        });
    }

    if(!payment_date){
        return res.status(400).json({
            success: false,
            message: "Payment date is required",
        });
    }

    if(!status){
        return res.status(400).json({
            success: false,
            message: "Status is required",
        });
    }

    
}
const createPayment = async (req, res) =>{
    try{
        const {reservation_id, amount, payment_method, payment_date, status} = req.body;

        requireCheck(reservation_id, amount, payment_method, payment_date, status);

        const payment = await Payment.create({reservation_id, amount, payment_method, payment_date, status});
        return res.status(200).json({
            success: true,
            message: "Payment created successfully",
            data: payment
        });
    }catch(error){
        logError("createPayment", error, res);
    }
}

const updatePayment = async (req, res) =>{
    try{
        const {id} = req.params;

        const payment = await Payment.findByPk(id);
        if(!payment){
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        const {reservation_id, amount, payment_method, payment_date, status} = req.body;

        requireCheck(reservation_id, amount, payment_method, payment_date, status);

        const result = await payment.update({reservation_id, amount, payment_method, payment_date, status}, {where: {id}});

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            data: payment
        });
    }catch(error){
        logError("updatePayment", error, res);
    }
}

const deletePayment = async (req, res) =>{
    try{
        const {id} = req.params;

        const payment = await Payment.findByPk(id);
        if(!payment){
            return res.status(404).json({
                success: false,
                message: "Payment Not Found",
            });
        }

        await payment.destroy({where: {id}});

        if(!payment){
            return res.status(404).json({
                success: false,
                message: "Payment Deleted Failed",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
            data: payment
        });
    }catch(error){
        logError("deletePayment", error, res);
    }
}

module.exports = {getAllPayment, createPayment, updatePayment, deletePayment};