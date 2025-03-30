const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mein-database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Fehler beim Verbinden zur Datenbank:', err.message);
  else console.log('Verbindung zur Datenbank erfolgreich.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS apartments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    location TEXT,
    price_per_night REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    apartment_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (apartment_id) REFERENCES apartments(id)
  )`);
});

module.exports = db;