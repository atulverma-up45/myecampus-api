import "dotenv/config.js"
import { createPool } from "mysql2/promise.js";


const pool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectToDatabase = async () => {
  try {
    const connection = await pool.getConnection(); 
    console.log("MySQL Connection Successful");
    connection.release(); 
  } catch (error) {
    console.error("Database connection Error", error.message);
    throw error;
  }
};

export { connectToDatabase, pool };
