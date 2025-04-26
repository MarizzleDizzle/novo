const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mein-database.db');
const db = new sqlite3.Database(dbPath, err => {
  if (err) console.error('Fehler beim Verbinden zur Datenbank:', err.message);
  else console.log('Verbindung zur Datenbank erfolgreich.');
});

// Hilfsfunktion, um db.run per Promise zu nutzen
function runAsync(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Funktion zum sicheren Hinzufügen von Spalten
function addColumnIfNotExists(tableName, columnDefinition) {
  return new Promise(resolve => {
    db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
      if (err) {
        console.error(`Fehler beim Abrufen der Tabelleninfos für '${tableName}':`, err.message);
        return resolve();
      }

      const exists = columns.some(col => col.name === columnDefinition.name);
      if (exists) {
        console.log(`Spalte '${columnDefinition.name}' existiert bereits.`);
        return resolve();
      }

      db.run(
        `ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition.name} ${columnDefinition.type}`,
        err => {
          if (err) {
            if (err.message.includes('duplicate column')) {
              console.warn(`Spalte '${columnDefinition.name}' existiert bereits (gefangen).`);
            } else {
              console.error(
                `Fehler beim Hinzufügen von '${columnDefinition.name}':`,
                err.message
              );
            }
          } else {
            console.log(`Spalte '${columnDefinition.name}' wurde erfolgreich hinzugefügt.`);
          }
          resolve();
        }
      );
    });
  });
}

// Async-Initialisierung
async function initializeDatabase() {
  // 1) Tabellen anlegen
  await runAsync(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('customer', 'provider', 'admin')) NOT NULL
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS apartments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    location TEXT,
    price_per_night REAL
  )`);

  await runAsync(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    apartment_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (apartment_id) REFERENCES apartments(id)
  )`);

  // 2) Neue Spalten für apartments
  const newCols = [
    { name: 'address',       type: 'TEXT'    },
    { name: 'city',          type: 'TEXT'    },
    { name: 'zip',           type: 'TEXT'    },
    { name: 'country',       type: 'TEXT'    },
    { name: 'guests',        type: 'INTEGER' },
    { name: 'bedrooms',      type: 'INTEGER' },
    { name: 'beds',          type: 'INTEGER' },
    { name: 'bathrooms',     type: 'INTEGER' },
    { name: 'size',          type: 'INTEGER' },
    { name: 'min_stay',      type: 'INTEGER' },
    { name: 'amenities',     type: 'TEXT'    },
    { name: 'available_now', type: 'BOOLEAN DEFAULT 1' },
    { name: 'available_from',type: 'TEXT'    },
  ];

  for (const colDef of newCols) {
    await addColumnIfNotExists('apartments', colDef);
  }
}

initializeDatabase().catch(err => {
  console.error('Datenbank-Initialisierung fehlgeschlagen:', err);
});

// Globaler Error-Handler, der "duplicate column" ganz oben abfängt
process.on('uncaughtException', err => {
  if (err.message && err.message.includes('duplicate column')) {
    console.warn('Gefangener SQLite-Fehler (wird ignoriert):', err.message);
  } else {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  }
});

module.exports = db;
