import React, { useEffect, useState } from "react";
import "./OtpPage.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const OtpPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill("")); // Lưu OTP dưới dạng mảng
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút (300 giây)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const location = useLocation(); // Dùng để lấy dữ liệu từ state
  const email = location.state?.email; // Lấy email được truyền từ ForgotPassword
  const navigate = useNavigate();

  // Bộ đếm thời gian
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Hàm xử lí không nhập vào OTP
  const handleChange = (value, index) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value; // Cập nhật giá trị cho ô hiện tại
      setOtp(newOtp);

      // Chuyển đến ô tiếp theo nếu nhập xong (không gắn giá trị cho ô sau)
      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  // Hàm focus khi nhấn OTP
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  // Hàm call API gửi lại mã OTP
  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      alert("Mã OTP mới đã được gửi!");
    } catch (err) {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
    }
    setOtp(new Array(6).fill(""));
    setTimeLeft(300);
  };

  // Hàm Xử lí OTP
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset lỗi
    setLoading(true); // Hiển thị trạng thái loading

    // Tạo chuỗi OTP từ mảng
    const otpString = otp.join("");

    // Kiểm tra OTP có đủ 6 chữ số chưa
    if (otpString.length !== 6) {
      setError("Vui lòng nhập đầy đủ mã OTP.");
      setLoading(false);
      return;
    }
    alert(`Mã OTP: ${otpString}`);

    try {
      // Gửi API request
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp: otpString, // Truyền chuỗi OTP vào API
        }
      );

      console.log("API Response:", response.error);

      // Xử lý thành công, có thể chuyển hướng hoặc thông báo
      alert("Xác nhận thành công!");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      // Xử lý lỗi nếu API thất bại
      console.error(err);
      setError(
        err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau."
      );
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  // Hàm formatTime
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="otp-form-container">
      <div className="otp-box">
        <h1>
          Levents <span>&copy;</span>{" "}
        </h1>
        <p className="timer">Thời gian còn lại: {formatTime(timeLeft)}</p>
        <p className="timer_text">Vui lòng nhập mã OTP của bạn tại đây: </p>
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="otp-input"
                value={digit}
                maxLength="1"
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={timeLeft === 0 || loading}
              />
            ))}
          </div>
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Hiển thị lỗi */}
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={timeLeft === 0 || loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-100 mt-3"
            onClick={handleResend}
            disabled={loading || timeLeft > 0} // Ẩn nút khi đang đếm ngược
          >
            Gửi lại mã OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
