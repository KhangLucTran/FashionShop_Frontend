import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hàm hiển thị thông báo thành công
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
};

// Hàm hiển thị thông báo thông tin
export const showInfoToast = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
};

// Hàm hiển thị thông báo lỗi
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
};

// Hàm hiển thị thông báo đang xử lý
export const showPromiseToast = async (promise, messages) => {
  try {
    // Thực hiện thông báo với toast.promise
    await toast.promise(promise, {
      pending: messages.pending,
      success: {
        render: messages.success,
        theme: "colored", // Sử dụng theme màu sắc cho success
        transition: Bounce, // Sử dụng hiệu ứng bounce cho success
      },
      error: {
        render: messages.error,
        theme: "colored", // Sử dụng theme màu sắc cho error
        transition: Bounce, // Sử dụng hiệu ứng bounce cho error
      },
    });

    // Nếu có thông báo "info", hiển thị sau khi thành công
    if (messages.info) {
      showInfoToast(messages.info);
    }
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error in showPromiseToast:", error);
    showErrorToast("Đã xảy ra lỗi, vui lòng thử lại sau!");
  }
};
