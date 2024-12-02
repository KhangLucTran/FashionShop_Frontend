import React, { useEffect, useState } from "react";
import "./LoginForm.css";
import {
  FaGooglePlusG,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { setToken } from "../../services/localStorageService";
import {
  login,
  register,
  sendVerificationEmail,
} from "../../services/APIServices.js";
import { ToastContainer } from "react-toastify";
import {
  showSuccessToast,
  showErrorToast,
  showPromiseToast,
} from "../Toast/Toast.jsx";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Hàm kiểm tra và cập nhật lỗi
  const validateForm = () => {
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
  };

  useEffect(() => {
    const registerBtn = document.getElementById("register");
    const container = document.getElementById("container");
    const loginBtn = document.getElementById("login");

    const handleRegisterClick = () => {
      container.classList.add("active");
    };

    const handleLoginClick = () => {
      container.classList.remove("active");
    };

    registerBtn.addEventListener("click", handleRegisterClick);
    loginBtn.addEventListener("click", handleLoginClick);

    // Cleanup event listeners when the component unmounts
    return () => {
      registerBtn.removeEventListener("click", handleRegisterClick);
      loginBtn.removeEventListener("click", handleLoginClick);
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const data = await login({ email, password });
      if (data.error !== 0) {
        throw new Error(data.message);
      }

      setToken(data.access_token);

      const decodedToken = jwtDecode(data.access_token);
      const roleCode = decodedToken.role_code;

      // Hiển thị toast và chờ cho nó hoàn tất
      await showPromiseToast(
        new Promise((resolve) => {
          setTimeout(resolve, 2000); // Đợi 2 giây
        }),
        {
          pending: "Đang đăng nhập...",
          success: "Đăng nhập thành công!",
          error: "Đăng nhập thất bại!",
        }
      );

      // Chuyển hướng sau khi toast hiển thị xong
      setTimeout(() => {
        if (roleCode === "R1") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/home";
        }
      }, 2000); // Đợi thêm một chút để đảm bảo toast kết thúc
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const data = await register({ email, password, username: user });

      if (data.error !== 0) {
        throw new Error(data.message);
      }

      await sendVerificationEmail(email);

      // Hiển thị thông báo thành công
      await showPromiseToast(
        new Promise((resolve) => setTimeout(resolve, 2000)), // Promise mô phỏng
        {
          pending: "Đang đăng ký...",
          success: "Đăng ký thành công!",
          info: "Vui lòng kiểm tra email của bạn để hoàn tất xác nhận tài khoản.",
          error: "Đăng ký thất bại!",
        }
      );

      // Chuyển hướng sang trang đăng nhập sau khi hoàn thành
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // Đợi thêm một chút để đảm bảo toast hiển thị xong
    } catch (error) {
      showErrorToast(
        error.message || "Đăng ký thất bại, vui lòng thử lại sau!"
      );
    }
  };

  const handleGoogleLogin = (event) => {
    event.preventDefault();
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleFacebookLogin = (event) => {
    event.preventDefault();
    window.location.href = "http://localhost:5000/auth/facebook";
  };

  return (
    <div className="login-main">
      <div className="container" id="container">
        {/* Sign Up Form */}
        <div className={`form-container sign-up ${isLogin ? "" : "active"}`}>
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a onClick={handleGoogleLogin} className="icon-google">
                <FaGooglePlusG />
              </a>
              <a onClick={handleFacebookLogin} className="icon-facebook">
                <FaFacebookF />
              </a>
              <a className="icon-github">
                <FaGithub />
              </a>
              <a className="icon-in">
                <FaLinkedinIn />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <button type="submit" className="btn-head">
              Sign up
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className={`form-container sign-in ${isLogin ? "active" : ""}`}>
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="social-icons">
              <a onClick={handleGoogleLogin} className="icon-google">
                <FaGooglePlusG />
              </a>
              <a onClick={handleFacebookLogin} className="icon-facebook">
                <FaFacebookF />
              </a>
              <a className="icon-github">
                <FaGithub />
              </a>
              <a className="icon-in">
                <FaLinkedinIn />
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a className="forget_password" href="/forgot">
              Forget Your Password?
            </a>
            <button type="submit" className="btn-head">
              Sign in
            </button>
          </form>
        </div>

        {/* Toggle Between Forms */}
        <div className="toogle-container">
          <div className="toggle">
            <div className="toogle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features.</p>
              <button className="hidden" id="login">
                Login
              </button>
            </div>
            <div className="toogle-panel toggle-right">
              <h1>
                Levents <span>&copy;</span>
              </h1>
              <p>Register your personal details to use all of site features.</p>
              <button className="hidden" id="register">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
