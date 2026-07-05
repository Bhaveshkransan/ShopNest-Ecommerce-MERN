import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/admin.css";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Authenticate admin access
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select a product image to upload.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    data.append("image", imageFile);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          // CRITICAL: Do NOT set Content-Type header manually when sending FormData.
          // The browser needs to set it automatically with the boundary token.
        },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Product added successfully!");
        navigate("/admin");
      } else {
        alert(result.message || "Failed to add product.");
      }
    } catch (err) {
      console.error("Create product error:", err);
      alert("Something went wrong while submitting product.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div>
          <h3>Admin Control</h3>
          <ul className="admin-sidebar-links">
            <li>
              <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className={location.pathname === "/admin/orders" ? "active" : ""}>
                🛒 Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className={location.pathname === "/admin/users" ? "active" : ""}>
                👥 Users
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Add New Product</h1>
        </div>

        <div className="admin-card">
          <form className="admin-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. Classic T-Shirt"
              />
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="price">Price (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 19.99"
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. 100"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Accessories">Accessories</option>
                <option value="Fitness">Fitness</option>
                <option value="Kitchenware">Kitchenware</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Write detailed product descriptions here..."
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="image">Product Image *</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <small style={{ color: "#64748b", marginTop: "4px" }}>
                Select an image file. It will be uploaded securely to Cloudinary storage.
              </small>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="btn-form-submit" disabled={loading}>
                {loading ? "Uploading to Cloudinary..." : "Save Product"}
              </button>
              <Link to="/admin" className="btn-form-cancel">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
