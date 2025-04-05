// src/lib/db.js
import pg from 'pg';
const { Pool } = pg;

// Uses environment variables or defaults
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tododb',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

// Helper function to execute queries
export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    // Log the detailed error for server-side debugging
    console.error('Database Query Error:', error);
    throw error;
  } finally {
    client.release(); // Ensure client is always released
  }
}

export { pool };