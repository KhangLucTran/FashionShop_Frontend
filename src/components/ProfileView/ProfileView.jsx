import React, { useEffect, useState, useCallback } from "react";
import "./ProfileView.css";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../services/localStorageService";
import Footer from "../Footer/Footer";
import { getUserData, updateAvatar } from "../../services/APIServices";
import { showSuccessToast } from "../Toast/Toast";

const ProfileView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  // API call được đóng gói để tránh lặp lại
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        setError("Token không tồn tại. Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }
      const data = await getUserData(token); // Sử dụng API getUserData từ file api.js
      setUserData(data);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      setError("Không thể lấy thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Chỉ gọi API khi không có userData hoặc khi token đã hết hạn
  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [fetchUserData, userData]);

  const handleEditProfileButton = () => {
    if (userData) {
      navigate("/profile", { state: { userData } });
    }
  };

  const handleProfileClick = () => {
    setIsHighlighted(true);
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setIsHighlighted(false);
    setOverlayVisible(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleUploadAvatar = async () => {
    const token = getToken();
    if (!token) {
      setError("Token không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }
    if (!avatar) {
      setError("Vui lòng chọn ảnh để tải lên.");
      return;
    }
    setIsUploading(true);
    setError(null); // Đặt lại lỗi trước khi bắt đầu tải lên

    try {
      const newAvatar = await updateAvatar(avatar, token); // Sử dụng API updateAvatar từ file api.js
      setUserData((prev) => ({
        ...prev,
        profileId: {
          ...prev.profileId,
          avatar: newAvatar,
        },
      }));
      setAvatar(null); // Xóa avatar đã chọn sau khi tải lên thành công
      setIsUploading(false); // Tải lên thành công, dừng loading
      showSuccessToast("Đổi ảnh đại diện thành công!"); // Thông báo
      // Chuyển hướng lại trang profile sau khi tải ảnh thành công
      navigate("/profile-view");
    } catch (err) {
      console.error("Lỗi khi tải lên avatar:", err);
      setIsUploading(false); // Kết thúc tải lên, dừng loading
    }
  };

  if (loading) return <p>Đang tải thông tin...</p>;
  if (error) return <p>{error}</p>;

  if (!userData || !userData.profileId) {
    return <p>Không tìm thấy thông tin người dùng.</p>;
  }

  return (
    <>
      <div
        className={`profile-overlay ${overlayVisible ? "active" : ""}`}
        onClick={closeOverlay}
      ></div>

      <div className="profile-layout">
        <div
          className={`profile-container profile-view ${
            isHighlighted ? "highlight" : ""
          }`}
          onClick={handleProfileClick}
        >
          <div className="profile-logo">
            <a href="/" className="logo">
              Levents <span>&copy;</span>
            </a>
          </div>
          <div className="avatar-section">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : userData.profileId.avatar || "../Assets/avatar-default.png"
              }
              alt="Avatar"
              className="profile-avatar fade-in"
            />
            <button
              className="edit-avatar-btn"
              onClick={() => document.getElementById("avatar-input").click()}
            >
              Chỉnh sửa
            </button>
            <input
              id="avatar-input"
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatar && (
              <button
                className="upload-avatar-btn"
                onClick={handleUploadAvatar}
              >
                {isUploading ? "Đang tải lên..." : "Tải lên"}
              </button>
            )}
          </div>
          <div className="info-section">
            <h2>Thông tin cá nhân</h2>
            <ul className="info-list">
              <li>
                <strong>Email:</strong> {userData.email}
              </li>
              <li>
                <strong>Họ và tên:</strong>{" "}
                {userData.profileId?.username || "Chưa có tên"}
              </li>
              <li>
                <strong>Giới tính:</strong>{" "}
                {userData.profileId?.gender || "Chưa xác định"}
              </li>
              <li>
                <strong>Số điện thoại:</strong>{" "}
                {userData.profileId?.numberphone || "Chưa cập nhật"}
              </li>
              <li>
                <strong>Địa chỉ:</strong>
                {userData?.address?.detail}
                <br />
                {userData?.address?.district}
                <br />
                {userData?.address?.province || "Chưa cập nhật"}
              </li>
              <li>
                <strong>Quyền:</strong>{" "}
                {userData.role_code?.value || "Chưa xác định"}
              </li>
            </ul>
            <button
              className="edit-profile-btn"
              onClick={handleEditProfileButton}
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileView;
