// require status codes defined in external file
require('../http-status/http_status');
const pool = require('../db-connection/connectionPool');
const HOST = 'localhost';
const PRICES_ENDPOINT = '/api/products';
const regEx = new RegExp('^[0-9]+$');

// prices controller export object, export database function to other modules.
module.exports = {
    // function gets price by product id.
    getPriceByProductId: function (request, response) {
        // get id from URI
        var productId = request.params.productId;
        var sql = `SELECT product.product_id, product.product_name, product.product_volume, category.category_name, product_price.product_price,
        product_price.price_source, product_price.product_description, product_price.product_image, supermarket.supermarket_image, supermarket.supermarket_name
        FROM product INNER JOIN category ON category.category_id=product.category_id  
        INNER JOIN product_price ON product.product_id=product_price.product_id
        INNER JOIN supermarket ON product_price.supermarket_id = supermarket.supermarket_id 
        WHERE product.product_id=${productId}`;
        // test product id is a number 
        if (regEx.test(productId)) {
            pool.getConnection(function (error, connection) {
                // send error to client if connection to db failed.
                if (error) {
                    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                    response.json({
                        'error': true,
                        'message': `${HTTP_STATUS.INTERNAL_SERVER_ERROR}: Internal Server Error, Please Try Again Later`
                    });
                    return;
                }
                console.log(`Connection ${connection.threadId} Started`);
                // query db
                connection.query(sql, function (error, result) {
                    if (result.length != 0) {
                        response.status(HTTP_STATUS.OK);
                        response.json(result);
                    } else {
                        response.status(HTTP_STATUS.NOT_FOUND);
                        response.json({
                            'error': true,
                            'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find prices for product Id ${productId} in Path ${HOST+ PRICES_ENDPOINT +request.url}`
                        });
                    }
                });
                // release connection
                connection.release();
            });
        } else {
            response.status(HTTP_STATUS.NOT_FOUND);
            response.json({
                'error': true,
                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid Path ${HOST+ PRICES_ENDPOINT +request.url}`
            });
        }
    },
    // function return price set.
    getPricesSet: function (request, response) {
        // get query params.
        let numItems = request.query.num_items;
        let offset = request.query.offset;
        var resultObj = {};
        var sql = `SELECT product.product_id, product.product_name, product.product_volume, category.category_name, product_price.product_price,
        product_price.price_source, product_price.product_description, product_price.product_image, supermarket.supermarket_image, supermarket.supermarket_name
        FROM product INNER JOIN category ON category.category_id=product.category_id  
        INNER JOIN product_price ON product.product_id=product_price.product_id
        INNER JOIN supermarket ON product_price.supermarket_id = supermarket.supermarket_id 
        ORDER BY  product_price.price_id LIMIT ${numItems}`;

        // if offset is not undefined append it to sql query 
        if (offset != undefined) {
            sql += ` OFFSET ${offset}`;
        }
        var numberOfItems;
        // get the count of items in the db
        pool.getConnection(function (error, connection) {
            let sql2 = `SELECT COUNT(*) FROM product_price`;
            connection.query(sql2, function (error, result) {
                numberOfItems = result[0]['COUNT(*)'];
            });
        });
        pool.getConnection(function (error, connection) {
            // send error if failed to get connection
            if (error) {
                response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                response.json({
                    'error': true,
                    'message': `${HTTP_STATUS.INTERNAL_SERVER_ERROR}: Internal Server Error, Please Try Again Later`
                });
                return;
            } else {
                console.log(`Connection ${connection.threadId} Started`);
                connection.query(sql, function (error, result) {
                    if (result.length != 0) {
                        response.status(HTTP_STATUS.OK);
                        resultObj.numberOfItems = numberOfItems;
                        resultObj.result = result;
                        response.json(resultObj);
                    } else {
                        response.status(HTTP_STATUS.NOT_FOUND);
                        response.json({
                            'error': true,
                            'message': `Error ${HTTP_STATUS.NOT_FOUND}: Error in Path ${HOST+ PRODUCTS_ENDPOINT +request.url}`
                        });
                    }
                });
                connection.release();
            }
        });
    },
    // function return all prices in the database. 
    getPrices: function (request, response) {
        var sql = `SELECT product.product_id, product.product_name, product.product_volume, category.category_name, product_price.product_price,
        product_price.price_source, product_price.product_description, product_price.product_image, supermarket.supermarket_image, supermarket.supermarket_name
        FROM product INNER JOIN category ON category.category_id=product.category_id  
        INNER JOIN product_price ON product.product_id=product_price.product_id
        INNER JOIN supermarket ON product_price.supermarket_id = supermarket.supermarket_id`;
        pool.getConnection(function (error, connection) {
            if (error) {
                response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                response.json({
                    'error': true,
                    'message': `${HTTP_STATUS.INTERNAL_SERVER_ERROR}: Internal Server Error, Please Try Again Later`
                });
                return;
            }
            console.log(`Connection ${connection.threadId} Started`);
            connection.query(sql, function (error, result) {
                response.status(HTTP_STATUS.OK);
                response.json(result);
            });
            connection.release();
        });
    },
    // 
    getProductPricesSet: function (request, response) {
        let productId = request.params.productId;
        let numItems = request.query.num_items;
        let offset = request.query.offset;
        var resultObj = {};
        var sql = `SELECT product.product_id, product.product_name, product.product_volume, category.category_name, product_price.product_price,
        product_price.price_source, product_price.product_description, product_price.product_image, supermarket.supermarket_image, supermarket.supermarket_name
        FROM product INNER JOIN category ON category.category_id=product.category_id  
        INNER JOIN product_price ON product.product_id=product_price.product_id
        INNER JOIN supermarket ON product_price.supermarket_id = supermarket.supermarket_id 
        WHERE product.product_id=${productId}
        ORDER BY  product_price.price_id LIMIT ${numItems}`;

        if (offset != undefined) {
            sql += ` OFFSET ${offset}`;
        }
        var numberOfItems;
        pool.getConnection(function (error, connection) {
            let sql2 = `SELECT COUNT(*) FROM product_price WHERE product_price.product_id=${productId}`;
            connection.query(sql2, function (error, result) {
                numberOfItems = result[0]['COUNT(*)'];
            });
        });
        pool.getConnection(function (error, connection) {
            if (error) {
                console.log(error);
                response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                response.json(`Error ${HTTP_STATUS.INTERNAL_SERVER_ERROR} : Internal Server Error, Please Try Again Later`);
            } else {
                console.log(`Connection ${connection.threadId} Started`);
                connection.query(sql, function (error, result) {
                    if (result.length != 0) {
                        response.status(HTTP_STATUS.OK);
                        resultObj.numberOfItems = numberOfItems;
                        resultObj.result = result;
                        response.json(resultObj);
                    } else {
                        response.status(HTTP_STATUS.NOT_FOUND);
                        response.json({
                            'error': true,
                            'message': `Error ${HTTP_STATUS.NOT_FOUND}: Error in Path ${HOST+ PRICES_ENDPOINT +request.url}`
                        });
                    }
                });
                connection.release();
            }
        });
    }
}