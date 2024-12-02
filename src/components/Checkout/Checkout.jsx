import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate
import axios from "axios";
import { getUserData } from "../../services/APIServices";
import { getToken } from "../../services/localStorageService";
import "./Checkout.css";

const Checkout = () => {
  const { state } = useLocation();
  const selectedCartItems = state?.selectedCartItems || []; // Chỉ lấy các sản phẩm đã chọn
  const cartId = state?.cartId;
  const [userData, setUserData] = useState(null);
  const token = getToken(); // Lấy token từ localStorage
  const navigate = useNavigate(); // Khởi tạo navigate

  useEffect(() => {
    if (token) {
      getUserData(token)
        .then((data) => setUserData(data))
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [token]);

  const calculateTotalPrice = () => {
    return selectedCartItems.reduce((total, item) => total + item.total, 0);
  };

  const totalWithShipping = calculateTotalPrice() + 50000;

  const handleCheckout = async () => {
    if (!userData || selectedCartItems.length === 0) {
      alert("Vui lòng kiểm tra lại thông tin giỏ hàng và người dùng.");
      return;
    }
    const lineItemIds = selectedCartItems.map((item) => item.product._id);
    console.log("lineItemsIds: ", lineItemIds);
    console.log("total:", totalWithShipping);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/invoice",
        {
          cartId: cartId,
          userId: userData._id,
          lineItemIds: lineItemIds,
          totalAmount: totalWithShipping,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.invoice) {
        console.log(response.data.invoice);
        navigate(`/invoice/${response.data.invoice._id}`, {
          state: { userData, selectedCartItems }, // Truyền dữ liệu qua state
        });
      } else {
        alert("Có lỗi xảy ra khi tạo hóa đơn.");
      }
    } catch (error) {
      console.error(
        "Error creating invoice:",
        error.response?.data || error.message
      );
      alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Thông tin thanh toán</h1>
      <div className="checkout-items">
        {selectedCartItems.length === 0 ? (
          <p>Không có sản phẩm nào để thanh toán.</p>
        ) : (
          selectedCartItems.map((item, index) => (
            <div key={index} className="checkout-item">
              <div className="checkout-item-image-container">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="checkout-item-image"
                />
              </div>
              <div className="checkout-item-details">
                <h3 className="checkout-item-title">{item.product.title}</h3>
                <p className="checkout-item-description">
                  <strong>Size:</strong> {item.size} <strong>Color:</strong>{" "}
                  {item.color}
                </p>
                <p className="checkout-item-description">
                  <strong>Số lượng:</strong> {item.quantity}
                </p>
                <p className="checkout-item-description">
                  <strong>Giá mỗi sản phẩm:</strong>{" "}
                  {item.price.toLocaleString()} VND
                </p>
                <p className="checkout-item-total">
                  <strong>Tổng tiền:</strong> {item.total.toLocaleString()} VND
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {userData ? (
        <div className="checkout-user-info">
          <h2>Thông tin cá nhân</h2>
          <ul>
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
              <strong>Địa chỉ:</strong> {userData?.address?.detail}
              <br />
              {userData?.address?.district}
              <br />
              {userData?.address?.province || "Chưa cập nhật"}
            </li>
          </ul>
        </div>
      ) : (
        <p>Đang tải thông tin người dùng...</p>
      )}
      <div className="checkout-summary">
        <h2 className="checkout-summary-title">Tổng cộng</h2>
        <div className="checkout-summary-item">
          <span className="checkout-summary-label">Tổng tiền sản phẩm</span>
          <span className="checkout-summary-value">
            {calculateTotalPrice().toLocaleString()} VND
          </span>
        </div>
        <div className="checkout-summary-item">
          <span className="checkout-summary-label">Phí vận chuyển</span>
          <span className="checkout-summary-value">50,000 VND</span>
        </div>
        <div className="checkout-summary-total">
          <span className="checkout-summary-label">
            Tổng cộng (bao gồm phí vận chuyển)
          </span>
          <span className="checkout-summary-value checkout-summary-total-value">
            {totalWithShipping.toLocaleString()} VND
          </span>
        </div>
      </div>

      <div className="checkout-action">
        <button className="checkout-btn" onClick={handleCheckout}>
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  );
};

export default Checkout;
