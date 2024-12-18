import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProductById, addProduct } from "../../services/APIServices";
import { getToken } from "../../services/localStorageService";
import { showSuccessToast, showErrorToast } from "../Toast/Toast";
import "./ProductManagement.css";

const CustomProductManagement = ({ products, setProducts }) => {
  const [searchProductTitle, setSearchProductTitle] = useState("");
  const [isAddProductFormVisible, setIsAddProductFormVisible] = useState(false); // Trạng thái hiển thị form
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleDeleteProduct = async (productId) => {
    const token = getToken();
    try {
      await deleteProductById(productId, token);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      showSuccessToast("Xóa sản phẩm thành công");
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      showErrorToast("Xóa sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewProductDetail = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchProductTitle.toLowerCase())
  );

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = getToken();

    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);
    formData.append("category", productData.category);
    images.forEach((image) => formData.append("images", image));

    try {
      const newProduct = await addProduct(formData, token);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      showSuccessToast("Thêm sản phẩm thành công");
      setProductData({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
      setImages([]);
      setIsAddProductFormVisible(false); // Ẩn form sau khi thêm sản phẩm thành công
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      showErrorToast("Thêm sản phẩm thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <section className="custom-product-management">
      <h2 className="custom-section-title">Quản lý Sản phẩm</h2>

      <div className="custom-total-products">
        Tổng số sản phẩm: {filteredProducts.length}
      </div>

      <input
        type="text"
        placeholder="Tìm sản phẩm theo title"
        value={searchProductTitle}
        onChange={(e) => setSearchProductTitle(e.target.value)}
        className="custom-search-input"
      />

      <ul className="custom-product-list">
        {filteredProducts.map((product) => (
          <li key={product._id} className="custom-product-item">
            <div className="custom-product-info">
              <img
                src={product.images[0]}
                alt={`Hình ảnh sản phẩm ${product.title}`}
                className="custom-product-list-image"
                loading="lazy"
              />
              <span>{product.title}</span>
            </div>
            <button
              className="custom-delete-btn"
              onClick={() => handleDeleteProduct(product._id)}
            >
              Xóa
            </button>
            <button
              className="custom-view-product-btn"
              onClick={() => handleViewProductDetail(product._id)}
            >
              Xem chi tiết
            </button>
          </li>
        ))}
      </ul>

      <button
        className="show-add-product-btn"
        onClick={() => setIsAddProductFormVisible((prev) => !prev)}
      >
        {isAddProductFormVisible
          ? "Ẩn Form Thêm Sản Phẩm"
          : "Bấm Thêm Sản Phẩm"}
      </button>

      {isAddProductFormVisible && (
        <form className="new-add-product-form" onSubmit={handleAddProduct}>
          <h2 className="new-form-title">Thêm sản phẩm</h2>
          <div className="new-form-group">
            <label htmlFor="title" className="new-form-label">
              Tên sản phẩm:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="new-form-input"
              value={productData.title}
              onChange={(e) =>
                setProductData({ ...productData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="new-form-group">
            <label htmlFor="description" className="new-form-label">
              Mô tả:
            </label>
            <textarea
              id="description"
              name="description"
              className="new-form-textarea"
              value={productData.description}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
              required
            ></textarea>
          </div>

          <div className="new-form-group">
            <label htmlFor="price" className="new-form-label">
              Giá:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className="new-form-input"
              value={productData.price}
              onChange={(e) =>
                setProductData({ ...productData, price: e.target.value })
              }
              required
            />
          </div>

          <div className="new-form-group">
            <label htmlFor="stock" className="new-form-label">
              Số lượng trong kho:
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              className="new-form-input"
              value={productData.stock}
              onChange={(e) =>
                setProductData({ ...productData, stock: e.target.value })
              }
              required
            />
          </div>

          <div className="new-form-group">
            <label htmlFor="category" className="new-form-label">
              Loại sản phẩm:
            </label>
            <input
              type="text"
              id="category"
              name="category"
              className="new-form-input"
              value={productData.category}
              onChange={(e) =>
                setProductData({ ...productData, category: e.target.value })
              }
              required
            />
          </div>

          <div className="new-form-group">
            <label htmlFor="images" className="new-form-label">
              Hình ảnh:
            </label>
            <input
              type="file"
              id="images"
              name="images"
              className="new-form-file-input"
              multiple
              accept="image/*"
              onChange={(e) => setImages([...e.target.files])}
              required
            />
          </div>

          <button type="submit" className="new-submit-btn">
            Thêm sản phẩm
          </button>
        </form>
      )}
    </section>
  );
};

export default CustomProductManagement;
