import React, { useSelector, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { AuthCountext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import '../styles/checkout.css';

const Checkout = () => {
    const { user } = useContext(AuthCountext);
    const cartItems = useSelector((state) => state.cart.cartItems);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        fullName: '', street: '', city: '', postalCode: '', country: ''
    });

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const handlePayment = async () => {

        try {
            const orderRes = await fetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice })
            });
            const orderData = await orderRes.json()
            if (!orderRes.ok) {
                const fallback = window.confirm("Razorpay keys unconfigured on backend. Use student bypass Mode to place test order?");
                if (fallback) {
                    return bypassStatement();
                }
                else {
                    return alert("Payment falied to initilaize");
                }
            }

            const options = {
                key: 'rzp_testdummy123',
                amount: 'orderData.amount',
                currency: 'orderData.currency',
                name: 'Shopnest',
                description: 'Test transaction',
                order_id: 'orderData.id',
                handler: async function (response) {
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        body: JSON.stringify(response)
                    });
                    if (verifyRes.ok) {
                        const saveOrderRes = await fetch('/api/orders', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${user.token}`
                            },
                            body: JSON.stringify({
                                items: cartItems,
                                totalAmount: totalPrice,
                                address,
                                paymentId: response.razorpay_payment_id
                            })
                        })
                        if (saveOrderRes.ok) {
                            dispatch(clearCart());
                            navigate('/orderSuccess');
                        } else {
                            alert('Order saving failed');
                        }
                    }
                    else {
                        alert('Payment verification failed')
                    }
                },
                prefill: {
                    name: address.fullName,
                    email: user?.email,
                    contact: '9999999999'
                },
            }
            const rzpl = new window.Razorpay(options)
            rzpl.open();
        }
        catch (error) {
            console.log(error)
        }
    };

    const bypassPayment = async () => {
        const saveOrderRes = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                items: cartItems,
                totalAmount: totalPrice,
                address,
                paymentId: 'bypass_txn_' + Date.now()
            })
        });
        if (saveOrderRes.ok) {
            dispatch(clearCart());
            navigate('/orderSuccess');
        } else {
            alert('Order saving failed');
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login first");
            navigate('/login');
            return;
        }
        if (!address.fullName || !address.street || !address.city || !address.postalCode || !address.country) {
            alert("Please fill in all address fields");
            return;
        }
        handlePayment();
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="checkout-container">
            <div className="checkout-wrapper">
                {/* Order Summary */}
                <div className="checkout-section">
                    <h2>Order Summary</h2>
                    <div className="cart-items-summary">
                        {cartItems && cartItems.length > 0 ? (
                            <>
                                {cartItems.map(item => (
                                    <div key={item._id} className="summary-item">
                                        <div className="item-details">
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-qty">Qty: {item.qty}</p>
                                        </div>
                                        <div className="item-price">
                                            ₹{(item.price * item.qty).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                <div className="summary-total">
                                    <span>Total Amount:</span>
                                    <span className="total-price">₹{totalPrice.toFixed(2)}</span>
                                </div>
                            </>
                        ) : (
                            <p className="empty-cart">Your cart is empty</p>
                        )}
                    </div>
                </div>

                {/* Shipping Address Form */}
                <div className="checkout-section">
                    <h2>Shipping Address</h2>
                    <form onSubmit={handleSubmit} className="address-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name *</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={address.fullName}
                                onChange={handleAddressChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="street">Street Address *</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={address.street}
                                onChange={handleAddressChange}
                                placeholder="Enter street address"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City *</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={address.city}
                                    onChange={handleAddressChange}
                                    placeholder="Enter city"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="postalCode">Postal Code *</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={address.postalCode}
                                    onChange={handleAddressChange}
                                    placeholder="Enter postal code"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">Country *</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={address.country}
                                onChange={handleAddressChange}
                                placeholder="Enter country"
                                required
                            />
                        </div>

                        <button type="submit" className="checkout-btn">
                            Proceed to Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Checkout

