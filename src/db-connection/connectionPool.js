// require mysql module 
var mysql = require("mysql");

//Create a connection object with the user details
var pool = mysql.createPool({
    connectionLimit: 100, 
    host: "localhost",
    user: "root",
    password: "root", 
    database: "price_comparison",
    debug: false
});

// export pool to other modules 
module.exports = pool; 