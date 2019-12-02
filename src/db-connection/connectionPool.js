// require mysql module 
var mysql = require("mysql");

//Create a connection object with the user details
var pool = mysql.createPool({
    connectionLimit: 100,
    host: "localhost",
    user: "root",
    password: "root", // change back to root 
    database: "price_comparison",
    debug: false
});

module.exports = pool; 