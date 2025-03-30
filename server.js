const express = require('express');
const path = require('path');
const db = require('./db/database');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Beispielroute: Alle Apartments abrufen
app.get('/api/apartments', (req, res) => {
  db.all('SELECT * FROM apartments', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ apartments: rows });
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});