import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import '../styles/checkout.css';

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        fullName: '', street: '', city: '', state: '', postalCode: '', country: ''
    });

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePayment = async () => {

        try {
            const orderRes = await fetch('/api/payments/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice })
            });
            if (!orderRes.ok) {
                const fallback = window.confirm("Razorpay keys unconfigured on backend. Use student bypass Mode to place test order?");
                if (fallback) {
                    return bypassPayment();
                }
                else {
                    return alert("Payment failed to initialize");
                }
            }

            const orderData = await orderRes.json()

            const options = {
                key: orderData.key_id || 'rzp_testdummy123',
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'Shopnest',
                description: 'Test transaction',
                order_id: orderData.order.id,
                handler: async function (response) {
                    const verifyRes = await fetch('/api/payments/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
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
                                orderItems: cartItems.map(item => ({
                                    product: item._id,
                                    quantity: item.quantity,
                                    price: item.price
                                })),
                                totalAmount: totalPrice,
                                address,
                                paymentMethod: 'Razorpay',
                                paymentId: response.razorpay_payment_id
                            })
                        })
                        const saveOrderData = await saveOrderRes.json();
                        if (saveOrderRes.ok) {
                            dispatch(clearCart());
                            navigate('/orderSuccess', { state: { orderId: saveOrderData.order?._id, totalAmount: totalPrice } });
                        } else {
                            alert(saveOrderData.message || 'Order saving failed');
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
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalPrice,
                address,
                paymentMethod: 'Bypass',
                paymentId: 'bypass_txn_' + Date.now()
            })
        });
        const saveOrderData = await saveOrderRes.json();
        if (saveOrderRes.ok) {
            dispatch(clearCart());
            navigate('/orderSuccess', { state: { orderId: saveOrderData.order?._id, totalAmount: totalPrice } });
        } else {
            alert(saveOrderData.message || 'Order saving failed');
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login first");
            navigate('/login');
            return;
        }
        if (!address.fullName || !address.street || !address.city || !address.state || !address.postalCode || !address.country) {
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
                                            <p className="item-qty">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="item-price">
                                            ₹{(item.price * item.quantity).toFixed(2)}
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
                                <label htmlFor="state">State *</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={address.state}
                                    onChange={handleAddressChange}
                                    placeholder="Enter state"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
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

