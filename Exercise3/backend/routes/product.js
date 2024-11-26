const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.API_KEY
});

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

    if (!name || !description || price <= 0 || weight <= 0) {
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

router.get('/:id/seo-description', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const input = {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Generate an SEO-friendly HTML description for this product. Provide only the HTML description without any additional explanations or text: 
                    Name: ${input.name}, 
                    Description: ${input.description}, 
                    Price: ${input.price}, 
                    Category: ${input.category}`
                },
            ],
            model: "llama3-8b-8192"
        });

        console.log('Groq API Response:', chatCompletion);

        const seoDescription = chatCompletion?.choices[0]?.message?.content;
        if (!seoDescription) {
            return res.status(500).json({ message: 'Failed to generate SEO description' });
        }

        res.status(200).send(seoDescription);

    } catch(err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;
