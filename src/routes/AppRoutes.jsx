import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginForm } from "../components/Login/LoginForm";
import { Home } from "../components/HomePage/Home";
import { AdminHome } from "../components/HomePage/AdminHome";
import OtpPage from "../components/OTP/OtpPage";
import About from "../components/About/About";
import Profile from "../components/Profile/Profile";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import ResetPassword from "../components/ResetPassword/ResetPassword";
import ProfileView from "../components/ProfileView/ProfileView";
import Product from "../components/Product/Prodcut";
import ProductDetail from "../components/ProductDetail/ProductDetail";
import { CartProvider } from "../components/Card/cardContext"; // Import CartProvider
import Card from "../components/Card/Card";
import Checkout from "../components/Checkout/Checkout";
import Invoice from "../components/Invoice/Invoice";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/invoice/:invoiceId" element={<Invoice />} />

        {/* Chỉ bọc các route liên quan đến giỏ hàng với CartProvider */}
        <Route
          path="/product-detail/:id"
          element={
            <CartProvider>
              <ProductDetail />
            </CartProvider>
          }
        />

        <Route
          path="/card"
          element={
            <CartProvider>
              <Card />
            </CartProvider>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-view" element={<ProfileView />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
