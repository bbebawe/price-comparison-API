// require status codes defined in external file
require('./../http-status/http_status');
const pool = require('./../db-connection/connectionPool');
const HOST = 'localhost';
const SUPERMARKET_ENDPOINT = '/api/supermarkets';
const regEx = new RegExp('^[0-9]+$');

module.exports = {
    getSupermarkets: function (request, response) {
        let sql = `SELECT * FROM supermarket`;
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
    getSupermarketById: function (request, response) {
        // get id from URI
        let supermarketId = request.params.supermarketId;
        if (regEx.test(supermarketId)) {
            let sql = `SELECT * FROM supermarket WHERE supermarket_id = ${supermarketId}`;
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
                                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find Supermarket with id ${supermarketId} in Path ${HOST+ SUPERMARKET_ENDPOINT +request.url}`
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
                'message': `Error ${HTTP_STATUS.NOT_FOUND}: Invalid Supermarket Id in Path ${HOST+ SUPERMARKET_ENDPOINT +request.url}`
            });
        }
    },
    getSupermarketByName: function (request, response) {
        // get id from URI
        let supermarketName = request.query.supermarketName;
        let sql = `SELECT * FROM supermarket WHERE supermarket_name = '${supermarketName}'`;
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
                            'message': `Error ${HTTP_STATUS.NOT_FOUND}: Could not find Supermarket with name ${supermarketName} in Path ${HOST+ SUPERMARKET_ENDPOINT +request.url}`
                        });
                    }
                });
                connection.release();
            }
        });
    },
}