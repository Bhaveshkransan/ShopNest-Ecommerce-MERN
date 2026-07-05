import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/admin.css";

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Authenticate admin access
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Sort orders by date descending
        const sortedOrders = (data.orders || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } else {
        alert(data.message || "Failed to load orders.");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert("Order status updated successfully!");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Something went wrong while updating order status.");
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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
          <h1 className="admin-page-title">Manage Customer Orders</h1>
        </div>

        {loading ? (
          <div className="profile-loading">Loading transaction records...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date Placed</th>
                  <th>Total Amount</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#6b7280" }}>
                      No customer orders found in the database.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const isExpanded = expandedOrderId === order._id;
                    const dateObj = new Date(order.createdAt);
                    const formattedDate = dateObj.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <React.Fragment key={order._id}>
                        {/* Summary Order Row */}
                        <tr>
                          <td style={{ fontWeight: 600, color: "#4f46e5" }}>
                            #{order._id.substring(0, 12)}...
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{order.user?.name || "Deleted User"}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                              {order.user?.email || "N/A"}
                            </div>
                          </td>
                          <td>{formattedDate}</td>
                          <td style={{ fontWeight: 700, color: "#10b981" }}>
                            ₹{order.totalAmount.toFixed(2)}
                          </td>
                          <td style={{ textTransform: "capitalize" }}>
                            {order.paymentMethod || "Razorpay"}
                          </td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`status-select ${order.status.toLowerCase()}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() => toggleExpandOrder(order._id)}
                              className="btn-admin-edit"
                              style={{ width: "90px" }}
                            >
                              {isExpanded ? "Hide items" : "View items"}
                            </button>
                          </td>
                        </tr>

                        {/* Collapsible Details Row */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="7" style={{ backgroundColor: "#f8fafc", padding: "20px 30px" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {/* Shipping Address details */}
                                <div>
                                  <h4 style={{ fontSize: "14px", color: "#1e293b", marginBottom: "5px" }}>
                                    Shipping Details:
                                  </h4>
                                  <p style={{ fontSize: "13px", color: "#475569" }}>
                                    <strong>Address:</strong> {order.address.street}, {order.address.city},{" "}
                                    {order.address.state}, {order.address.postalCode}, {order.address.country}
                                  </p>
                                  <p style={{ fontSize: "13px", color: "#475569" }}>
                                    <strong>Transaction ID:</strong> {order.paymentId || "N/A"}
                                  </p>
                                </div>

                                {/* Order items list */}
                                <div>
                                  <h4 style={{ fontSize: "14px", color: "#1e293b", marginBottom: "8px" }}>
                                    Ordered Items:
                                  </h4>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {order.products &&
                                      order.products.map((item, idx) => (
                                        <div
                                          key={idx}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "15px",
                                            background: "white",
                                            padding: "10px 15px",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                          }}
                                        >
                                          <img
                                            src={item.product?.imageUrl}
                                            alt={item.product?.name}
                                            style={{
                                              width: "40px",
                                              height: "40px",
                                              objectFit: "cover",
                                              borderRadius: "4px",
                                            }}
                                          />
                                          <div style={{ flex: 1 }}>
                                            <span style={{ fontWeight: 600, color: "#1e293b" }}>
                                              {item.product?.name || "Product Removed"}
                                            </span>
                                            <span style={{ marginLeft: "15px", color: "#64748b" }}>
                                              Qty: {item.quantity}
                                            </span>
                                          </div>
                                          <div style={{ fontWeight: 600, color: "#475569" }}>
                                            ₹{item.price.toFixed(2)} each
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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

export default AdminOrders;
