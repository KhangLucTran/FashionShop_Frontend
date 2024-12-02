import React from "react";
import "./ConfirmModal.css"; // Thêm style tùy chỉnh cho modal

const ConfirmModal = ({ showModal, onClose, onContinue, onLeave }) => {
  if (!showModal) return null; // Nếu showModal là false, không render modal

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h3>Bạn có chắc muốn rời khỏi mà không lưu thay đổi?</h3>
        <div className="confirm-modal-actions">
          <button onClick={onContinue} className="btn-continue">
            Tiếp tục chỉnh sửa
          </button>
          <button onClick={onLeave} className="btn-leave">
            Rời khỏi mà không lưu
          </button>
        </div>
        <button onClick={onClose} className="btn-close">
          X
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
