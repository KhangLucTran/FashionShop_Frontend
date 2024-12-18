import React, { useState } from "react";
import { deleteUser, getUserById, register } from "../../services/APIServices";
import { getAdminToken, getToken } from "../../services/localStorageService";
import { showSuccessToast, showErrorToast } from "../Toast/Toast";
import "./UserManagement.css";

const UserManagement = ({ users, setUsers }) => {
  const [searchUserEmail, setSearchUserEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  // Hàm Delete User
  const handleDeleteUser = async (userId) => {
    const token = getToken();
    const userToDelete = users.find((user) => user._id === userId);
    try {
      await deleteUser(userId, token);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      const userEmail = userToDelete?.email || userId;
      showSuccessToast(`Xóa User thành công: ${userEmail}`);
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      showErrorToast("Xóa user thất bại. Vui lòng thử lại.");
    }
  };

  // Hàm View User Details
  const handleViewUserDetails = async (userId) => {
    const token = getAdminToken();
    try {
      const userDetails = await getUserById(userId, token);
      setSelectedUser(userDetails);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin chi tiết người dùng:", err);
      showErrorToast("Không thể lấy thông tin chi tiết người dùng.");
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  // Hàm Thêm User Mới
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const newUserResponse = await register(newUser);
      setUsers((prevUsers) => [...prevUsers, newUserResponse]); // Cập nhật danh sách user ngay lập tức
      showSuccessToast("Thêm user mới thành công!");
      setNewUser({ email: "", password: "", username: "" });
      setShowAddUserForm(false);
    } catch (error) {
      console.error("Lỗi khi thêm user mới:", error);
      showErrorToast(error.message || "Thêm user mới thất bại.");
    }
  };

  // Lọc người dùng theo email
  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(searchUserEmail.toLowerCase())
  );

  return (
    <section className="admin-home__user-management">
      <h2 className="admin-home__section-title">Quản lý User</h2>

      {/* Tổng số lượng user */}
      <div className="admin-home__total-users">
        Tổng số user: {filteredUsers.length}
      </div>

      {/* Tìm kiếm user */}
      <div className="admin-home__search">
        <label htmlFor="search-user-email">Tìm kiếm theo Email:</label>
        <input
          type="text"
          id="search-user-email"
          placeholder="Nhập email để tìm kiếm"
          value={searchUserEmail}
          onChange={(e) => setSearchUserEmail(e.target.value)}
        />
      </div>

      {/* Button mở Form thêm user */}
      <button
        className="admin-home__add-user-btn"
        onClick={() => setShowAddUserForm(!showAddUserForm)}
      >
        {showAddUserForm ? "Hủy" : "Thêm User Mới"}
      </button>

      {/* Form Thêm User */}
      {showAddUserForm && (
        <form className="add-user-form" onSubmit={handleAddUser}>
          <h3 className="add-user-form__title">Thêm User Mới</h3>
          <div className="add-user-form__field">
            <label className="add-user-form__label">Email:</label>
            <input
              type="email"
              className="add-user-form__input"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="add-user-form__field">
            <label className="add-user-form__label">Mật khẩu:</label>
            <input
              type="password"
              className="add-user-form__input"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>
          <div className="add-user-form__field">
            <label className="add-user-form__label">Tên người dùng:</label>
            <input
              type="text"
              className="add-user-form__input"
              value={newUser.username}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, username: e.target.value }))
              }
              required
            />
          </div>
          <button type="submit" className="add-user-form__submit-btn">
            Thêm User
          </button>
        </form>
      )}

      {/* Danh sách user */}
      <ul className="admin-home__user-list">
        {filteredUsers.map((user) => (
          <li key={user._id} className="admin-home__user-item">
            <span>Email: {user.email}</span> |{" "}
            <span>
              Trạng thái: {user.verifyState ? "Đã xác minh" : "Chưa xác minh"}
            </span>
            <button
              className="admin-home__delete-btn"
              onClick={() => handleDeleteUser(user._id)}
            >
              Xóa
            </button>
            <button
              className="admin-home__view-btn"
              onClick={() => handleViewUserDetails(user._id)}
            >
              Xem Chi Tiết
            </button>
          </li>
        ))}
      </ul>

      {/* Modal hiển thị chi tiết user */}
      {selectedUser && (
        <div className="user-details-modal">
          <button
            className="user-details-modal__close-btn"
            onClick={handleCloseModal}
          >
            Đóng
          </button>
          <h3>Thông tin chi tiết người dùng</h3>
          <img
            src={selectedUser.profileId.avatar}
            alt="Avatar"
            className="user-details-modal__avatar"
          />
          <p>Email: {selectedUser.email}</p>
          <p>Username: {selectedUser.profileId.username}</p>
          <p>Số điện thoại: {selectedUser.profileId.numberphone}</p>
          <p>Giới tính: {selectedUser.profileId.gender}</p>
          <p>
            Ngày sinh:{" "}
            {new Date(selectedUser.profileId.dob).toLocaleDateString()}
          </p>
          <p>
            Trạng thái:{" "}
            {selectedUser.verifyState ? "Đã xác minh" : "Chưa xác minh"}
          </p>
        </div>
      )}
    </section>
  );
};

export default UserManagement;
