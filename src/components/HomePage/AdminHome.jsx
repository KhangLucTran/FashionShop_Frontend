import React, { useState, useEffect } from "react";
import { FaUsers, FaBox, FaFileInvoice } from "react-icons/fa";
import UserManagement from "../../components/HomePage/UserManagement";
import ProductManagement from "../../components/HomePage/ProductManagement";
import InvoiceManagement from "../../components/HomePage/InvoiceManagement";
import { getAdminToken, getToken } from "../../services/localStorageService";
import {
  getAllUsers,
  getAllProducts,
  getAllInvoices,
} from "../../services/APIServices";
import "./AdminHome.css";
import Product from "../Product/Prodcut";
import Footer from "../Footer/Footer";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState("users");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getAdminToken();
        const userData = await getAllUsers(token);
        setUsers(userData.data || []);
        const productData = await getAllProducts(token);
        setProducts(productData || []);
        const invoiceData = await getAllInvoices(token);
        setInvoices(invoiceData.invoices || []);
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Hàm cập nhật hóa đơn khi xác nhận
  const updateInvoiceStatus = (updatedInvoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice._id === updatedInvoice._id ? updatedInvoice : invoice
      )
    );
  };

  return (
    <>
      <div className="admin-home">
        <h1>Trang Quản Lý Admin</h1>
        <div className="admin-home__layout">
          <div className="admin-home__sidebar">
            <div
              className={`tab ${currentView === "users" ? "active" : ""}`}
              onClick={() => setCurrentView("users")}
            >
              <FaUsers /> Người Dùng
            </div>
            <div
              className={`tab ${currentView === "products" ? "active" : ""}`}
              onClick={() => setCurrentView("products")}
            >
              <FaBox /> Sản Phẩm
            </div>
            <div
              className={`tab ${currentView === "invoices" ? "active" : ""}`}
              onClick={() => setCurrentView("invoices")}
            >
              <FaFileInvoice /> Hóa Đơn
            </div>
          </div>

          <div className="admin-home__content">
            {loading ? (
              <p>Đang tải...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                {currentView === "users" && (
                  <UserManagement users={users} setUsers={setUsers} />
                )}
                {currentView === "products" && (
                  <ProductManagement
                    products={products}
                    setProducts={setProducts}
                  />
                )}
                {currentView === "invoices" && (
                  <InvoiceManagement
                    invoices={invoices}
                    updateInvoiceStatus={updateInvoiceStatus}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Product />
      <Footer />
    </>
  );
};

export default AdminHome;
