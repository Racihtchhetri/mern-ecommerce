const Razorpay = require("razorpay");
const crypto = require("crypto");

const Product = require("../models/Product");
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/*
  FRONTEND will call this to create payment order
*/
exports.createCheckout = async (req, res) => {

  // for now keep it simple (later calculate from cart)
  const amount = 500 * 100; // 500 INR

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: "rcpt_" + Date.now()
  });

  res.json({
    orderId: order.id,
    amount: order.amount,
    key: process.env.RAZORPAY_KEY_ID
  });
};


/*
  Razorpay webhook (real source of truth)
*/
exports.razorpayWebhook = async (req, res) => {

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const receivedSignature = req.headers["x-razorpay-signature"];

  if (expectedSignature !== receivedSignature) {
    return res.status(400).json({ success: false });
  }

  const event = req.body;

  // we care about successful payment
  if (event.event === "payment.captured") {

    const payment = event.payload.payment.entity;

    /*
      IMPORTANT:
      You must attach your cart / items info using:
      notes while creating Razorpay order (later).
      For now we will assume a simple single item example.
    */

    const items = [
      {
        product: payment.notes?.productId,
        size: payment.notes?.size,
        color: payment.notes?.color,
        qty: Number(payment.notes?.qty || 1),
        price: Number(payment.amount / 100)
      }
    ];

    let totalAmount = payment.amount / 100;

    const orderDoc = await Order.create({
      items,
      totalAmount,
      paymentIntentId: payment.id,
      paymentStatus: "paid"
    });

    // reduce stock
    for (const item of items) {

      if (!item.product) continue;

      const product = await Product.findById(item.product);

      if (!product) continue;

      const variant = product.variants.find(v =>
        v.size === item.size && v.color === item.color
      );

      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.qty);
        await product.save();
      }
    }

    return res.json({ received: true });
  }

  res.json({ received: true });
};