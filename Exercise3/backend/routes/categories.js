const express = require('express');
const Categories = require('../models/category');
const router = express.Router();
const authMiddleware = require('../config/auth')


// router.get('/', authMiddleware, async (req, res) => {
router.get('/', async (req, res) => {
    const categories = await Categories.find();
    res.json(categories);
});

module.exports = router;