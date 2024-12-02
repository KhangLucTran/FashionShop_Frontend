import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, addLineItemToCart } from "../../services/APIServices";
import { useCart } from "../Card/cardContext";
import Footer from "../Footer/Footer";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getToken } from "../../services/localStorageService";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || ""); // Lưu trữ giá trị size
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || ""
  ); // Lưu trữ giá trị color
  const { addToCart } = useCart();

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      const token = getToken();
      if (!token) {
        alert("Vui lòng đăng nhập để xem thông tin sản phẩm.");
        navigate("/login");
        return;
      }

      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]); // Đảm bảo useEffect chỉ chạy khi id thay đổi

  const handleScroll = (e) => {
    if (e.deltaY < 0 && product?.images?.length > 0) {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleAddToCart = async () => {
    try {
      const token = getToken();
      if (!token) {
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ.");
        navigate("/login");
        return;
      }

      // Kiểm tra xem size và color có được chọn chưa
      if (!selectedSize || !selectedColor) {
        alert("Vui lòng chọn size và màu sắc.");
        return;
      }

      console.log("token", token);
      console.log("productID", id);
      console.log("size", selectedSize);
      console.log("color", selectedColor);

      await addLineItemToCart(
        id, // ID của sản phẩm
        quantity, // Số lượng
        product.price, // Giá sản phẩm
        selectedSize, // Size đã chọn
        selectedColor, // Màu sắc đã chọn
        token // Token để xác thực
      );
      navigate("/cart"); // Điều hướng đến giỏ hàng sau khi thêm sản phẩm
    } catch (error) {
      console.error("Failed to add product to cart:", error.message);
    }
  };

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <>
      <div className="product-detail-section">
        <div className="product-detail-container" onWheel={handleScroll}>
          {/* Hình ảnh sản phẩm */}
          <div className="product-image">
            <img
              src={product.images?.[activeImage] || "placeholder.jpg"}
              alt={`Product ${product.title}`}
              className="active-image"
            />
            <div className="product-gallery">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  className="product-thumbnail"
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="product-info">
            <h2 className="product-title">{product.title}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">
              {product.price.toLocaleString()} VND
            </p>
            <div className="product-options">
              <div className="product-size">
                <label htmlFor="size">Size</label>
                <select
                  id="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {product.sizes?.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product-color">
                <label htmlFor="color">Color</label>
                <select
                  id="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  {product.colors?.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <p className="product-category">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="product-stock">
                <strong>Stock:</strong>{" "}
                {product.stock > 0 ? product.stock : "Out of stock"}
              </p>
            </div>

            {/* Nút "Thêm vào giỏ" */}
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button
                  onClick={() =>
                    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                  }
                >
                  -
                </button>
                <input type="number" value={quantity} min="1" readOnly />
                <button
                  onClick={() =>
                    setQuantity((prev) =>
                      prev < product.stock ? prev + 1 : prev
                    )
                  }
                >
                  +
                </button>
              </div>
              <button
                className="product-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
              {/* Icon yêu thích */}
              <div className="favorite-icon" onClick={toggleFavorite}>
                {isFavorite ? (
                  <FaHeart className="heart-icon favorite" />
                ) : (
                  <FaRegHeart className="heart-icon" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
