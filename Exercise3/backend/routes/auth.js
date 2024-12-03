const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'Login and password are required' });
    }

    try {
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(401).json({ message: 'Incorrect login details.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect login details.' });
        }

        const payload = {
            id: user._id,
            login: user.login,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 300 });
        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    const { login, password, role } = req.body;

    if (!login || !password || !role) {
        return res.status(400).json({ message: 'Login, password and role are required' });
    }

    try {
        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this login exist' });
        }

        const newUser = new User({
            login,
            password,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User has been registered' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error with registration' });
    }
});

router.post('/refresh', async (req, res) => {
    const token = req.body.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        const newPayload = {
            id: user._id,
            login: user.login,
            role: user.role
        };

        const newToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: 300 });

        res.status(200).json({ token: newToken });
    } catch (error) {
        return res.status(403).json({ message: 'Incorrect or expired token' });
    }
});

module.exports = router;