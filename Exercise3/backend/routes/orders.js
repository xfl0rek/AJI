const express = require('express');
const Order = require('../models/order');
const Product = require('../models/product');
const OrderStatus = require('../models/order_status');
const authMiddleware = require('../config/auth');
const router = express.Router();
const checkRole = require('../config/role');

router.get('/', authMiddleware, checkRole(['PRACOWNIK']), async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('status')
            .populate('items.product');

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { status, username, email, phone, items } = req.body;

    if (!status || !username || !email || !phone || !items || items.length === 0) {
        return res.status(400).json({ message: 'Invalid input. Please provide all required fields.' });
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

        const productExists = await Product.findById(item.product);
        if (!productExists) {
            return res.status(400).json({ message: `Product with ID ${item.product} does not exist.` });
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

router.patch('/:id', authMiddleware, async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required to update the order.' });
    }

    try {
        const statusExists = await OrderStatus.findById(status);
        if (!statusExists) {
            return res.status(400).json({ message: `Status with ID ${status} does not exist.` });
        }

        const order = await Order.findById(req.params.id).populate('status');
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        if (!order.status) {
            order.status = statusExists._id;  // Przypisujemy _id, a nie nazwę
            await order.save();
            return res.json(order);
        }

        const availableStatuses = ['UNCONFIRMED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

        const currentStatusIndex = availableStatuses.indexOf(order.status.name);
        const newStatusIndex = availableStatuses.indexOf(statusExists.name);

        if (newStatusIndex < currentStatusIndex) {
            return res.status(400).json({ message: 'Cannot change the order status backwards.' });
        }

        order.status = statusExists._id;
        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.get('/status/:statusId', authMiddleware, async (req, res) => {
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

router.post('/:id/opinions', authMiddleware, async (req, res) => {
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
            return res.status(400).json({ message: 'Opinion can only be added to orders with status COMPLETED or CANCELLED.' });
        }

        order.opinions.push({ rating, comment });
        await order.save();

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;