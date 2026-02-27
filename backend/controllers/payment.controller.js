const crypto = require("crypto");
const Product = require("../models/Product");
const Order = require("../models/Order");

// In-memory session store
const sessions = new Map();

/**
 * CREATE CHECKOUT SESSION
 * POST /api/payment/checkout
 */
exports.createCheckout = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let totalAmount = 0;

    for (const item of items) {
      if (!item.product || !item.size || !item.color || !item.qty || !item.price) {
        return res.status(400).json({ message: "Invalid item format" });
      }
      totalAmount += item.price * item.qty;
    }

    const sessionId = crypto.randomUUID();

    sessions.set(sessionId, {
      items,
      totalAmount,
      user: req.user._id, // attach logged-in user
      createdAt: Date.now()
    });

    res.json({
      sessionId,
      amount: totalAmount,
      payUrl: `http://localhost:5000/api/payment/pay/${sessionId}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout failed" });
  }
};

/**
 * FAKE WEBHOOK (called directly)
 */
exports.fakeWebhook = async (payload) => {
  try {
    const { items, totalAmount, paymentId, sessionId, user } = payload.data;

    if (!user) {
      console.log("Cannot create order: user is undefined");
      return null;
    }

    // prevent duplicate orders
    const alreadyExists = await Order.findOne({ paymentIntentId: paymentId });
    if (alreadyExists) return alreadyExists;

    // create order
    const order = await Order.create({
      items,
      user, // must be valid ObjectId
      totalAmount,
      paymentIntentId: paymentId,
      paymentStatus: "paid",
      gateway: "fake",
      sessionId
    });

    // deduct stock for each item
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      const variant = product.variants.find(
        v => v.size === item.size && v.color === item.color
      );
      if (!variant) continue;
      if (variant.stock < item.qty) continue;

      variant.stock -= item.qty;
      await product.save();
    }

    // remove session
    sessions.delete(sessionId);

    return order;

  } catch (err) {
    console.error("Webhook error:", err);
    return null;
  }
};

/**
 * FAKE PAYMENT
 * POST /api/payment/pay/:sessionId
 */
exports.fakePay = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Invalid session" });
    }

    const payload = {
      event: "payment.success",
      data: {
        sessionId,
        paymentId: "fake_pay_" + Date.now(),
        items: session.items,
        totalAmount: session.totalAmount,
        user: session.user // this is req.user._id from checkout
      }
    };

    // call webhook directly (no HTTP fetch)
    const order = await exports.fakeWebhook(payload);

    if (!order) {
      return res.status(500).json({ message: "Failed to create order" });
    }

    res.json({ message: "Payment simulated successfully", order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fake payment failed" });
  }
};