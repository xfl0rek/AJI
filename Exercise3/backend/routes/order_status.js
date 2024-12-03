const express = require('express');
const orderStatus = require('../models/order_status');
const authMiddleware = require('../config/auth')
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const orderStatuses = await orderStatus.find();
    res.json(orderStatuses);
});

module.exports = router;