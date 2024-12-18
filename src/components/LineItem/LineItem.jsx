import React from "react";
import axios from "axios";
import "./LineItem.css";

const LineItem = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onDeleteItem,
}) => {
  const { _id, product, size, color, quantity, price, total } = item;

  const formatPrice = (value) =>
    typeof value === "number" ? value.toLocaleString() : "N/A";

  const handleSelect = (e) => {
    onSelect(_id, e.target.checked);
  };

  const handleQuantityChange = (operation) => {
    const newQuantity = operation === "increment" ? quantity + 1 : quantity - 1;
    if (newQuantity > 0) {
      onQuantityChange(_id, newQuantity);
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteItem(_id); // Gọi hàm xóa từ cha
    } catch (error) {
      console.error("Error deleting line item:", error);
    }
  };

  return (
    <div className={`line-item ${isSelected ? "selected" : ""}`}>
      <div className="line-item-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="line-item-checkbox-input"
        />
      </div>
      <img
        src={product?.images?.[0] || "default-image-url"}
        alt={product?.title || "No title available"}
        className="line-item-image"
      />
      <div className="line-item-info">
        <p className="line-item-title">{product.title}</p>
        <p>Size: {size}</p>
        <p>Color: {color}</p>
        <div className="line-item-quantity">
          <button
            onClick={() => handleQuantityChange("decrement")}
            className="quantity-btn"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => handleQuantityChange("increment")}
            className="quantity-btn"
          >
            +
          </button>
        </div>
        <p>Price: {formatPrice(price)} VND</p>
        <p>Total: {formatPrice(total)} VND</p>
      </div>
      <button className="delete-btn" onClick={handleDelete}>
        🗑️
      </button>
    </div>
  );
};

export default LineItem;
