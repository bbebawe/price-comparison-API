// require status codes defined in external file
require('../http-status/http_status');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricesController');

// get all products 
router.get('/', (req, res) => {
    if (req.query.productName) {
        controller.getProductByName(req, res);
    } else if (req.query.num_items) {
        controller.getPricesSet(req, res);
    } else {
        controller.getPrices(req, res);
    }
});

// get category by id 
router.get('/:productId', (req, res) => {
    if (req.query.num_items) {
        controller.getProductPricesSet(req, res);
    } else {
        controller.getPriceByProductId(req, res);
    }
});

module.exports = router;