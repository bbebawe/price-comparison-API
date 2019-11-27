const express = require('express');
const router = express.Router();
const controller = require('./../controllers/supermarketController');

// handel supermarkets end point to get all supermarkets or get supermarket by id 
router.get('/', (req, res) => {
    if (req.query.supermarketName) {
        controller.getSupermarketByName(req, res);
    } else {
        controller.getSupermarkets(req, res);
    }
}); 

// get supermarket by id 
router.get('/:supermarketId', (req, res) => {
    controller.getSupermarketById(req, res);
});

module.exports = router;