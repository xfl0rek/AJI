const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://admin:adminpassword@mongodb1:27017,mongodb2:27018,mongodb3:27019/sklep', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: "admin",
            replicaSet: 'replica_set_single',
        });
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
