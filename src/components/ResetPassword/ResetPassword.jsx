import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css"; // Sử dụng CSS chung
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // Lấy email từ state
  const navigate = useNavigate();

  const email = location.state?.email || ""; // Đảm bảo email không null

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Không tìm thấy email. Vui lòng thử lại.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, newPassword },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data);
      alert("Mật khẩu đã được đặt lại thành công!");
      navigate("/login");
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-layout">
      <div className="forgot-password-container">
        <h1>
          Levents <span>&copy;</span>
        </h1>
        <h2>Đặt lại mật khẩu</h2>
        <p>Nhập mật khẩu mới của bạn bên dưới.</p>
        <form className="forgot-password-form" onSubmit={handleResetPassword}>
          <label htmlFor="password">Mật khẩu mới</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Nhập mật khẩu mới"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading} // Vô hiệu hóa nút khi loading
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
