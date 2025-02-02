import mysql from 'mysql2';
import 'dotenv/config';

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // 
  waitForConnections: true, // Espera por conexões disponíveis
  connectionLimit: 10, // Limite máximo de conexões
  queueLimit: 0, // Quantidade de solicitações na fila
};

const pool = mysql.createPool(dbConfig).promise();

export default pool;