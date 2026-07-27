const { Customer } = require("../models");
const { Op } = require("sequelize");
const { logError } = require("../middlewares/logError");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// Store OTP temporarily (in production, use Redis or database)
const otpStore = new Map();
const OTP_EXPIRE_MS = 5 * 60 * 1000;
const VERIFIED_EXPIRE_MS = 10 * 60 * 1000;

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    const uesr = await Customer.findOne({
      where: {
        email: email,
      },
    });

    if (!uesr) {
      return res.status(404).json({
        success: false,
        message: " Customer not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:  process.env.EMAIL_USER || "Vothanarern@gmail.com",
        pass:  process.env.SEND_PASS || "ezhr tkbv meqp iige", // Use environment variable for security
      },
    });

    const mailOptions = {
      from:  process.env.EMAIL_USER || "Vothanarern@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    otpStore.set(email, {
      otp: otp.toString(),
      otpExpireAt: Date.now() + OTP_EXPIRE_MS,
      verified: false,
      verifiedExpireAt: null,
    });

    res.json({
      success: true,
      message: "OTP sent successfully",
      otp: otp,
    });
  } catch (error) {
    logError("sendOTP", error, res);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "email and OTP are required",
      });
    }

    const user = await Customer.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpData = otpStore.get(email);
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP",
      });
    }

    if (Date.now() > otpData.otpExpireAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    if (otpData.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    otpStore.set(email, {
      ...otpData,
      verified: true,
      verifiedExpireAt: Date.now() + VERIFIED_EXPIRE_MS,
    });

    res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    logError("verifyOtp", error, res);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body || {};

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "email and newPassword are required",
      });
    }

    const user = await Customer.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpData = otpStore.get(email);
    if (!otpData || !otpData.verified) {
      return res.status(400).json({
        success: false,
        message: "OTP is not verified",
      });
    }

    if (!otpData.verifiedExpireAt || Date.now() > otpData.verifiedExpireAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Customer.update({ password: hashedPassword }, { where: { email } });
    otpStore.delete(email);

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    logError("resetPassword", error, res);
  }
};

module.exports = { sendOTP, verifyOtp, resetPassword };
