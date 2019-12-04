// require status codes defined in external file
require('./../http-status/http_status');
const express = require('express');
const router = express.Router();
// require categoriesController module which contains database functions 
const controller = require('./../controllers/categoriesController');

/*
 * router handles all get requests made to api endpoint '/api/supermarkets'.
 * the router will call different database function based on the queries found in the requested URI.
 */
router.get('/', (req, res) => {
    if (req.query.category_name) {
        // if URI has query category_name call getCategoryByName function to get category by name from the database. 
        controller.getCategoryByName(req, res);
    } else if (req.query.num_items) {
        // if URI has query mum_items call getCategorySet function to return category set from the database.  
        controller.getCategorySet(req, res);
    } else if (req.query.search_term) {
        // if URI has query search_term call queryCategories function to return category set that matches the query search.
        controller.queryCategories(req, res);
    } else {
        // if URI has no query parameters call getCategories to return all categories from the database. 
        controller.getCategories(req, res);
    }
});

/*
 * router handles all get requests made to api endpoint '/api/supermarkets'.
 * the router calls different function based on the params in the requested URI.
*/
router.get('/:categoryId', (req, res) => {
    // if requested URI has id params, call getCategoryById to query database with category id. 
    controller.getCategoryById(req, res);
});

    // if requested URI has id params and products, call getCategoryProducts to return all products in the category.
router.get('/:categoryId/:products', (req, res) => {
    controller.getCategoryProducts(req, res);
});

// export router to other modules.
module.exports = router;