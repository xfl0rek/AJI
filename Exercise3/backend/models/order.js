const mongoose = require('mongoose');

const OpinionSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
    confirmedDate: { type: Date, default: null },
    status: { type: mongoose.Schema.Types.ObjectId, ref: 'order_status', required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    opinions: [OpinionSchema],
});

module.exports = mongoose.model('order', OrderSchema);
