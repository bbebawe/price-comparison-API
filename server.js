const express = require("express");
// used to parse data from url and request body
var bodyParser = require("body-parser");
const pool = require("./db-connection/connectionPool");
const PORT = 3000;
// create app instance 
const app = express();

// middleware 
app.use(bodyParser.json()); // let the app know that we can get json as post data 
app.use(bodyParser.urlencoded({
    extended: true
})); // this will extract data from url 

app.get('/', function (request, response) {
    console.log(request.body)
    response.send("Server Says hi");
    response.end();
});

app.get('/categories', getAllCategories);

function getAllCategories(request, response) {
    var resultObj = {};
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
                    response.end();
                    connection.release();
                }
            })
        }
        return resultObj;
    });
}


// run the app and start listening on port 
app.listen(PORT, () => {
    console.log(`App is Up and Running on Port ${PORT}`);
});