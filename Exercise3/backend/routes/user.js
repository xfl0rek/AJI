const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authMiddleware = require('../config/auth');
const router = express.Router();
require('dotenv').config();

router.get('/', authMiddleware, async (req, res) => {
    const users = await User.find().populate('role');
    res.json(users);
})

router.get('/:login', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ login: req.params.login }).populate('role'); // Użyj username
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;