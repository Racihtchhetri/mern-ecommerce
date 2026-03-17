const express = require("express");
const router = express.Router();

const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

router.get("/dashboard", async (req, res) => {
    try {

        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const revenueData = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalRevenue = revenueData.length ? revenueData[0].totalRevenue : 0;

        res.json({
            orders: totalOrders,
            products: totalProducts,
            users: totalUsers,
            revenue: totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;