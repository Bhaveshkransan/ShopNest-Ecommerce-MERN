import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/admin.css";

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authenticate admin access
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchUsers = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/auth/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data || []);
      } else {
        alert(data.message || "Failed to load users list.");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
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
          <h1 className="admin-page-title">Registered User Accounts</h1>
        </div>

        {loading ? (
          <div className="profile-loading">Loading customer profiles...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#6b7280" }}>
                      No registered user accounts found.
                    </td>
                  </tr>
                ) : (
                  users.map((account) => {
                    const dateObj = new Date(account.createdAt || Date.now());
                    const formattedDate = dateObj.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <tr key={account._id}>
                        <td>
                          <div className="admin-table-user-avatar">
                            {getInitials(account.name)}
                          </div>
                        </td>
                        <td style={{ color: "#64748b", fontFamily: "monospace" }}>
                          {account._id}
                        </td>
                        <td style={{ fontWeight: 600, color: "#1e293b" }}>
                          {account.name}
                        </td>
                        <td>{account.email}</td>
                        <td>
                          <span className={`admin-badge ${account.role === "admin" ? "admin" : "user"}`}>
                            {account.role || "user"}
                          </span>
                        </td>
                        <td>{formattedDate}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
