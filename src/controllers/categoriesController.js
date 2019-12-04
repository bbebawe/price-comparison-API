// require status codes defined in external file
require('./../http-status/http_status');
const pool = require('./../db-connection/connectionPool');
const HOST = 'localhost';
const CATEGORIES_ENDPOINT = '/api/categories';
const regEx = new RegExp('^[0-9]+$');

// categories controller export object, export database function to other modules.
module.exports = {
    // function return all categories in the database. 
    getCategories: function (request, response) {
        let sql = `SELECT * FROM category`;
        pool.getConnection(function (error, connection) {
            // if error to get db connection send error code to client and return. 
            if (error) {
                response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                response.json({
                    'error': true,
                    'message': `${HTTP_STATUS.INTERNAL_SERVER_ERROR}: Internal Server Error, Please Try Again Later`
                });
                return;
            }
            console.log(`Connection ${connection.threadId} Started`);
            // query db.
            connection.query(sql, function (error, result) {
                response.status(HTTP_STATUS.OK);
                response.json(result);
            });
            // release connection.
            connection.release();
        });
    },
    // function return category that matches query id from the database.
    getCategoryById: function (request, response) {
        // get id from URI
        let categoryId = request.params.categoryId;
        // validate the request id is a number 
        if (regEx.test(categoryId)) {
            let sql = `SELECT * FROM category WHERE category_id = ${categoryId}`;
            // get db connection
            pool.getConnection(function (error, connection) {
                // send error to client if failed to get db connection.
                if (error) {
                    response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                    response.json({
                        'error': true,
                        'message': `Error ${HTTP_STATUS.INTERNAL_SERVER_ERROR} : Internal Server Error, Please Try Again Later`
                    });
                    return;
                }
                console.log(`Connection ${connection.threadId} Started`);
                // query db 
                connection.query(sql, function (error, result) {
                    // if result found send it to client else send not fount error.
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
                // release db connection back to pool.
                connection.release();
            });
        } else {
            response.status(HTTP_STATUS.NOT_FOUND);
            response.json({
                'error': true,
                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid Category Id in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
            });
        }
    },
    // function return category that matches category name.  
    getCategoryByName: function (request, response) {
        // get name from URI
        let categoryName = request.query.category_name;
        let sql = `SELECT * FROM category WHERE category_name LIKE'%${categoryName}%'`;
        // get db connection from pool
        pool.getConnection(function (error, connection) {
            // send error to client if failed to get connection from pool.
            if (error) {
                response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                response.json({
                    'error': true,
                    'message': `Error ${HTTP_STATUS.INTERNAL_SERVER_ERROR} : Internal Server Error, Please Try Again Later`
                });
                return;
            }
            console.log(`Connection ${connection.threadId} Started`);
            // query db. 
            connection.query(sql, function (error, result) {
                // if result found sent it to client else send not found code.
                if (result.length != 0) {
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
            // release connection back to pool.
            connection.release();
        });
    },
    // function return all products in the requested category.
    getCategoryProducts: function (request, response) {
        // get URI params
        let categoryId = request.params.categoryId;
        let products = request.params.products;
        // validate category id is a number 
        if (regEx.test(categoryId)) {
            // validate second parm is products 
            if (products == 'products') {
                let sql = `SELECT * FROM product INNER JOIN category ON category.category_id=product.category_id  WHERE product.category_id=${categoryId}`;
                // get db connection from pool
                pool.getConnection(function (error, connection) {
                    if (error) {
                        response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                        response.json({
                            'error': true,
                            'message': `Error ${HTTP_STATUS.INTERNAL_SERVER_ERROR} : Internal Server Error, Please Try Again Later`
                        });
                        return;
                    }
                    console.log(`Connection ${connection.threadId} Started`);
                    // query db. 
                    connection.query(sql, function (error, result) {
                        if (result.length != 0) {
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
                    // release connection back to pool.
                    connection.release();
                });
            } else {
                response.status(HTTP_STATUS.NOT_FOUND);
                response.json({
                    'error': true,
                    'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
                });
            }
        } else {
            response.status(HTTP_STATUS.NOT_FOUND);
            response.json({
                'error': true,
                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid Category Id in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
            });
        }
    },
    // function query the database to return category set that matches the query params. 
    queryCategories: function (request, response) {
        // get search term fro URI
        let searchTerm = request.query.search_term;
        let sql = `SELECT * FROM category WHERE category_name LIKE '%${searchTerm}%'`;
        // get connection from poo;
        pool.getConnection(function (error, connection) {
            // if failed send fail code to client.
            if (error) {
                response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
                response.json({
                    'error': true,
                    'message': `${HTTP_STATUS.INTERNAL_SERVER_ERROR}: Internal Server Error, Please Try Again Later`
                });
                return;
            }
            console.log(`Connection ${connection.threadId} Started`);
            // query db.
            connection.query(sql, function (error, result) {
                if (result.length != 0) {
                    response.status(HTTP_STATUS.OK);
                    response.json(result);
                } else {
                    response.status(HTTP_STATUS.NOT_FOUND);
                    response.json({
                        'error': true,
                        'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find Category with name ${searchTerm} in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
                    });
                }
            });
            // release connection 
            connection.release();
        });
    },
    // function return certain number of categories as set. 
    getCategorySet: function (request, response) {
        // get URI params.
        let numItems = request.query.num_items;
        let offset = request.query.offset;
        var resultObj = {};
        let sql = `SELECT * FROM category ORDER BY category_id LIMIT ${numItems}`;
        // if params has offset, append it to sql query
        if (offset != undefined) {
            sql += ` OFFSET ${offset}`;
        }
        var numberOfItems;
        // get connection pool.
        pool.getConnection(function (error, connection) {
            let sql2 = `SELECT COUNT(*) FROM category`;
            connection.query(sql2, function (error, result) {
                numberOfItems = result[0]['COUNT(*)'];
            });
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
                        'message': `Error ${HTTP_STATUS.NOT_FOUND}: Error in Path ${HOST+ CATEGORIES_ENDPOINT +request.url}`
                    });
                }
            });
            connection.release();
        });
    }
}