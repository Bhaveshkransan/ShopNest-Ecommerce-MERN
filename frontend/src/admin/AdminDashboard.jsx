import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/admin.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authenticate admin access
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      // Fetch analytics stats
      const statsRes = await fetch("/api/analytics", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const statsData = await statsRes.json();
      if (statsRes.ok) {
        setStats(statsData);
      }

      // Fetch all products
      const productsRes = await fetch("/api/products");
      const productsData = await productsRes.json();
      if (productsRes.ok) {
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Error loading admin dashboard details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleDeleteProduct = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}" from the inventory?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        alert("Product deleted successfully.");
        // Filter out deleted product
        setProducts(prev => prev.filter(p => p._id !== id));
        // Refresh analytics stats
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts - 1
        }));
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting product.");
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

      {/* Main Admin Dashboard View */}
      <main className="admin-content">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <Link to="/admin/add-product" className="btn-admin-add">
            ➕ Add New Product
          </Link>
        </div>

        {loading ? (
          <div className="profile-loading">Loading stats and inventory...</div>
        ) : (
          <>
            {/* Stats Cards Row */}
            <div className="admin-stats-grid">
              <div className="stat-card blue">
                <h4>Total Revenue</h4>
                <div className="stat-card-value">₹{stats.totalRevenue.toFixed(2)}</div>
              </div>
              <div className="stat-card purple">
                <h4>Total Orders</h4>
                <div className="stat-card-value">{stats.totalOrders}</div>
              </div>
              <div className="stat-card emerald">
                <h4>Inventory Items</h4>
                <div className="stat-card-value">{stats.totalProducts}</div>
              </div>
              <div className="stat-card rose">
                <h4>Registered Users</h4>
                <div className="stat-card-value">{stats.totalUsers}</div>
              </div>
            </div>

            {/* Manage Products Inventory */}
            <h2 className="section-title" style={{ marginBottom: "20px" }}>Product Inventory</h2>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#6b7280" }}>
                        No products found in the catalog database.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td className="product-thumb-td">
                          <img src={product.imageUrl} alt={product.name} className="admin-product-thumb" />
                        </td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>{product.name}</td>
                        <td>{product.category}</td>
                        <td style={{ fontWeight: 700, color: "#10b981" }}>₹{product.price.toFixed(2)}</td>
                        <td>{product.stock} units</td>
                        <td className="admin-actions-cell">
                          <Link to={`/admin/edit-product/${product._id}`} className="btn-admin-edit">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            className="btn-admin-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
