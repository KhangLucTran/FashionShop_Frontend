import React, { useState, useCallback } from "react";
import "./LoginForm.css";
import { FaGooglePlusG, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { setAdminToken, setToken } from "../../services/localStorageService";
import {
  login,
  register,
  sendVerificationEmail,
} from "../../services/APIServices.js";
import { ToastContainer } from "react-toastify";
import { showErrorToast, showPromiseToast } from "../Toast/Toast.jsx";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false); // Kiểm tra trạng thái của password

  // Hàm kiểm tra và cập nhật lỗi
  const validateForm = useCallback(() => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      showErrorToast("Email không hợp lệ!");
      return false;
    }
    if (password.length < 6) {
      showErrorToast("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }
    if (!isLogin && user.trim() === "") {
      showErrorToast("Tên tài khoản không được để trống!");
      return false;
    }
    return true;
  }, [email, password, user, isLogin]);

  // Hàm xử lý chung cho đăng nhập và đăng ký
  const handleAuthAction = async (action, successMessage, redirectUrl) => {
    try {
      await showPromiseToast(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          pending: action === "login" ? "Đang đăng nhập..." : "Đang đăng ký...",
          success: successMessage,
          error: "Có lỗi xảy ra, vui lòng thử lại!",
        }
      );

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000); // Đợi 2 giây trước khi chuyển hướng
    } catch (error) {
      showErrorToast(error.message || "Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  // Hàm xử lí Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const action = isLogin
        ? login({ email, password })
        : register({ email, password, username: user });
      const data = await action;

      if (data.error !== 0) {
        throw new Error(data.message);
      }

      // Xử lý đăng nhập
      if (isLogin) {
        const decodedToken = jwtDecode(data.access_token);
        const roleCode = decodedToken.role_code;
        if (roleCode === "R1") {
          setAdminToken(data.access_token);
          handleAuthAction("login", "Đăng nhập thành công!", "/admin");
        } else {
          setToken(data.access_token);
          handleAuthAction("login", "Đăng nhập thành công!", "/home");
        }
      } else {
        // Xử lý đăng ký
        await sendVerificationEmail(email);
        handleAuthAction("register", "Đăng ký thành công!", "/login");
      }
    } catch (error) {
      showErrorToast(error.message || "Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  // Hàm render các input
  const renderInput = (type, placeholder, value, onChange) => (
    <input
      type={type}
      placeholder={placeholder}
      required
      value={value}
      onChange={onChange}
    />
  );

  return (
    <div className="login-main">
      <div className={`container ${isLogin ? "" : "active"}`} id="container">
        {/* Sign Up Form */}
        <div className={`form-container sign-up`}>
          <form onSubmit={handleSubmit}>
            <h1>Tạo Tài Khoản</h1>
            <div className="social-icons">
              <a
                href="http://localhost:5000/auth/google"
                className="icon-google"
              >
                <FaGooglePlusG />
              </a>
              <a
                href="http://localhost:5000/auth/facebook"
                className="icon-facebook"
              >
                <FaFacebookF />
              </a>
            </div>
            <span>hoặc sử dụng email của bạn để đăng ký</span>
            {renderInput("text", "Email", email, (e) =>
              setEmail(e.target.value)
            )}
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"} // Kiểm tra trạng thái hiển thị mật khẩu
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={() => setPasswordVisible(!passwordVisible)} // Chuyển đổi trạng thái
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
                {/* Thay đổi icon */}
              </span>
            </div>
            {renderInput("text", "Tên tài khoản", user, (e) =>
              setUser(e.target.value)
            )}
            <button type="submit" className="btn-head">
              Đăng ký
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className={`form-container sign-in`}>
          <form onSubmit={handleSubmit}>
            <h1>Đăng nhập</h1>
            <div className="social-icons">
              <a
                href="http://localhost:5000/auth/google"
                className="icon-google"
              >
                <FaGooglePlusG />
              </a>
              <a
                href="http://localhost:5000/auth/facebook"
                className="icon-facebook"
              >
                <FaFacebookF />
              </a>
            </div>
            <span>hoặc sử dụng email của bạn để đăng nhập</span>
            {renderInput("text", "Email", email, (e) =>
              setEmail(e.target.value)
            )}
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"} // Kiểm tra trạng thái hiển thị mật khẩu
                placeholder="Mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="password-toggle"
                onClick={() => setPasswordVisible(!passwordVisible)} // Chuyển đổi trạng thái
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
                {/* Thay đổi icon */}
              </span>
            </div>
            <a className="forget_password" href="/forgot">
              Quên mật khẩu?
            </a>
            <button type="submit" className="btn-head">
              Đăng nhập
            </button>
          </form>
        </div>

        {/* Toggle Between Forms */}
        <div className="toogle-container">
          <div className="toggle">
            <div className="toogle-panel toggle-left">
              <h1>Chào mừng trở lại!</h1>
              <p>
                Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng
                của trang web.
              </p>
              <button
                className="hidden"
                onClick={() => setIsLogin(true)}
                id="login"
              >
                Đăng nhập
              </button>
            </div>
            <div className="toogle-panel toggle-right">
              <h1>
                Levents <span>&copy;</span>
              </h1>
              <p>
                Đăng ký thông tin cá nhân của bạn để sử dụng tất cả các tính
                năng của trang web.
              </p>
              <button
                className="hidden"
                onClick={() => setIsLogin(false)}
                id="register"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
