import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserCart, getLineItem } from "../../services/APIServices";
import { getToken } from "../../services/localStorageService";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const token = getToken();

  // Lấy giỏ hàng và thông tin line items từ API
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await getUserCart(token); // Lấy giỏ hàng từ API
        setCartItems(cartData.items); // Lưu cart items vào state

        // Lấy thông tin chi tiết line item từ API
        const lineItemPromises = cartData.items.map((itemId) =>
          getLineItem(itemId, token)
        );
        const lineItemResponses = await Promise.all(lineItemPromises);
        setLineItems(lineItemResponses); // Lưu line items vào state
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error.message);
      }
    };

    fetchCartData();
  }, [token]);

  // Cập nhật giỏ hàng khi số lượng sản phẩm thay đổi
  const updateCartItem = (updatedItems) => {
    setLineItems(updatedItems);
  };

  return (
    <CartContext.Provider value={{ cartItems, lineItems, updateCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
