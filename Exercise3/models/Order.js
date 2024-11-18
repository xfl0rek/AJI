const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    confirmedAt: {
        type: Date,
        default: null,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderStatus',
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\+?[0-9]{10,15}$/, // Numer telefonu w formacie międzynarodowym
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    }],
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
