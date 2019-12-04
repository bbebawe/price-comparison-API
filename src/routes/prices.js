// require status codes defined in external file
require('../http-status/http_status');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricesController');

/*
 * router handles all get requests made to api endpoint '/api/prices'.
 * the router will call different database function based on the queries found in the requested URI.
 */
router.get('/', (req, res) => {
   if (req.query.num_items) {
        // if URI has query mum_items call getPricesSet function to return product price set from the database.  
        controller.getPricesSet(req, res);
    } else {
        // if URI has no query parameters call getPrices to return all prices from the database. 
        controller.getPrices(req, res);
    }
});


/*
 * router handles all get requests made to api endpoint '/api/prices'.
 * the router calls different function based on the params in the requested URI.
 */
router.get('/:productId', (req, res) => {
    if (req.query.num_items) {
        // if requested URI has id params and num_items, call getProductPricesSet to query database and return price set.
        controller.getProductPricesSet(req, res);
    } else {
        // if requested URI has id params, call getPriceByProductId to query database with product id. 
        controller.getPriceByProductId(req, res);
    }
});

// export router to other modules.
module.exports = router;