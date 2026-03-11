const Order = require("../../models/Order");

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to load orders" });
    }
};

exports.getOrderById = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id)
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);

    } catch (err) {
        res.status(500).json({ message: "Failed to load order" });
    }
};

exports.updateOrder = async (req, res) => {
    try {

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: "Failed to update order" });
    }
};

exports.deleteOrder = async (req, res) => {
    try {

        await Order.findByIdAndDelete(req.params.id);

        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order" });
    }
};