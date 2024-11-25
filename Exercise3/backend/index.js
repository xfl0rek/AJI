const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product');

const app = express();

app.use(bodyParser.json());
app.use('/api/products', productRoutes);

connectDB();

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
