

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.resolve(__dirname, '../mein-database.db'));

// Hilfsfunktion für async DB-Anfragen
function runAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

exports.createApartment = async (req, res) => {
  const { title, description, address, city, zip, country,
    guests, bedrooms, beds, bathrooms, size, price,
    minStay, availableNow, availableFrom, wifi, kitchen, parking, tv } = req.body;

  const imagePaths = req.files.map(file => 'uploads/' + file.filename);

  try {
    await runAsync(
      `INSERT INTO apartments 
      (title, description, address, city, zip, country, guests, bedrooms, beds, bathrooms, size, price, min_stay, available_now, available_from, amenities, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, address, city, zip, country,
        guests, bedrooms, beds, bathrooms, size, price,
        minStay, availableNow, availableFrom,
        JSON.stringify({ wifi: wifi === 'true', kitchen: kitchen === 'true', parking: parking === 'true', tv: tv === 'true' }),
        JSON.stringify(imagePaths)
      ]
    );
    res.json({ message: 'Wohnung erfolgreich hinzugefügt!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Speichern der Wohnung' });
  }
};

exports.getAllApartments = (req, res) => {
  db.all(`SELECT * FROM apartments`, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Fehler beim Abrufen der Apartments' });
    } else {
      res.json(rows);
    }
  });
};

exports.getApartmentById = (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM apartments WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Fehler beim Abrufen des Apartments' });
    } else {
      res.json(row);
    }
  });
};