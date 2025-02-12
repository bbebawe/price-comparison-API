// require https status code 
require('./src/http-status/http_status');
// require node modules 
const express = require('express');
const bodyParser = require('body-parser');
const supermarketRoutes = require('./src/routes/supermarkets');
const categoriesRoutes = require('./src/routes/categories');
const productsRoutes = require('./src/routes/products');
const pricesRoutes = require('./src/routes/prices');
// create app that is instance of express  
const app = express();
const PORT = 3000;
const HOST = 'localhost';
// REST api endpoints 
const SUPERMARKETS_ENDPOINT = '/api/supermarkets';
const CATEGORIES_ENDPOINT = '/api/categories';
const PRODUCTS_ENDPOINT = '/api/products';
const PRICES_ENDPOINT = '/api/prices';


// add app middleware 
// this will extract data from url 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); // use json data
// adjust response header to allow Access-Control-Allow-Origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next(); 
}); 
// serve static html 
app.use(express.static('public'));

// handel supermarket endpoint requests 
app.use(SUPERMARKETS_ENDPOINT, supermarketRoutes);

// handel categories endpoint requests 
app.use(CATEGORIES_ENDPOINT, categoriesRoutes);

// handel products endpoint requests 
app.use(PRODUCTS_ENDPOINT, productsRoutes);

// handel prices endpoint requests 
app.use(PRICES_ENDPOINT, pricesRoutes);

// error handler 
app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND);
    res.send(`${HTTP_STATUS.NOT_FOUND}: Path ${HOST + req.url} Not Found.`);
});

// run the app and start listening on port 3000
app.listen(PORT, () => {
    console.log(`App is Up and Running on Port ${PORT}`);
});