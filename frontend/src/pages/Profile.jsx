import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/myorders", {
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          // The response has an 'orders' field containing the array
          setOrders(data.orders || []);
        } else {
          setError(data.message || "Failed to load orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* User Info Card */}
        <div className="user-profile-card">
          <div className="user-avatar-large">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="user-profile-name">{user.name}</h2>
          <p className="user-profile-email">{user.email}</p>
          <div className="user-meta-info">
            <span className="user-role-badge">{user.role} Account</span>
          </div>
        </div>

        {/* Order History Panel */}
        <div className="profile-orders-section">
          <h2 className="section-title">My Orders</h2>
          {loading ? (
            <div className="profile-loading">Loading your order history...</div>
          ) : error ? (
            <div className="profile-error-alert">{error}</div>
          ) : orders.length === 0 ? (
            <div className="no-orders-box">
              <span className="no-orders-icon">📦</span>
              <h3>No Orders Found</h3>
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => navigate("/")} className="btn-shop-now">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="profile-order-card">
                  <div className="order-header">
                    <div className="order-header-main">
                      <span className="order-id-label">Order</span>
                      <span className="order-id-code">#{order._id}</span>
                    </div>
                    <span className={`status-pill ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-meta-grid">
                    <div>
                      <span className="meta-label">Date Placed</span>
                      <span className="meta-value">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="meta-label">Total Amount</span>
                      <span className="meta-value total-amount">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="meta-label">Payment Method</span>
                      <span className="meta-value">{order.paymentMethod || "Bypass"}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="order-items-list">
                    {order.products && order.products.map((item, idx) => (
                      <div key={idx} className="profile-order-item">
                        <div className="item-thumbnail">
                          {item.product?.imageUrl ? (
                            <img src={item.product.imageUrl} alt={item.product.name} />
                          ) : (
                            <div className="item-thumb-placeholder">🎁</div>
                          )}
                        </div>
                        <div className="item-details">
                          <p className="item-title">{item.product?.name || "Product Removed"}</p>
                          <p className="item-qty-price">
                            {item.quantity} x ₹{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="item-total-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.address && (
                    <div className="order-shipping-summary">
                      <span className="shipping-title">Shipped to:</span>
                      <span className="shipping-address">
                        {order.address.fullName}, {order.address.street}, {order.address.city}, {order.address.state} - {order.address.postalCode}, {order.address.country}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
