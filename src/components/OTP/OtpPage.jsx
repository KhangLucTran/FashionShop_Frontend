import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from "react";
import "./OtpPage.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showInfoToast,
  showErrorToast,
} from "../Toast/Toast";

// Cấu hình mặc định
const RESEND_TIME = 300; // Thời gian đếm ngược (5 phút)
const OTP_LENGTH = 6; // Số ký tự OTP

// Reducer để quản lý trạng thái OTP
const otpReducer = (state, action) => {
  switch (action.type) {
    case "SET_OTP":
      return state.map((val, idx) =>
        idx === action.index ? action.value : val
      );
    case "RESET":
      return Array(OTP_LENGTH).fill("");
    default:
      return state;
  }
};

const OtpPage = () => {
  const [otp, dispatchOtp] = useReducer(otpReducer, Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const email = location.state?.email || ""; // Email nhận từ ForgotPassword
  const navigate = useNavigate();
  const inputRefs = useRef([]); // Quản lý refs cho các ô OTP

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Xử lý thay đổi giá trị OTP
  const handleChange = useCallback((value, index) => {
    if (/^\d$/.test(value) || value === "") {
      dispatchOtp({ type: "SET_OTP", index, value });

      // Chuyển focus nếu nhập đúng và không phải ô cuối cùng
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index]?.focus();
      }
    }
  }, []);

  // Xử lý nhấn phím Backspace
  const handleKeyDown = useCallback(
    (e, index) => {
      if (e.key === "Backspace" && otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  // Gửi lại mã OTP
  const handleResend = useCallback(async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      showInfoToast("Mã OTP mới đã được gửi!");
      dispatchOtp({ type: "RESET" });
      setTimeLeft(RESEND_TIME);
    } catch {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
    }
  }, [email]);

  // Xử lý xác nhận OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH) {
      setError("Vui lòng nhập đầy đủ mã OTP.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: otpString,
      });

      showInfoToast("Mã OTP hợp lệ!");
      setTimeout(() => {
        showSuccessToast("Xác nhận thành công!");
        setTimeout(
          () => navigate("/reset-password", { state: { email } }),
          2000
        );
      }, 2000);
    } catch (err) {
      showErrorToast("Mã OTP không hợp lệ!");
      setError(
        err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  // Định dạng thời gian
  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  return (
    <div className="otp-form-container">
      <div className="otp-box">
        <h1>
          Levents <span>&copy;</span>
        </h1>
        <p className="timer">Thời gian còn lại: {formatTime()}</p>
        <p className="timer_text">Vui lòng nhập mã OTP của bạn:</p>
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)} // Gắn ref vào ô nhập
                type="text"
                className="otp-input"
                value={digit}
                maxLength="1"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={loading || timeLeft === 0}
                autoFocus={index === 0}
              />
            ))}
          </div>
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={loading || timeLeft === 0}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100 mt-3"
            onClick={handleResend}
            disabled={loading || timeLeft > 0}
          >
            Gửi lại mã OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
