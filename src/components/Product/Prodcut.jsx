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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0); // Trạng thái cho giá tối đa
  const [sortOrder, setSortOrder] = useState(""); // Trạng thái sắp xếp

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

  // Lọc và sắp xếp sản phẩm dựa trên tiêu chí
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (maxPrice > 0) {
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }

    if (sortOrder === "asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, products, maxPrice, sortOrder]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePriceChange = (event) => {
    setMaxPrice(Number(event.target.value));
  };

  const handleSortAsc = () => {
    setSortOrder("asc");
  };

  const handleSortDesc = () => {
    setSortOrder("desc");
  };

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

      {/* Tạo ô tìm kiếm */}
      <div className="product-list-search">
        <input
          type="text"
          className="product-list-search-input"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Thanh trượt giá */}
      <div className="product-list-price-filter">
        <label className="product-list-option-label">
          Giá tối đa:
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            value={maxPrice}
            onChange={handlePriceChange}
            className="product-list-price-slider"
          />
          <span>{maxPrice.toLocaleString()} VND</span>
        </label>
      </div>

      {/* Nút sắp xếp */}
      <div className="product-list-sort">
        {/* Tăng dầndần */}
        <button className="product-list-sort-button" onClick={handleSortAsc}>
          Sắp xếp giá: Tăng dần
        </button>
        {/* Giảm dần */}
        <button className="product-list-sort-button" onClick={handleSortDesc}>
          Sắp xếp giá: Giảm dần
        </button>
      </div>

      <div className="product-list-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))
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
