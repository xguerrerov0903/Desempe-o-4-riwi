import mysql from 'mysql2/promise';
import 'dotenv/config';

export const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

try {
  await connection.query('SELECT 1');
  console.log('Conectado correctamente a la base de datos');
} catch (err) {
  console.error('Error conectando a la base de datos:', err);
  process.exit(1);
}