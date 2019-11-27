// require status codes defined in external file
require('./../http-status/http_status');
const pool = require('./../db-connection/connectionPool');
const HOST = 'localhost';
const CATEGORIES_ENDPOINT = '/api/categories';
const regEx = new RegExp('^[0-9]+$');

module.exports = {
    getCategories: function (request, response) {
        let sql = "SELECT * FROM category";
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
                connection.release();
            }
        });
    },
    getCategoryById: function (request, response) {
        // get id from URI
        let categoryId = request.params.categoryId;
        if (regEx.test(categoryId)) {
            let sql = `SELECT * FROM category WHERE category_id = ${categoryId}`;
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
                                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find Category with id ${categoryId} in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
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
                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid Category Id in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
            });
        }
    },
    getCategoryByName: function (request, response) {
        // get name from URI
        let categoryName = request.query.categoryName;
   
        let sql = `SELECT * FROM category WHERE category_name = '${categoryName}'`;

        pool.getConnection(function (error, connection) {
            if (error) {
                console.log(error);
                response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                response.json(`Error ${HTTP_STATUS.INTERNAL_SERVER_ERROR} : Internal Server Error, Please Try Again Later`);
            } else {
                console.log(`Connection ${connection.threadId} Started`);
                connection.query(sql, function (error, result) {
                    if(result.length != 0) {
                        response.status(HTTP_STATUS.OK);
                        response.json(result);
                    } else {
                        response.status(HTTP_STATUS.NOT_FOUND);
                        response.json({
                            'error': true,
                            'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find Category with name ${categoryName} in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
                        });
                    }
                }); 
                connection.release();
            }
        });
    }, 
    getCategoryProducts: function(request, response) {

        let categoryId = request.params.categoryId;
        let products = request.params.products;
        if (regEx.test(categoryId)) {
            if(products == 'products') {
                let sql = `SELECT * FROM product INNER JOIN category ON category.category_id=product.category_id  WHERE product.category_id=${categoryId}`;
                pool.getConnection(function (error, connection) {
                    if (error) {
                        console.log(error);
                        response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                        response.json(`Error ${HTTP_STATUS.INTERNAL_SERVER_ERROR} : Internal Server Error, Please Try Again Later`);
                    } else {
                        console.log(`Connection ${connection.threadId} Started`);
                        connection.query(sql, function (error, result) {
                            if(result.length != 0) {
                                response.status(HTTP_STATUS.OK);
                                response.json(result);
                            } else {
                                response.status(HTTP_STATUS.NOT_FOUND);
                                response.json({
                                    'error': true,
                                    'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find Products with in Category Id ${categoryId} in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
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
                    'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
                });
            }
        }else {
            response.status(HTTP_STATUS.NOT_FOUND);
            response.json({
                'error': true,
                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid Category Id in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
            });
        }
    }
}