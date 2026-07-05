const Order = require("../model/Order");

const sendEmail = require("../utils/sendEmail");

const createOrder = async (req, res) => {
    try {
        const { orderItems, paymentMethod, address, totalAmount } = req.body;
        if (!orderItems || orderItems.length === 0 || !totalAmount || !address || !paymentMethod) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }
        else {
            const order = new Order({
                user: req.user._id,
                products: orderItems,
                totalAmount: totalAmount,
                address: address,
                paymentMethod: paymentMethod,
                paymentId: req.body.paymentId || null
            });
            await order.save();
            const shippingAddress = `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
            const message = `Your order has been placed successfully. Order ID: ${order._id}. Total Amount: ${totalAmount}. Payment Method: ${paymentMethod} and Payment ID: ${order.paymentId}. Shipping Address: ${shippingAddress}. Thank you for shopping with us!`;
            try {
                await sendEmail(req.user.email, "Order Confirmation", message);
            } catch (emailErr) {
                console.error("Order confirmation email failed to send:", emailErr.message);
            }
            res.status(201).json({ message: "Order created successfully", order });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("products.product", "name price imageUrl");
        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product", "name price imageUrl");
        res.status(200).json({ orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;
        await order.save();
        res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus };
