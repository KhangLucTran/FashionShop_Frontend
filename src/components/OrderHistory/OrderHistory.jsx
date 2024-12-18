import React, { useState, useEffect } from "react";
import { getToken } from "../../services/localStorageService";
import { getAlInvoicesByUserId } from "../../services/APIServices";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = getToken();

  useEffect(() => {
    if (token) {
      fetchOrders(token);
    }
  }, [token]);

  const fetchOrders = async (token) => {
    try {
      const data = await getAlInvoicesByUserId(token); // Lấy danh sách đơn hàng từ API
      console.log("API Response:", data); // Log API response to check the format

      // Kiểm tra và xử lý dữ liệu
      if (Array.isArray(data.invoice)) {
        setOrders(data.invoice); // Nếu dữ liệu là mảng, set vào orders
      } else {
        // Nếu dữ liệu không phải mảng, xử lý theo cấu trúc trả về
        setOrders(data.invoice || []); // Dựa trên cấu trúc API, có thể là { invoice: [...] }
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <p className="order-history-empty">Chưa có đơn hàng nào.</p>
      ) : (
        <ul className="order-history-list">
          {orders.map((order) => (
            <li key={order._id} className="order-history-item">
              <p className="order-history-id">Mã đơn hàng: {order._id}</p>
              <p className="order-history-date">
                Ngày đặt: {new Date(order.issuedAt).toLocaleDateString()}
              </p>
              <p className="order-history-total">
                Tổng tiền: {order.totalAmount} VND
              </p>
              <p className="order-history-status">Trạng thái: {order.status}</p>

              {order.lineItems && order.lineItems.length > 0 ? (
                <ul className="order-history-line-items">
                  {order.lineItems.map((lineItemId) => (
                    <li key={lineItemId} className="order-history-line-item">
                      Line Item ID: {lineItemId}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="order-history-no-items">
                  Không có sản phẩm trong đơn hàng này.
                </p>
              )}

              <ul className="order-history-products">
                {order.productIds && order.productIds.length > 0 ? (
                  order.productIds.map((productId) => (
                    <li key={productId} className="order-history-product">
                      Product ID: {productId}
                    </li>
                  ))
                ) : (
                  <p className="order-history-no-items">
                    Không có sản phẩm trong đơn hàng này.
                  </p>
                )}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
