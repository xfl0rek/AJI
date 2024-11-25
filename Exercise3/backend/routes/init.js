const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Product = require('../models/product');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/init', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file provided. Please upload a JSON file.' });
    }

    try {
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            return res.status(400).json({ message: 'Database already contains products. Initialization aborted.' });
        }

        let products = [];

        if (file.mimetype === 'application/json') {
            const data = JSON.parse(fs.readFileSync(file.path, 'utf-8'));
            products = Array.isArray(data) ? data : [];
        }  else {
            return res.status(400).json({ message: 'Invalid file type. Only JSON files are allowed.' });
        }

        for (const product of products) {
            if (!product.name || !product.description || !product.price || !product.weight || !product.category) {
                return res.status(400).json({ message: 'Invalid product format in the provided file.' });
            }
        }

        await Product.insertMany(products);

        fs.unlinkSync(file.path);

        res.status(200).json({ message: 'Database initialized successfully.', productsAdded: products.length });
    } catch (err) {
        fs.unlinkSync(file.path);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
