const express = require("express");
const bodyParser = require("body-parser");
const pool = require("./db-connection/connectionPool");
const router = express.Router();   
const app = express();
const PORT = 3000;


// app routes 
router.get('/categories', (req, res) => {
    if (req.query.productId) {
        getProductPriceById(req, res);
    } else {
        getAllCategories(req, res);
    }
});

// app routes 
router.get('/categories/:categoryId', (req, res) => {
    getCategoryProducts(req, res);
});




function getAllCategories(request, response) {
    //Select the cereals data using JOIN to convert foreign keys into useful data.
    var sql = "SELECT * FROM category";

    pool.getConnection(function (error, connection) {
        if (error) {
            console.log(`Error Getting Connection ${error}`);
        } else {
            console.log(`Connection ${connection.threadId} Started`);
            connection.query(sql, function (error, result) {
                if (error) {
                    console.log(`Error Querying database ${error}`)
                    response.send("Error Fetching Data");
                } else {
                    response.json(result);
                    connection.release();
                }
            })
        }
    });
}

function getCategoryById(request, response) {
    // get id from URI
    var categoryId = request.params.categoryId;

    //Select the cereals data using JOIN to convert foreign keys into useful data.
    var sql = `SELECT * FROM category WHERE category_id = ${categoryId}`;

    pool.getConnection(function (error, connection) {
        if (error) {
            response.json("Error Connecting to the Database, Please Try Again Later")
        } else {
            console.log(`Connection ${connection.threadId} Started`);
            connection.query(sql, function (error, result) {
                if (error) {
                    console.log(`Error Querying database ${error}`)
                    response.json("Error Fetching Data");
                } else {
                    response.json(result);
                    connection.release();
                }
            })
        }

    });
}

function getCategoryByName(request, response) {
    // get id from URI
    var categoryName = request.query.categoryName;

    //Select the cereals data using JOIN to convert foreign keys into useful data.
    var sql = `SELECT * FROM category WHERE category_name = '${categoryName}'`;

    pool.getConnection(function (error, connection) {
        if (error) {
            response.json("Error Connecting to the Database, Please Try Again Later")
        } else {
            console.log(`Connection ${connection.threadId} Started`);
            connection.query(sql, function (error, result) {
                if (error) {
                    console.log(`Error Querying database ${error}`)
                    response.json("Error Fetching Data");
                } else {
                    response.json(result);
                    connection.release();
                }
            })
        }

    });
}

function getCategoryProducts(request, response) {
    // get id from URI
    var categoryId = request.params.categoryId;
    var sql = `SELECT * FROM product INNER JOIN category ON category.category_id=product.category_id  WHERE product.category_id=${categoryId}`;
    pool.getConnection(function (error, connection) {
        if (error) {
            response.json("Error Connecting to the Database, Please Try Again Later")
        } else {
            console.log(`Connection ${connection.threadId} Started`);
            connection.query(sql, function (error, result) {
                if (error) {
                    console.log(`Error Querying database ${error}`)
                    response.json("Error Fetching Data");
                } else {
                    response.json(result);
                    connection.release();
                }
            })
        }

    });

}


function getProductPriceById(request, response) {
    // get id from URI
    var productId = request.query.productId;

    var sql = `SELECT * FROM product INNER JOIN product_price ON product_price.product_id=product.product_id 
    INNER JOIN supermarket ON supermarket.supermarket_id=product_price.supermarket_id
    WHERE product.product_id=${productId}`;
   
    pool.getConnection(function (error, connection) {
        if (error) {
            response.json("Error Connecting to the Database, Please Try Again Later")
        } else {
            console.log(`Connection ${connection.threadId} Started`);
            connection.query(sql, function (error, result) {
                if (error) {
                    console.log(`Error Querying database ${error}`)
                    response.json("Error Fetching Data");
                } else {
                    response.json(result);
                    connection.release();
                }
            })
        }

    });

}
// middleware 
app.use(bodyParser.json()); // let the app know that we can get json as post data 
app.use(bodyParser.urlencoded({
    extended: true
})); // this will extract data from url 
app.use(express.static('public'));
// register api routes 
app.use('/api', router);

// run the app and start listening on port 
app.listen(PORT, () => {
    console.log(`App is Up and Running on Port ${PORT}`);
});