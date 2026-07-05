import React from "react";
import { Link, useLocation } from 'react-router-dom';
import '../styles/orderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, totalAmount } = location.state || {};

  return (
    <div className="order-success-container">
      <div className="success-card">
        {/* Animated Checkmark Icon */}
        <div className="success-icon-container">
          <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>

        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-subtitle">
          Thank you for shopping with us. Your order has been successfully placed and is being processed.
        </p>

        {/* Order Details Panel */}
        <div className="success-details-card">
          <div className="details-row">
            <span className="details-label">Order Status</span>
            <span className="status-badge">Processing</span>
          </div>
          
          {orderId && (
            <div className="details-row">
              <span className="details-label">Order ID</span>
              <span className="details-value order-id-value">{orderId}</span>
            </div>
          )}
          
          {totalAmount !== undefined && (
            <div className="details-row">
              <span className="details-label">Total Amount Paid</span>
              <span className="details-value total-amount-value">₹{Number(totalAmount).toFixed(2)}</span>
            </div>
          )}
          
          <div className="email-notification-notice">
            <i className="email-icon">✉</i> A confirmation email with invoice details has been sent to your registered email.
          </div>
        </div>

        {/* Actions */}
        <div className="success-actions">
          <Link to="/" className="btn-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;