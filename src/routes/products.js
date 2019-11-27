// require status codes defined in external file
require('./../http-status/http_status');
const express = require('express');
const router = express.Router();
const controller = require('./../controllers/productsController');

// get all products 
router.get('/', (req, res) => {
    if (req.query.productName) {
        controller.getProductByName(req, res);
    } else {
        controller.getProducts(req, res);
    }
});


// get category by id 
router.get('/:productId', (req, res) => {
    controller.getProductById(req, res);
});

module.exports = router;