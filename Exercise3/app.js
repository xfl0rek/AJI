const express = require('express');
//const productRoutes = require('./routes/productRoutes');
//const categoryRoutes = require('./routes/categoryRoutes');
//const orderRoutes = require('./routes/orderRoutes');

const app = express();

//app.use(express.json());
//app.use('/products', productRoutes);
//app.use('/categories', categoryRoutes);
//app.use('/orders', orderRoutes);

//app.use((err, req, res, next) => {
//    res.status(err.status || 500).json({ error: err.message });
//});

module.exports = app;