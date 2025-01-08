const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const Groq = require("groq-sdk");
const authMiddleware = require('../config/auth')
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.API_KEY
});

const validateProduct = (product) => {
    if (!product.name || !product.name.trim()) {
        throw new Error('Product name cannot be empty');
    }
    if (!product.description || !product.description.trim()) {
        throw new Error('Product description cannot be empty.');
    }
    if (product.price <= 0) {
        throw new Error('Product price cannot be less than 0');
    }
    if (product.weight <= 0) {
        throw new Error('Product weigh cannot be less than 0');
    }
};

router.get('/', authMiddleware, async (req, res) => {
    const products = await Product.find().populate('category');
    res.json(products);
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { name, description, price, weight, category } = req.body;

    try {
        const newProduct = { name, description, price, weight, category };

        const product = await Product.create(newProduct);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        try {
            validateProduct(req.body);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id/seo-description',authMiddleware, async (req, res) => {
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

router.put('/optimize-description/:id', authMiddleware, async (req, res) => {
    const { description } = req.body;
    
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Optimize the following product description to make it more engaging and SEO-friendly. Provide only the optimized description, without any introduction or explanation, make it short and remember not to add any ": 
            Description: ${description}`
          },
        ],
        model: "llama3-8b-8192"
      });
  
      const optimizedDescription = chatCompletion?.choices[0]?.message?.content;
  
      if (!optimizedDescription) {
        return res.status(500).json({ message: 'Nie udało się zoptymalizować opisu' });
      }
  
      res.status(200).json({ optimizedDescription });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
