const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const DB_PATH = path.join(__dirname, 'db/emotional_diary.db'); // Path to the SQLite database file
const SCHEMA_PATH = path.join(__dirname, 'db/schema.sql'); // Path to the SQL schema file

/**
 * Initialize the SQLite database using the schema file
 * - Creates tables if they don't exist
 * - Logs success or error to console
 */
async function initDB() {
  try {
    // Connect to SQLite database (creates file if it doesn't exist)
    const db = await sqlite.open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

     // Read and execute schema SQL to set up tables
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    await db.exec(schema);

    console.log('DB init successful!');
    await db.close();
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

initDB();
