import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // React Router navigate

  const handleForgotButton = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setError(""); // Reset lỗi
    setLoading(true); // Hiển thị trạng thái loading

    try {
      // Gửi API request
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );

      console.log("API Response:", response.data);
      // Nếu thành công, chuyển sang trang OTP và truyền email trong state
      navigate("/otp", { state: { email } });
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

  return (
    <div className="forgot-password-layout">
      <div className="forgot-password-container">
        <h1>
          Levents <span>&copy;</span>{" "}
        </h1>
        <h2>Quên mật khẩu?</h2>
        <p>Nhập email của bạn để nhận liên kết đặt lại mật khẩu.</p>
        <form className="forgot-password-form" onSubmit={handleForgotButton}>
          <label htmlFor="email">Email</label>
          <input
            className="forgot-email"
            type="email"
            id="email"
            name="email"
            placeholder="Nhập email của bạn"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Lưu email vào state
          />
          {error && <p className="error-message">{error}</p>}{" "}
          {/* Hiển thị lỗi */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading} // Vô hiệu hóa nút khi loading
          >
            {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
