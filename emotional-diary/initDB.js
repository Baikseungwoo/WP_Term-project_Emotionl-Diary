const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

// path setting
const DB_PATH = path.join(__dirname, 'db/users.db');
const SCHEMA_PATH = path.join(__dirname, 'db/schema.sql');

async function initDB() {
  try {
    const db = await sqlite.open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    await db.exec(schema);

    console.log('DB init successful!');
    await db.close();
  } catch (err) {
    console.error('DB init error:', err.message);
  }
}

initDB();
