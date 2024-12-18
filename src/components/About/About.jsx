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
          Levents <span>&copy;</span>
        </h1>
        <p>
          Chào mừng đến với **Levents**, nền tảng tuyệt vời để khám phá và trải
          nghiệm những sự kiện phi thường. Sứ mệnh của chúng tôi là kết nối mọi
          người lại với nhau thông qua những trải nghiệm khó quên, tạo ra những
          kỷ niệm kéo dài suốt đời. Cho dù bạn đang tìm kiếm các buổi hòa nhạc
          địa phương, lễ hội thú vị, các cuộc tụ họp thân mật hay các sự kiện
          quy mô lớn, chúng tôi đều có thứ gì đó dành cho tất cả mọi người.
        </p>
        <p>
          Tại **Levents**, chúng tôi tin rằng mỗi sự kiện đều có một câu chuyện
          để kể. Chúng tôi hợp tác chặt chẽ với các nhà tổ chức sự kiện, nghệ sĩ
          và người biểu diễn để tuyển chọn những trải nghiệm hấp dẫn và độc đáo
          nhất. Nền tảng của chúng tôi được thiết kế để cung cấp quyền truy cập
          dễ dàng vào tất cả thông tin bạn cần để lập kế hoạch cho cuộc phiêu
          lưu tiếp theo của mình.
        </p>
        <p>
          Chúng tôi nỗ lực cung cấp dịch vụ đặt sự kiện liền mạch, giá cả minh
          bạch và giao diện dễ điều hướng để nâng cao trải nghiệm của bạn. Nền
          tảng của chúng tôi ở đây để giúp bạn khám phá, kết nối và tham gia vào
          các sự kiện quan trọng nhất đối với bạn.
        </p>
        <p>
          Hãy tham gia cùng chúng tôi để xây dựng một cộng đồng những người đam
          mê sự kiện, những người cùng chia sẻ tình yêu dành cho các sự kiện độc
          đáo, truyền cảm hứng và giải trí.
        </p>
      </div>

      <div className="about-button">
        <button onClick={handleBackToHome} className="back-home-btn">
          Trở về Trang chủ
        </button>
      </div>
    </section>
  );
};

export default About;
