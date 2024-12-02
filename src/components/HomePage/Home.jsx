import React, { useEffect, useState } from "react";
import "./Home.css";

import bg1 from "../Assets/bg1.png";
import bg7 from "../Assets/bg7.jpg";
import bg3 from "../Assets/bg3.jpg";
import bg4 from "../Assets/bg4.jpg";
import bg5 from "../Assets/bg5.jpg";
import bg6 from "../Assets/bg6.jpg";
import bg8 from "../Assets/bg8.jpg";
import Product from "../Product/Prodcut";
import Footer from "../Footer/Footer";

export const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [opacity, setOpacity] = useState(1); // Trạng thái opacity của nội dung

  const images = [bg1, bg7, bg3, bg4, bg5, bg6, bg8];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // Vị trí hiện tại của cuộn
      const newOpacity = Math.max(1 - scrollTop / 300, 0); // Giảm opacity theo vị trí cuộn
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup sự kiện
  }, []);

  return (
    <>
      <div
        className="homePage"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
        }}
      >
        <div className="overlay"></div>
        <div
          className="homePage_content"
          style={{
            opacity: opacity, // Áp dụng opacity động
          }}
        >
          <div class="intro-container">
            <h1 class="intro-title">
              <span class="letter">L</span>
              <span class="letter">e</span>
              <span class="letter">v</span>
              <span class="letter">e</span>
              <span class="letter">n</span>
              <span class="letter">t</span>
              <span class="letter">s</span>
              <span> – </span>
              <span class="word">
                <span class="letter">R</span>
                <span class="letter">e</span>
                <span class="letter">d</span>
                <span class="letter">e</span>
                <span class="letter">f</span>
                <span class="letter">i</span>
                <span class="letter">n</span>
                <span class="letter">i</span>
                <span class="letter">n</span>
                <span class="letter">g</span>
              </span>
              <span> </span>
              <span class="word">
                <span class="letter">T</span>
                <span class="letter">r</span>
                <span class="letter">e</span>
                <span class="letter">n</span>
                <span class="letter">d</span>
                <span class="letter">s</span>
              </span>
            </h1>
            <p class="intro-text">
              Welcome to <span class="letter">L</span>
              <span class="letter">e</span>
              <span class="letter">v</span>
              <span class="letter">e</span>
              <span class="letter">n</span>
              <span class="letter">t</span>
              <span class="letter">s</span>– where your style begins! Explore
              our exclusive collections and redefine your wardrobe with the
              latest trends. Thank you for choosing us as your fashion
              destination. Happy shopping!
            </p>
          </div>
        </div>
      </div>
      <Product />
      <Footer />
    </>
  );
};
