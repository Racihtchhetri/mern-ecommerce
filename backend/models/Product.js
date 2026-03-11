const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({

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
        default: 0
    },

    price: {
        type: Number
    },

    sku: {
        type: String,
        unique: true
    },

    image: String

}, { _id: false });

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: String,

    brand: String,

    category: {
        type: String,
        required: true
    },

    subCategory: String,

    basePrice: {
        type: Number,
        required: true
    },

    images: {
        main: String,
        hover: String,
        gallery: [String]
    },

    variants: [variantSchema],

    tags: [String],

    totalStock: {
        type: Number,
        default: 0
    },

    rating: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);