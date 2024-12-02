import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../services/APIServices";
import "./Product.css";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/product-detail/${item._id}`);
  };

  return (
    <div className="product-list-card" key={item._id}>
      <img
        src={item.images[1]}
        alt={`Hình ảnh sản phẩm ${item.title}`}
        className="product-list-image"
        loading="lazy"
      />
      <div className="product-list-info">
        <h3 className="product-list-title">{item.title}</h3>
        <p className="product-list-price">{item.price.toLocaleString()} VND</p>
        <div className="product-list-options">
          <label className="product-list-option-label">
            Size:
            <select className="product-list-select">
              {item.sizes.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
          </label>
          <label className="product-list-option-label">
            Màu sắc:
            <div className="product-list-colors">
              {item.colors.map((color) => (
                <span
                  key={color}
                  className="product-list-color-swatch"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          </label>
        </div>
        <button className="product-list-button" onClick={handleBuyNow}>
          Mua ngay
        </button>
      </div>
    </div>
  );
};

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getAllProducts();
      setProducts(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="product-list-loading-container">
        {[...Array(3)].map((_, index) => (
          <div className="product-list-skeleton-card" key={index}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="product-list-section">
      <h1 className="product-list-title">Danh sách sản phẩm</h1>
      <div className="product-list-grid">
        {products.length > 0 ? (
          products.map((item) => <ProductCard key={item._id} item={item} />)
        ) : (
          <p className="product-list-no-products">
            Không có sản phẩm nào để hiển thị.
          </p>
        )}
      </div>
    </div>
  );
};

export default Product;
