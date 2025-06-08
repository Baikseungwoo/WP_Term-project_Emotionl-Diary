const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');
require('dotenv').config();

// Define database file path: use .env or fallback to default local path
const dbPath = process.env.DB_PATH || path.join(__dirname, '../db/emotional_diary.db');

/**
 * Open and return a connection to the SQLite database
 * @returns {Promise<sqlite3.Database>} - The database connection object
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  return db;
}

module.exports = { getDBConnection };
