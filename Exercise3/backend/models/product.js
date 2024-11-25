const mongoose = require('mongoose');
const Category = require('./category');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
});

module.exports = mongoose.model('product', ProductSchema);
