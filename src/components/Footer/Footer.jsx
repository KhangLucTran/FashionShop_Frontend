import React from "react";
import "./Footer.css";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";

const Footer = () => {
  return (
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>Về Levents</h3>
          <ul>
            <li>Thông tin</li>
            <li>Danh sách cửa hàng</li>
            <li>Cơ hội nghề nghiệp</li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Trợ giúp</h3>
          <ul>
            <li>FAQ</li>
            <li>Chính sách trả hàng</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Tài khoản</h3>
          <ul>
            <li>Tư cách thành viên</li>
            <li>Hồ sơ</li>
            <li>Coupons</li>
          </ul>
        </div>
        <div class="footer-section newsletter">
          <h3>Bản tin điện tử</h3>
          <p>
            Đăng ký ngay để nhận thông tin về sản phẩm mới, khuyến mãi và sự
            kiện tại Levents.
          </p>
          <button class="subscribe-btn">Đăng ký ngay</button>
        </div>
      </div>
      <div class="footer-social">
        <p>Tài khoản xã hội Levents</p>
        <div class="social-icons">
          <a href="#" className="facebook">
            <FaFacebookSquare />
          </a>
          <a href="#" className="instagram">
            <FaInstagram />
          </a>
          <a href="#" className="twitter">
            <FaTwitterSquare />
          </a>
        </div>
        <div className="footer-flag">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
            alt="Vietnam Flag"
            className="vietnam-flag"
          />
          <span>Việt Nam</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
