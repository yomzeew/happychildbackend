// const mysql = require('mysql2');
// const pool = mysql.createPool({
//   host: 'localhost', 
//   user: 'root',   
//   password: '', 
//   database: 'happychild' 
// });

// module.exports = pool.promise();

const mysql = require('mysql2');
const cron=require('node-cron');

const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,   
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 100 // Allow up to 100 queries to wait
});
let isRunning = false;

cron.schedule("0 0 * * *", async () => {
  if (isRunning) return;
  isRunning = true;

  console.log("Running daily table drop...");

  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool
    await connection.query("DROP TABLE IF EXISTS available_hours");
    console.log("Table dropped successfully");
  } catch (error) {
    console.error("Error dropping table:", error);
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
    isRunning = false; // Reset flag for the next run
  }
});
module.exports = pool.promise();

