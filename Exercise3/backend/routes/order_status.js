const express = require('express');
const orderStatus = require('../models/order_status');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderStatuses = await orderStatus.find();
    res.json(orderStatuses);
});

module.exports = router;