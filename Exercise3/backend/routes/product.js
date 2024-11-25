const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
    const products = await Product.find().populate('category');
    res.json(products);
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, description, price, weight, category } = req.body;

    if (!name || !description || price < 0 || weight < 0) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    try {
        const product = await Product.create({ name, description, price, weight, category });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
