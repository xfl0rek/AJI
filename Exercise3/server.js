const app = require('./app');
const express = require('express')
const connectToDatabase = require('./config/database')

connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
