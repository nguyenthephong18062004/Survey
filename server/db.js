import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0

});
pool.getConnection()
  .then(conn => {
    console.log("==> ĐÃ KẾT NỐI DATABASE RAILWAY THÀNH CÔNG! 🎉");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Lỗi kết nối DB chi tiết tại đây:", err.message);
  });
export default pool;
