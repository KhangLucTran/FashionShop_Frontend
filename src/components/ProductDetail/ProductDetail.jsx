import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, addLineItemToCart } from "../../services/APIServices";
import { useCart } from "../Card/cardContext";
import Footer from "../Footer/Footer";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Comment from "../Comment/Comment";
import { showSuccessToast } from "../Toast/Toast";
import { getToken } from "../../services/localStorageService";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { addToCart } = useCart();
  const [averageRating, setAverageRating] = useState(0); // Điểm trung bình
  const [totalReviews, setTotalReviews] = useState(0); // Tổng số lượt đánh giá

  // Cách lấy size và color mặc định khi sản phẩm đã được tải
  useEffect(() => {
    if (product) {
      setSelectedSize(product?.sizes?.[0] || "");
      setSelectedColor(product?.colors?.[0] || "");
    }
  }, [product]);

  const fetchFavoriteStatus = useCallback(async () => {
    const token = getToken();
    if (!token) return; // Không có token thì không kiểm tra trạng thái yêu thích

    try {
      const response = await fetch(`http://localhost:5000/api/favorite/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite); // Cập nhật trạng thái yêu thích
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error.message);
    }
  }, [id]);

  // Fetch dữ liệu sản phẩm và trạng thái yêu thích
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
        fetchFavoriteStatus(); // Kiểm tra trạng thái yêu thích sau khi có sản phẩm
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, fetchFavoriteStatus]);

  const handleRatingUpdate = (average, total) => {
    setAverageRating(average);
    setTotalReviews(total);
  };

  const handleScroll = (e) => {
    if (e.deltaY < 0 && product?.images?.length > 0) {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const toggleFavorite = async () => {
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích.");
      navigate("/login");
      return;
    }

    try {
      const method = isFavorite ? "DELETE" : "POST";
      const url = isFavorite
        ? "http://localhost:5000/api/favorite/delete-by-prouse"
        : "http://localhost:5000/api/favorite/"; // API POST để thêm yêu thích

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }), // Gửi productId để thêm hoặc xóa sản phẩm yêu thích
      });

      if (!response.ok) {
        throw new Error("Không thể thay đổi trạng thái yêu thích.");
      }

      // Cập nhật trạng thái yêu thích sau khi thêm hoặc xóa thành công
      setIsFavorite((prev) => !prev); // Đảo trạng thái yêu thích

      // Hiển thị thông báo thành công
      showSuccessToast(
        isFavorite
          ? "Sản phẩm đã được xóa khỏi danh sách yêu thích."
          : "Sản phẩm đã được thêm vào danh sách yêu thích."
      );
    } catch (error) {
      console.error("Lỗi khi gọi API yêu thích:", error.message);
      alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Vui lòng chọn size và màu sắc.");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ.");
        navigate("/login");
        return;
      }

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

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found.</p>;

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
                <label htmlFor="size">Kích thước</label>
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
                <label htmlFor="color">Màu sắc</label>
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
                <strong>Loại:</strong> {product.category}
              </p>
              <p className="product-stock">
                <strong>Kho:</strong>{" "}
                {product.stock > 0 ? product.stock : "Out of stock"}
              </p>
            </div>
            <div className="product-rating">
              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < averageRating ? (
                      <FaHeart className="star-icon filled" />
                    ) : (
                      <FaRegHeart className="star-icon" />
                    )}
                  </span>
                ))}
              </div>
              <p className="rating-text">{averageRating} / 5 sao</p>
            </div>
            {/* Nút "Thêm vào giỏ" */}
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                >
                  -
                </button>
                <input type="number" value={quantity} min="1" readOnly />
                <button
                  onClick={() =>
                    setQuantity((prev) => Math.min(prev + 1, product.stock))
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
                Thêm vào giỏ hàng
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
      {/* Hiển thị các bình luận dưới sản phẩm */}
      <Comment productId={id} onRatingUpdate={handleRatingUpdate} />
      <Footer />
    </>
  );
};

export default ProductDetail;
