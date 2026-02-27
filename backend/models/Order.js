const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    size: {
      type: String,
      required: true
    },

    color: {
      type: String,
      required: true
    },

    qty: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentIntentId: {
      type: String,
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: ["placed", "packed", "shipped", "delivered", "cancelled"],
      default: "placed"
    },

    gateway: {
      type: String,
      default: "fake"
    },

    sessionId: {
      type: String
    },

    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);