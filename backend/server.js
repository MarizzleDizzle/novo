// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5022;

// CORS erlauben
app.use(cors());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien
app.use(express.static(path.join(__dirname, 'public')));

// SQLite3 Verbindung
const dbPath = path.resolve(__dirname, 'mein-database.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error('Fehler beim Verbinden zur Datenbank:', err.message);
  else console.log('✅ Verbindung zur Datenbank erfolgreich.');
});

// Hilfsfunktion: run als Promise
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Initialisiere Datenbank
async function initializeDatabase() {
  await runAsync(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('customer', 'provider', 'admin')) NOT NULL
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS apartments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    zip TEXT,
    country TEXT,
    guests INTEGER,
    bedrooms INTEGER,
    beds INTEGER,
    bathrooms INTEGER,
    size INTEGER,
    price INTEGER,
    min_stay INTEGER,
    available_now INTEGER DEFAULT 1,
    available_from TEXT,
    amenities TEXT,
    images TEXT
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    apartment_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    guests INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (apartment_id) REFERENCES apartments(id)
  )`);

  console.log('✅ Tabellen erstellt/überprüft.');
}

// API Endpunkte
const apartmentRoutes = require('./routes/apartmentR');
const userRoutes = require('./routes/userR');
const bookingRoutes = require('./routes/bookingR');

app.use('/api/apartments', apartmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);


// Starte Server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => console.log(`✅ Server läuft auf http://localhost:${port}`));
  } catch (err) {
    console.error('❌ Fehler beim Starten:', err);
    process.exit(1);
  }
}

startServer();
