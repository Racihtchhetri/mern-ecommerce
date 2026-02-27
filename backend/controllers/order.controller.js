const Order = require("../models/Order");

exports.getMyOrders = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (err) {
        console.error("getMyOrders error:", err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

exports.getOrderById = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);

    } catch (err) {
        console.error("getOrderById error:", err);
        res.status(500).json({ message: "Failed to fetch order" });
    }
};