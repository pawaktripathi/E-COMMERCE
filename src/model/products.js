const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    deleted_at: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
    },
    image: {
        type: String,
        required: true,
    },
    rating: {
        rate: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
},
    {
        timestamps: true,
        versionKey: false,
    });

productSchema.index({ title: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
