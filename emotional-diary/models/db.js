const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || path.join(__dirname, '../db/emotional_diary.db');

async function getDBConnection() {
  const db = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  return db;
}

module.exports = { getDBConnection };
