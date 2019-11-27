// require status codes defined in external file
require('./../http-status/http_status');
const pool = require('./../db-connection/connectionPool');
const HOST = 'localhost';
const PRODUCTS_ENDPOINT = '/api/products';
const regEx = new RegExp('^[0-9]+$');

module.exports = {
    getProducts: function (request, response) {
        let sql = `SELECT * FROM product`;
        pool.getConnection(function (error, connection) {
            if (error) {
                response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                response.send(`${HTTP_STATUS.INTERNAL_SERVER_ERROR}: Internal Server Error, Please Try Again Later`);
            } else {
                console.log(`Connection ${connection.threadId} Started`);
                connection.query(sql, function (error, result) {
                    response.status(HTTP_STATUS.OK);
                    response.json(result);
                });
            }
            connection.release();
        });
    },
    getProductById: function (request, response) {
        // get id from URI
        let productId = request.params.productId;
        if (regEx.test(productId)) {
            let sql = `SELECT * FROM product WHERE product_id = ${productId}`;
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
                            response.json(result);
                        } else {
                            response.status(HTTP_STATUS.NOT_FOUND);
                            response.json({
                                'error': true,
                                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find product with id ${productId} in Path ${HOST+ PRODUCTS_ENDPOINT +request.url}`
                            });
                        }
                    });
                    connection.release();
                }
            });
        } else {
            response.status(HTTP_STATUS.NOT_FOUND);
            response.json({
                'error': true,
                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid product Id in Path ${HOST+ PRODUCTS_ENDPOINT +request.url}`
            });
        }
    },
    getProductByName: function (request, response) {
        // get id from URI
        let productName = request.query.productName;
        let sql = `SELECT * FROM product WHERE product_name = '${productName}'`;
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
                        response.json(result);
                    } else {
                        response.status(HTTP_STATUS.NOT_FOUND);
                        response.json({
                            'error': true,
                            'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find product with name ${productName} in Path ${HOST+ PRODUCTS_ENDPOINT +request.url}`
                        });
                    }
                });
                connection.release();
            }
        });
    }
}