import React, { useState } from "react";
import { Eye, EyeOff, SunMedium, Check } from "lucide-react";
import { useNavigate } from "react-router";
import "./style/Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();

  return (
    <div className="login-page">
      {/* Background Overlay */}
      <div className="overlay"></div>

      {/* Login Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="logo">
          {/* <SunMedium size={42} strokeWidth={1.5} /> */}
          <img src="../../../../public/imageCover/logoIct.jpg" />
        </div>

        {/* Title */}
        <div className="header">
          <h1>Welcome back!</h1>
        </div>

        {/* Form */}
        <form>
          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input type="email" placeholder="Enter your email" />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="options">
            <div
              className="remember"
              onClick={() => setRememberMe(!rememberMe)}
            >
              <span className={`checkbox ${rememberMe ? "checked" : ""}`}>
                {rememberMe && <Check size={14} />}
              </span>

              <span>Remember me</span>
            </div>

            <button type="button" className="forgot">
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span></span>
          <p>Or</p>
          <span></span>
        </div>

        {/* Google Login */}
        <button type="button" className="google-button">
          <span className="google-icon">G</span>
          Sign In with Google
        </button>

        {/* Sign Up */}
        <p className="signup">
          Don't have an account?
          <button type="button" onClick={() => {navigate("/register")}}>Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
