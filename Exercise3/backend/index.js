const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./config/auth');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/categories');
const orderStatusRoutes = require('./routes/order_status');
const ordersRoutes = require('./routes/orders');
const init = require('./routes/init');
const userRoutes = require('./routes/user');

const app = express();

const cors = require('cors');


const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/statuses', authMiddleware, orderStatusRoutes);
app.use('/api/orders', authMiddleware, ordersRoutes);
app.use('/api', authMiddleware, init);
app.use('/api/users', authMiddleware, userRoutes);

// app.use('/api/auth');
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/statuses',  orderStatusRoutes);
// app.use('/api/orders', ordersRoutes);
// app.use('/api', init);

connectDB();

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
