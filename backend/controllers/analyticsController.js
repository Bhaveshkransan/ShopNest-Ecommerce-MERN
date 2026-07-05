const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");

const getAdmin = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});
      
        const orders = await Order.find({});

        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getAdmin };