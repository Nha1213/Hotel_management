import React, { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { useNavigate } from "react-router";
import "./style/Login.css";
import request from "../../util/request";
import { alertError, alertSuccess } from "../../../swertalert/AlertSuccess";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Unified form state
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const UserLogin = async (e) => {
    // 1. Prevent default form submission reload
    e.preventDefault();

    setLoading(true);

    try {
      const res = await request("/api/user/login", "POST", {
        // Send email (or username depending on backend expectation)
        username: data.email,
        password: data.password,
      });

      if (res) {
        alertSuccess({
          title: "Login Success",
          text: "Login successfully",
        });
        console.log(res);

        // Save token and navigate home
        if (res?.token) {
          localStorage.setItem("accessToken", res.token);
        }
        navigate("/");
      }
    } catch (error) {
      alertError({
        title: "Error",
        text: error?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-card">
        {/* Logo path fixed */}
        <div className="logo">
          <img src="/imageCover/logoIct.jpg" alt="Logo" />
        </div>

        <div className="header">
          <h1>Welcome back!</h1>
        </div>

        {/* Bind submit to form */}
        <form onSubmit={UserLogin}>
          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={data.email}
              disabled={loading}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={data.password}
                disabled={loading}
                onChange={(e) => setData({ ...data, password: e.target.value })}
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

          {/* Submit Button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="divider">
          <span></span>
          <p>Or</p>
          <span></span>
        </div>

        <button type="button" className="google-button">
          <span className="google-icon">G</span>
          Sign In with Google
        </button>

        <p className="signup">
          Don't have an account?{" "}
          <button type="button" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;