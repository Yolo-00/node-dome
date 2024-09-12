import mysql from "mysql2";

// 创建连接池
const db = mysql.createPool({
  host: "localhost", // MySQL 服务器地址，通常是 localhost
  user: "root", // MySQL 用户名
  password: "root", // MySQL 密码
  database: "test", // 要连接的数据库名称
  waitForConnections: true, // 等待连接
  connectionLimit: 10, // 最大连接数
  queueLimit: 0, // 队列长度，0 表示没有限制
  // timezone: "+08:00", // 设置为本地时区
});

const promisePool = db.promise();

export default promisePool;
