const express = require('express');
const Order = require('../models/order');
const OrderStatus = require('../models/order_status');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('status')
            .populate('items.product');

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { status, username, email, phone, items } = req.body;

    if (!status || !username || !email || !phone || !items || items.length === 0) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Phone number must contain only digits.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    for (const item of items) {
        if (item.quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0.' });
        }
    }

    try {
        const newOrder = new Order({
            status,
            username,
            email,
            phone,
            items,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required to update' });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/status/:statusId', async (req, res) => {
    try {
        const orders = await Order.find({ status: req.params.statusId })
            .populate('status')
            .populate('items.product');

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found with this status' });
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/opinions', async (req, res) => {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5 || !comment) {
        return res.status(400).json({ message: 'Invalid input. Rating must be between 1-5 and comment is required.' });
    }

    try {
        const order = await Order.findById(req.params.id).populate('status');

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        const statusName = order.status.name;
        if (statusName !== 'COMPLETED' && statusName !== 'CANCELLED') {
            return res.status(400).json({ message: 'Opinion can only be added to orders with status ZREALIZOWANE or ANULOWANE.' });
        }

        order.opinions.push({ rating, comment });
        await order.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
