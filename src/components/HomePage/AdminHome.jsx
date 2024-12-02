import React, { useState, useEffect } from "react";
import { getAllUsers, getAllProducts } from "../../services/APIServices"; // Import hàm API
import "./AdminHome.css";

export const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // Lấy token từ Local Storage
        const userData = await getAllUsers(token); // Gọi API lấy danh sách User
        const productData = await getAllProducts(token); // Gọi API lấy danh sách Sản phẩm
        setUsers(userData); // Gán danh sách User
        setProducts(productData.products); // Gán danh sách Sản phẩm
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Các hàm xử lý thêm, xóa User và Product như cũ...

  return (
    <div className="admin-home-container">
      <h1 className="admin-title">Quản lý Admin</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {/* Quản lý User */}
          <section className="user-management">
            <h2 className="section-title">Quản lý User</h2>
            <ul className="user-list">
              {users.map((user) => (
                <li key={user.id} className="user-item">
                  {user.name} ({user.email}){" "}
                  <button
                    className="delete-btn"
                    onClick={() => console.log("Xóa user", user.id)}
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Quản lý sản phẩm */}
          <section className="product-management">
            {/* Phần hiển thị và xử lý sản phẩm không đổi */}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminHome;
