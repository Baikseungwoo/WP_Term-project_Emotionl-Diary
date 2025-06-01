-- users table
CREATE TABLE IF NOT EXISTS users (
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  phoneNum TEXT,
  birthDate TEXT
);

-- diary table
CREATE TABLE IF NOT EXISTS diary (
  diaryId INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  emotion TEXT NOT NULL,
  keyword1 TEXT,
  keyword2 TEXT,
  keyword3 TEXT,
  date TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId)
);
