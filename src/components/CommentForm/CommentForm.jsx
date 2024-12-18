import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../services/localStorageService";
import "./CommentForm.css";
import { showInfoToast, showSuccessToast } from "../Toast/Toast";

const CommentForm = ({ productId, onCommentSubmit }) => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái gửi
  const token = getToken();

  const handleRatingClick = (value) => {
    setRating(value === rating ? 0 : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      showInfoToast("Vui lòng đăng nhập để đăng bình luận!");
      return;
    }

    if (isSubmitting) return; // Ngăn gửi lặp nếu đang xử lý
    setIsSubmitting(true); // Đặt trạng thái đang gửi

    const commentData = { productId, message, rating };

    try {
      // Gửi bình luận lên server
      const response = await axios.post(
        "http://localhost:5000/api/comment/",
        commentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = response.data.data; // Lấy bình luận mới từ phản hồi API
      showSuccessToast("Bình luận của bạn đã được gửi thành công");

      // Reset form
      setMessage("");
      setRating(1);

      // Gửi bình luận mới về component cha
      if (onCommentSubmit) {
        onCommentSubmit(newComment);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      showInfoToast("Vui lòng mua sản phẩm trước khi đánh giá!");
    } finally {
      setIsSubmitting(false); // Mở khóa biểu mẫu
    }
  };

  return (
    <div className="comment-form">
      <h3>Để lại bình luận</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Đánh giá:</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <span
                key={starValue}
                className={`star ${starValue <= rating ? "filled" : ""}`}
                onClick={() => handleRatingClick(starValue)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div>
          <label>
            Bình luận:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
              required
            />
          </label>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
