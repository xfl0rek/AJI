const express = require('express');
const router = express.Router();
//const cors = require('cors');

const IndexController = require('../controllers/IndexController');
const ProductsContorller = require('../controllers/ProductsController');

//router.all('*', cors());

router.get('/', IndexController.home);

router.get('/products', ProductsContorller.getAll);
router.get('/products/:id', ProductsContorller.getById);
router.post('/products', ProductsContorller.store);
router.put('/products', ProductsContorller.updateById);

module.exports = router;