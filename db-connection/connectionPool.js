// require mysql module 
var mysql = require("mysql");

//Create a connection object with the user details
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "price_comparison",
    debug: false
});

module.exports = pool; 