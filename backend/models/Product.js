const mongoose = require("mongoose");

const varientSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
    }
}, { _id: false});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    discription: String,

    category: {
        type: String,
        enum: ["men", "women", "kids"],
        required: true
    },

    subCategory: {
        type: String
    },

    basePrice: {
        type: Number,
        required: true
    },

    images: [String],

    variants: [varientSchema],

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);