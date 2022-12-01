var mysql = require("mysql");

// connection configurations
var dbConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "migration",  
});
// connect to database
module.exports = dbConn;
