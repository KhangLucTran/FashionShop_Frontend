import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Hàm lấy danh sách tỉnh
export const getProvinces = async (token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/address/province/provinces`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.provinces;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

// Hàm lấy danh sách huyện theo tỉnh
export const getDistrictsByProvince = async (provinceId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/address/district/province/${provinceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// Hàm cập nhật hồ sơ
export const updateProfile = async (data, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/profile/update-profile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// API login
export const login = async ({ email, password }) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng nhập thất bại.");
  }
};

// API register
export const register = async ({ email, password, username }) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        email,
        password,
        username,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại.");
  }
};

// API gửi mail xác minh
export const sendVerificationEmail = async (email) => {
  try {
    await axios.post(
      `http://localhost:5000/api/auth/send-mail-verify/${email}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw new Error("Gửi email xác minh thất bại.");
  }
};

// Hàm lấy thông tin người dùng
export const getUserData = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw error;
  }
};

// Hàm cập nhật avatar
export const updateAvatar = async (avatar, token) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const response = await axios.put(
      `${API_BASE_URL}/profile/update-avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data.avatar;
  } catch (error) {
    console.error("Lỗi khi tải lên avatar:", error);
    throw error;
  }
};

// Hàm lấy tất cả sản phẩm
export const getAllProducts = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/getall-product`);
    return response.data; // Giả sử API trả về danh sách sản phẩm trong thuộc tính `products`
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách sản phẩm."
    );
  }
};

// Hàm lấy sản phẩm theo id
export const getProductById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/product/get-product/${id}`
    );
    return response.data; // Giả sử API trả về thông tin sản phẩm
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw new Error(
      error.response?.data?.message || "Không thể lấy thông tin sản phẩm."
    );
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addLineItemToCart = async (
  productId,
  quantity,
  price,
  size,
  color,
  token
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/lineitem/add-lineitem`,
      {
        product: productId,
        quantity: quantity,
        price: price,
        size,
        color,
      },
      {
        headers: { Authorization: `Bearer ${token}` }, // Token được gửi qua header
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw new Error("Không thể thêm sản phẩm vào giỏ hàng.");
  }
};

// Lấy thông tin giỏ hàng
export const getUserCart = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/user-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error.message);
    throw error;
  }
};

// Lấy thông tin chi tiết của một lineItem
export const getLineItem = async (itemId, token) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/lineitem/get-lineitem/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin lineItem:", error.message);
    throw error;
  }
};

// Hàm xóa LineItem khỏi Cart
export const deleteLineItemFromCart = async (cartId, lineItemId, token) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cart/cart/${cartId}/line-item/${lineItemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting line item:", error);
    throw error;
  }
};

// Hàm lấy tất cả người dùng (Admin)
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users; // Giả sử API trả về danh sách trong `users`
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error(
      error.response?.data?.message || "Không thể lấy danh sách người dùng."
    );
  }
};
