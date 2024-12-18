import React, { useState, useEffect, useCallback } from "react";
import { getToken } from "../../services/localStorageService";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../Toast/Toast";
import "./Favorite.css";
import Footer from "../Footer/Footer";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const navigate = useNavigate();

  // Hàm lấy danh sách sản phẩm yêu thích
  const fetchFavorites = useCallback(async () => {
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập để xem sản phẩm yêu thích.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/favorite", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.data); // Lưu danh sách yêu thích vào state
        setLoading(false); // Đã tải xong dữ liệu
      } else {
        throw new Error("Không thể tải danh sách yêu thích.");
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm yêu thích:", error);
      showErrorToast("Lỗi khi tải sản phẩm yêu thích.");
      setLoading(false); // Dừng loading dù có lỗi
    }
  }, [navigate]);

  // Tải danh sách yêu thích khi component mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Hàm xóa sản phẩm khỏi yêu thích
  const removeFromFavorites = useCallback(
    async (productId) => {
      const token = getToken();
      if (!token) {
        alert("Vui lòng đăng nhập để xóa sản phẩm khỏi yêu thích.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/favorite/delete-by-prouse",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId }),
          }
        );

        if (response.ok) {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((fav) => fav.productId._id !== productId)
          ); // Cập nhật danh sách yêu thích
          showSuccessToast("Sản phẩm đã được xóa khỏi danh sách yêu thích.");
        } else {
          throw new Error("Không thể xóa sản phẩm yêu thích.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm yêu thích:", error);
        showErrorToast("Lỗi khi xóa sản phẩm yêu thích.");
      }
    },
    [navigate]
  );

  // Điều hướng đến trang chi tiết sản phẩm
  const viewProductDetail = useCallback(
    (productId) => {
      navigate(`/product-detail/${productId}`);
    },
    [navigate]
  );

  return (
    <div className="favorite-page">
      <h2>Sản phẩm yêu thích</h2>
      {loading ? (
        <p>Đang tải sản phẩm yêu thích...</p>
      ) : favorites.length === 0 ? (
        <p>Không có sản phẩm yêu thích nào.</p>
      ) : (
        <div className="favorite-products">
          {favorites.map((favorite) => (
            <div key={favorite._id} className="favorite-product">
              <div className="favorite-product-image">
                <img
                  src={favorite.productId.images[0]}
                  alt={favorite.productId.title}
                  className="product-image"
                />
              </div>
              <div className="favorite-product-info">
                <h3>{favorite.productId.title}</h3>
                <p>{favorite.productId.description}</p>
                <p className="product-price">
                  {favorite.productId.price.toLocaleString()} VND
                </p>
                <button
                  className="remove-from-favorite-btn"
                  onClick={() => removeFromFavorites(favorite.productId._id)}
                >
                  Xóa khỏi yêu thích
                </button>
                <button
                  className="view-product-detail-btn"
                  onClick={() => viewProductDetail(favorite.productId._id)}
                >
                  Xem thông tin
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Favorite;
