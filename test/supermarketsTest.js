const assert = require('assert');
const pool = require('../src/db-connection/connectionPool');
const controller = require('../src/controllers/categoriesController');
const regEx = new RegExp('^[0-9]+$');

describe('Get Supermarket By Id Test', function () {
    it('should return the supermarket object with the matching id from the database', function (done) {
        let supermarketId = 2;
        let errorMessage = null;
        if (regEx.test(supermarketId)) {
            let sql = `SELECT * FROM supermarket WHERE supermarket_id = ${supermarketId}`;
            pool.getConnection(function (error, connection) {
                if (error) {
                    return;
                }
                connection.query(sql, function (error, result) {
                    if (result.length != 0) {
                        assert.equal(result[0].supermarket_id, 2);
                        assert.equal(result[0].supermarket_name, "Amazon Fresh");
                        assert.equal(result[0].supermarket_image, "https://upload.wikimedia.org/wikipedia/commons/a/a3/AmazonFreshWordmark.png");
                        assert.equal(result[0].supermarket_url, "https://www.amazon.co.uk/Amazon-Fresh-UK-Grocery-Shopping/b?ie=UTF8&node=6723205031");
                        done(); 
                    } else {
                        supermarketObj = null;
                    }
                });
                connection.release();
            });
        } else {
            errorMessage = `${HTTP_STATUS.NOT_FOUND}: Invalid Supermarket Id`;
        }


    });
});