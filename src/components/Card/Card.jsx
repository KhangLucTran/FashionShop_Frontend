import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Card/cardContext";
import LineItem from "../LineItem/LineItem";
import { deleteLineItemFromCart } from "../../services/APIServices";
import { getToken } from "../../services/localStorageService";
import "./Card.css";

const Card = () => {
  const { lineItems, updateCartItem } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const navigate = useNavigate();

  // Lấy cartId từ localStorage khi component mount
  useEffect(() => {
    const storedCartId = localStorage.getItem("cartId");
    if (storedCartId) {
      setCartId(storedCartId);
    } else {
      console.error("Cart ID not found in localStorage.");
    }
  }, []);

  const handleSelectItem = (id, isSelected) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    const updatedItems = lineItems.map((item) => {
      if (item._id === id) {
        const newTotal = newQuantity * item.price;
        return { ...item, quantity: newQuantity, total: newTotal };
      }
      return item;
    });

    updateCartItem(updatedItems);
  };

  const handleDeleteItem = async (lineItemId) => {
    if (!cartId) {
      console.error("Cannot delete line item: cartId is missing.");
      return;
    }

    try {
      const token = getToken();
      const response = await deleteLineItemFromCart(cartId, lineItemId, token);

      const deletedItem = response.deletedLineItem;
      const updatedItems = lineItems.filter(
        (item) => item._id !== deletedItem._id
      );
      updateCartItem(updatedItems);
    } catch (error) {
      console.error("Error deleting line item:", error);
    }
  };

  const handleCheckout = () => {
    const selectedCartItems = lineItems.filter((item) =>
      selectedItems.includes(item._id)
    );
    // Chuyển tới trang thanh toán chỉ với các items đã chọn
    navigate("/checkout", { state: { selectedCartItems, cartId } });
  };

  if (lineItems.length === 0) {
    return (
      <div className="card-list-section">
        <h1 className="card-list-title">Giỏ hàng của bạn</h1>
        <p className="card-list-no-items">Giỏ hàng của bạn hiện đang trống.</p>
      </div>
    );
  }

  return (
    <div className="card-list-section">
      <h1 className="card-list-title">Giỏ hàng của bạn</h1>
      <div className="card-list-grid">
        {lineItems.map((item) => (
          <LineItem
            key={item._id}
            item={item}
            isSelected={selectedItems.includes(item._id)}
            onSelect={handleSelectItem}
            onQuantityChange={handleQuantityChange}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </div>
      <div className="checkout-section">
        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={selectedItems.length === 0}
        >
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  );
};

export default Card;
