import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import "./Invoice.css";

const Invoice = () => {
  const { invoiceId } = useParams(); // Lấy ID hóa đơn từ URL
  const { state } = useLocation(); // Lấy dữ liệu từ state
  const [invoice, setInvoice] = useState(null);
  const token = getToken(); // Lấy token từ localStorage

  useEffect(() => {
    if (token) {
      // Gửi yêu cầu lấy hóa đơn từ backend kèm token trong header
      axios
        .get(`http://localhost:5000/api/invoice/get-invoice/${invoiceId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        })
        .then((response) => {
          setInvoice(response.data.invoice); // Lưu dữ liệu hóa đơn vào state
        })
        .catch((error) => {
          console.error("Error fetching invoice:", error);
        });
    }
  }, [invoiceId, token]);

  if (!invoice || !state) {
    return <p>Đang tải hóa đơn...</p>;
  }

  const { userData, selectedCartItems } = state; // Lấy userData và selectedCartItems từ state

  // Xác định lớp trạng thái hóa đơn
  const invoiceStatusClass =
    invoice.status === "Pending" ? "pending" : "completed";

  return (
    <div className="invoice-container">
      <h1 className="invoice-title">Hóa đơn # {invoice._id}</h1>
      <div className={`invoice-status ${invoiceStatusClass}`}>
        <h2>Trạng thái: {invoice.status}</h2>
      </div>
      <div className="invoice-summary">
        <h2>Tổng cộng: {invoice.totalAmount.toLocaleString()} VND</h2>
      </div>

      {/* Hiển thị thông tin người dùng */}
      <div className="invoice-recipient-info">
        <h3>Thông tin người nhận:</h3>
        <ul>
          <li>
            <strong>Họ và tên:</strong> {userData.profileId?.username}
          </li>
          <li>
            <strong>Giới tính:</strong> {userData.profileId?.gender}
          </li>
          <li>
            <strong>Số điện thoại:</strong> {userData.profileId?.numberphone}
          </li>
          <li>
            <strong>Địa chỉ:</strong> {userData?.address?.detail},{" "}
            {userData?.address?.district}, {userData?.address?.province}
          </li>
        </ul>
      </div>

      <div className="invoice-details">
        <h3>Chi tiết các sản phẩm:</h3>
        <ul>
          {selectedCartItems.map((item, index) => (
            <li key={index} className="invoice-item">
              <div className="invoice-item-image">
                <img
                  src={item.product.images[0]} // Lấy ảnh sản phẩm
                  alt={item.product.title} // Chắc chắn sử dụng tiêu đề sản phẩm cho alt
                  className="invoice-item-img"
                />
              </div>
              <div className="invoice-item-info">
                <strong>Sản phẩm:</strong> {item.product.title}
                <br />
                <strong>Số lượng:</strong> {item.quantity}
                <br />
                <strong>Giá:</strong> {item.price.toLocaleString()} VND
                <br />
                <strong>Tổng tiền:</strong> {item.total.toLocaleString()} VND
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="invoice-issued-at">
        <p>
          <strong>Ngày phát hành:</strong>{" "}
          {new Date(invoice.issuedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Invoice;
