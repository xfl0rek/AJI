const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/aji_zad3', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Połączono z bazą danych!');
    } catch (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
