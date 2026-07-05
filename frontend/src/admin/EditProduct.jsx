import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/admin.css";

const EditProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Authenticate admin access
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            price: data.price || "",
            category: data.category || "",
            stock: data.stock || "",
            description: data.description || "",
          });
          setCurrentImageUrl(data.imageUrl || "");
        } else {
          alert(data.message || "Failed to load product details.");
          navigate("/admin");
        }
      } catch (err) {
        console.error("Fetch product error:", err);
        alert("Failed to load product data.");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchProduct();
    }
  }, [user, id, navigate]);

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
    setSaving(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("description", formData.description);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          // CRITICAL: Do NOT set Content-Type header manually when sending FormData.
        },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Product updated successfully!");
        navigate("/admin");
      } else {
        alert(result.message || "Failed to update product.");
      }
    } catch (err) {
      console.error("Update product error:", err);
      alert("Something went wrong while updating product.");
    } finally {
      setSaving(false);
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
              <Link to="/admin" className={location.pathname.startsWith("/admin") && !location.pathname.includes("orders") && !location.pathname.includes("users") ? "active" : ""}>
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
          <h1 className="admin-page-title">Edit Product</h1>
        </div>

        {loading ? (
          <div className="profile-loading">Loading product parameters...</div>
        ) : (
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

              {currentImageUrl && (
                <div className="form-group">
                  <label>Current Product Image</label>
                  <img
                    src={currentImageUrl}
                    alt="Current product"
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="image">Replace Product Image (Optional)</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <small style={{ color: "#64748b", marginTop: "4px" }}>
                  Leave empty if you do not want to replace the current image.
                </small>
              </div>

              <div className="admin-form-actions">
                <button type="submit" className="btn-form-submit" disabled={saving}>
                  {saving ? "Updating Cloudinary Record..." : "Update Product"}
                </button>
                <Link to="/admin" className="btn-form-cancel">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditProduct;
