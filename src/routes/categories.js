// require status codes defined in external file
require('./../http-status/http_status');
const express = require('express');
const router = express.Router();
const controller = require('./../controllers/categoriesController');


// get all categories 
router.get('/', (req, res) => {
    if (req.query.categoryName) {
        controller.getCategoryByName(req, res);
    }
    else {
        controller.getCategories(req, res);
    }
});

// get category by id 
router.get('/:categoryId', (req, res) => {
    controller.getCategoryById(req, res);
});


router.get('/:categoryId/:products', (req, res) => {
    controller.getCategoryProducts(req, res);
});

module.exports = router;