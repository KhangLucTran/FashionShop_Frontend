import React from "react";
import "./About.css";

const About = () => {
  const handleBackToHome = () => {
    window.location.href = "/home"; // Điều hướng đến trang Home
  };

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h1>
          About Levents <span>&copy;</span>
        </h1>
        <p>
          Welcome to **Levents**, the ultimate platform for discovering and
          experiencing extraordinary events. Our mission is to bring people
          together through unforgettable experiences, creating memories that
          last a lifetime. Whether you're looking for local concerts, exciting
          festivals, intimate gatherings, or large-scale events, we've got
          something for everyone.
        </p>
        <p>
          At **Levents**, we believe that every event has a story to tell. We
          work closely with event organizers, artists, and performers to curate
          the most captivating and unique experiences. Our platform is designed
          to provide easy access to all the information you need to plan your
          next adventure.
        </p>
        <p>
          We strive to provide seamless event booking, transparent pricing, and
          an easy-to-navigate interface to enhance your experience. Our platform
          is here to help you explore, connect, and engage with the events that
          matter most to you.
        </p>
        <p>
          Join us as we build a community of passionate event-goers who share a
          love for unique, inspiring, and entertaining events.
        </p>
      </div>

      <div className="about-button">
        <button onClick={handleBackToHome} className="back-home-btn">
          Back to Home
        </button>
      </div>
    </section>
  );
};

export default About;
