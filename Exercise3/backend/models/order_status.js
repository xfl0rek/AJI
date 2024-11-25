const mongoose = require('mongoose');

const OrderStatusSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('order_status', OrderStatusSchema);
