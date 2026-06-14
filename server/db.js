import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Luôn luôn nạp dotenv để chạy dưới local ngon lành
dotenv.config();

const pool = mysql.createPool({
  // Nếu chạy trên Render, nó sẽ lấy DB_HOST từ Render (thomas.proxy.rlwy.net)
  // Nếu chạy ở local, nó sẽ lấy DB_HOST từ file .env local của bạn (127.0.0.1 hoặc localhost)
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối
pool.getConnection()
  .then(conn => {
    console.log(`==> ĐÃ KẾT NỐI DATABASE THÀNH CÔNG TỚI HOST: ${process.env.DB_HOST} 🎉`);
    conn.release();
  })
  .catch(err => {
    console.error("❌ Lỗi kết nối Database chi tiết:", err.message);
  });

export default pool;