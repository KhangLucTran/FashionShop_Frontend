import React, { useState, useEffect } from "react";
import "./Header.css";
import { MdManageAccounts } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { getToken } from "../../services/localStorageService";
import { logOut } from "../../services/authenticationService";
import { useNavigate } from "react-router-dom";
import { getUserCart } from "../../services/APIServices";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null); // Thêm cartId vào state
  const navigate = useNavigate();

  // Lấy token và fetch cart khi người dùng đã đăng nhập
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      fetchCartItems(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Hàm fetch thông tin giỏ hàng
  const fetchCartItems = async (token) => {
    try {
      const data = await getUserCart(token);
      setCartItems(data.items); // Lưu danh sách sản phẩm vào state
      setCartId(data._id); // Lưu cartId vào state
      localStorage.setItem("cartId", data._id); // Lưu cartId vào localStorage để sử dụng lại
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClick = (path) => {
    window.location.href = path;
  };

  // Lắng nghe sự kiện scroll để thay đổi giao diện header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".account-menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    logOut();
    window.location.href = "/";
  };

  const handleGoToCart = () => {
    if (!cartId) {
      console.error("Cart ID not found!");
      return;
    }
    navigate("/card", { state: { cartItems, cartId } });
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <a href="/home">Levents</a>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <a href="/home">Trang chủ</a>
          </li>
          <li>
            <a href="/about">Thông tin</a>
          </li>
          <li>
            <a href="#services">Dịch vụ</a>
          </li>
          <li>
            <a href="#contact">Liên hệ</a>
          </li>
        </ul>
      </nav>
      <div className="nav_icon">
        {isAuthenticated && (
          <div className="account-menu-container">
            <a href="/favorite">
              <FaRegHeart />
            </a>
            <a href="#" onClick={handleGoToCart}>
              <TiShoppingCart />
            </a>
            <a href="#" onClick={handleToggleMenu}>
              <MdManageAccounts />
            </a>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li onClick={() => handleClick("/profile-view")}>
                    Trang cá nhân
                  </li>
                  <li onClick={() => handleClick("/order-history")}>
                    Lịch sử mua hàng
                  </li>{" "}
                  {/* Thêm mục Order History */}
                  <li onClick={handleLogout}>Đăng xuất</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {!isAuthenticated && (
        <div className="auth-buttons">
          <button className="login" onClick={() => handleClick("/login")}>
            Đăng nhập
          </button>
          <button className="signup" onClick={() => handleClick("/login")}>
            Đăng xuất
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
