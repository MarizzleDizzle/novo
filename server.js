require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./db/database');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Bild-Upload Konfiguration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Hilfsfunktion für Datenbank-Initialisierung
async function initializeDatabase() {
  const alterQueries = [
    "ALTER TABLE apartments ADD COLUMN address TEXT",
    "ALTER TABLE apartments ADD COLUMN city TEXT",
    // ... (alle anderen ALTER TABLE-Anweisungen von oben)
  ];

  for (const query of alterQueries) {
    try {
      await db.run(query);
    } catch (e) {
      // Spalte existiert wahrscheinlich bereits
    }
  }
}

// --- DEINE BESTEHENDEN ROUTES --- //
app.post('/api/register', async (req, res) => {
  // Dein bestehender Registrierungs-Code
});

app.post('/api/login', (req, res) => {
  // Dein bestehender Login-Code
});

// --- NEUE WOHNUNGS-ROUTES --- //
app.post('/api/apartments', upload.array('images'), (req, res) => {
  // Der neue Wohnungserstellungs-Code von oben
});

app.get('/api/apartments', (req, res) => {
  // Der neue Wohnungen-abrufen-Code von oben
});

// Server starten
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
  });
});