
// const mysql = require('mysql2');
// const pool = mysql.createPool({
//   host: 'localhost', 
//   user: 'root',   
//   password: '', 
//   database: 'happychild' 
// });

// module.exports = pool.promise();

const mysql = require('mysql2');
const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,   
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE 
});

module.exports = pool.promise();

