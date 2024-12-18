import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";
import { getToken } from "../../services/localStorageService";
import {
  getProvinces,
  getDistrictsByProvince,
  updateProfile,
} from "../../services/APIServices.js";
import { debounce } from "lodash";
import "./Profile.css";
import Footer from "../Footer/Footer.jsx";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { showSuccessToast } from "../Toast/Toast.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = location.state || {};
  const token = getToken();
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    email: userData?.email || "",
    username: userData?.profileId?.username || "",
    province: userData?.address?.province || "",
    district: userData?.address?.district || "",
    addressDetail: userData?.address?.detail || "",
    mobilePhone: userData?.profileId?.numberphone || "",
    birthday: userData?.profileId?.dob || "",
    gender: userData?.profileId?.gender || "male",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Lấy các tỉnh có trạng thái lưu trữ đệm và tải
  useEffect(() => {
    const fetchProvinces = async () => {
      const cachedProvinces = localStorage.getItem("provinces");
      if (cachedProvinces) {
        setProvinces(JSON.parse(cachedProvinces));
      } else {
        setLoading(true);
        try {
          const provinceData = await getProvinces(token);
          setProvinces(provinceData);
          localStorage.setItem("provinces", JSON.stringify(provinceData));
        } catch (error) {
          console.error("Error fetching provinces:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProvinces();
  }, [token]);

  // Sử dụng useCallback để tránh tạo lại hàm debounce trên mỗi lần kết xuất
  const fetchDistricts = useCallback(
    debounce(async (provinceId) => {
      if (provinceId) {
        setLoading(true);
        try {
          const districtData = await getDistrictsByProvince(provinceId, token);
          setDistricts(districtData);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setDistricts([]);
      }
    }, 500), // Thời gian phản hồi 500ms
    [token]
  );

  // Lấy quận khi tỉnh thay đổi
  useEffect(() => {
    fetchDistricts(formData.province);
  }, [formData.province, fetchDistricts]);

  // Kiểm tra tuổi dựa trên Ngày sinh nhập vào.
  useEffect(() => {
    const checkAge = () => {
      if (formData.birthday) {
        const today = new Date();
        const birthDate = new Date(formData.birthday);
        const age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        const day = today.getDate() - birthDate.getDate();

        if (
          age < 16 ||
          (age === 16 && (month < 0 || (month === 0 && day < 0)))
        ) {
          setErrors((prev) => ({
            ...prev,
            birthday: "Bạn phải đủ 16 tuổi để sử dụng dịch vụ.",
          }));
        } else {
          setErrors((prev) => {
            const { birthday, ...rest } = prev;
            return rest;
          });
        }
      }
    };
    checkAge();
  }, [formData.birthday]);

  // Kiểm tra định dạng số điện thoại.
  const validatePhone = useCallback((phone) => {
    const regex = /^0\d{9}$/;
    if (!regex.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        mobilePhone: "Số điện thoại phải đủ 10 số và bắt đầu bằng số 0.",
      }));
    } else {
      setErrors((prev) => {
        const { mobilePhone, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  // Kiểm tra định dạng Tên tài khoản.
  const validateUsername = useCallback((username) => {
    if (!username.trim()) {
      setErrors((prev) => ({
        ...prev,
        username: "Tên tài khoản không được để trống.",
      }));
    } else {
      setErrors((prev) => {
        const { username, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Xác thực các trường có liên quan khi thay đổi
    if (name === "mobilePhone") validatePhone(value);
    if (name === "username") validateUsername(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      username: formData.username,
      province: provinces.find((p) => p.provinceId === formData.province)?.name,
      district: districts.find((d) => d.districtId === formData.district)?.name,
      addressDetail: formData.addressDetail,
      mobilePhone: formData.mobilePhone,
      birthday: formData.birthday,
      gender: formData.gender,
    };

    try {
      setLoading(true);
      await updateProfile(updateData, token);
      showSuccessToast("Cập nhật thông tin thành công!");
      navigate("/profile-view");
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelButton = () => setShowModal(true);

  const handleContinue = () => setShowModal(false);

  const handleLeave = () => {
    setShowModal(false);
    navigate("/profile-view");
  };

  const formattedBirthday = useMemo(() => {
    if (!formData.birthday) return "";
    const parsedDate = parseISO(formData.birthday);
    return isValid(parsedDate) ? format(parsedDate, "yyyy-MM-dd") : "";
  }, [formData.birthday]);

  return (
    <>
      <div className="profile-layout">
        <div className="profile-container">
          <div className="profile-logo">
            <a href="/" className="logo">
              Levents <span>&copy;</span>
            </a>
          </div>
          <h2>Chỉnh sửa hồ sơ</h2>
          <form onSubmit={handleSubmit}>
            <div className="profile-row">
              <label>Email (Không thay đổi)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
              />
            </div>
            <div className="profile-row">
              <label>Tên tài khoản</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder="Vui lòng nhập tên tài khoản"
                onChange={handleChange}
                required
                className={errors.username ? "error-input" : ""}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
            <div className="profile-row">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="birthday"
                value={formattedBirthday}
                onChange={handleChange}
                className={errors.birthday ? "error-input" : ""}
              />
              {errors.birthday && (
                <span className="error-message">{errors.birthday}</span>
              )}
            </div>
            <div className="profile-row">
              <label>Tỉnh</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              >
                <option value="">Vui lòng chọn một tỉnh</option>
                {provinces.map((province) => (
                  <option key={province.provinceId} value={province.provinceId}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="profile-row">
              <label>Quận/Huyện</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.province}
              >
                <option value="">Vui lòng chọn quận của bạn</option>
                {districts.map((district) => (
                  <option key={district.districtId} value={district.districtId}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="profile-row">
              <label>Chi tiết địa chỉ</label>
              <input
                type="text"
                name="addressDetail"
                value={formData.addressDetail}
                placeholder="Phường, căn hộ, dãy phòng, khu, tòa nhà..."
                onChange={handleChange}
                required
              />
            </div>
            <div className="profile-row">
              <label>Điện thoại di động</label>
              <input
                type="tel"
                name="mobilePhone"
                value={formData.mobilePhone}
                placeholder="Nhập 10 số bắt đầu bằng số 0"
                onChange={handleChange}
                required
                className={errors.mobilePhone ? "error-input" : ""}
              />
              {errors.mobilePhone && (
                <span className="error-message">{errors.mobilePhone}</span>
              )}
            </div>
            <div className="profile-row">
              <label>Giới tính</label>
              <div className="gender-group">
                <label className="gender-label">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                  />
                  Nam
                </label>
                <label className="gender-label">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />
                  Nữ
                </label>
                <label className="gender-label">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                  />
                  Khác
                </label>
              </div>
            </div>
            <div className="profile-actions">
              <button type="submit" className="save-btn">
                Xác nhận
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelButton}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
        {loading && <p>Đang tải dữ liệu...</p>}
      </div>

      <ConfirmModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onContinue={handleContinue}
        onLeave={handleLeave}
      />
      <Footer />
    </>
  );
};

export default Profile;
