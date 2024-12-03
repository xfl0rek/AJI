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
        return res.status(400).json({ message: 'Login i hasło są wymagane.' });
    }

    try {
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(401).json({ message: 'Niepoprawne dane logowania.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Niepoprawne dane logowania.' });
        }

        const payload = {
            id: user._id,
            login: user.login,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token ważny przez 1 godzinę
        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Wewnętrzny błąd serwera.' });
    }
});

router.post('/register', async (req, res) => {
    const { login, password, role } = req.body;

    if (!login || !password || !role) {
        return res.status(400).json({ message: 'Login, hasło i rola są wymagane.' });
    }

    try {
        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ message: 'Użytkownik o tym loginie już istnieje.' });
        }

        const newUser = new User({
            login,
            password,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'Użytkownik został zarejestrowany.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Błąd serwera przy rejestracji.' });
    }
});

router.post('/refresh', async (req, res) => {
    const token = req.body.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Brak tokenu.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Użytkownik nie znaleziony.' });
        }

        const newPayload = {
            id: user._id,
            login: user.login,
            role: user.role
        };

        const newToken = jwt.sign(newPayload, JWT_SECRET, { expiresIn: '1h' }); // Nowy token ważny przez 1 godzinę

        res.status(200).json({ token: newToken });
    } catch (error) {
        return res.status(403).json({ message: 'Niepoprawny lub wygasły token.' });
    }
});

module.exports = router;