const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');

exports.getAll = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    const { userName, email, phone, products } = req.body;

    if (!userName || !email || !phone || !Array.isArray(products) || products.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid order data' });
    }

    try {
        const productIds = products.map((p) => p.productId);
        const dbProducts = await Product.getAll();
        const validProductIds = dbProducts.map((p) => p.id);

        const invalidIds = productIds.filter((id) => !validProductIds.includes(id));
        if (invalidIds.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid product IDs', invalidIds });
        }

        const order = await Order.create({ userName, email, phone, products });
        res.status(StatusCodes.CREATED).json(order);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.getById(id);
        if (!order) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Order not found' });
        }

        const currentStatus = order.get('status');
        if (currentStatus === 'CANCELLED' || (currentStatus === 'DELIVERED' && status !== currentStatus)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid status change' });
        }

        const updatedOrder = await Order.updateStatus(id, status);
        res.json(updatedOrder);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
