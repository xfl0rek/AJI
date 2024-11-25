const mongoose = require('mongoose');
const Category = require('../models/category');
const OrderStatus = require('../models/order_status');
const connectDB = require('../config/db');

const seedDatabase = async () => {
    await connectDB();

    const categories = ['Electronics', 'Books', 'Clothing', 'Toys'];
    for (const name of categories) {
        await Category.create({ name });
    }

    const statuses = ['UNCONFIRMED', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    for (const name of statuses) {
        await OrderStatus.create({ name });
    }

    console.log('Database seeded!');
    process.exit();
};

seedDatabase();
