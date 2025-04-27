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

// Buchung erstellen
exports.createBooking = async (req, res) => {
    const { apartmentId, userId, startDate, endDate, guests } = req.body;

    try {
        await runAsync(
            `INSERT INTO bookings (apartment_id, user_id, start_date, end_date, guests)
       VALUES (?, ?, ?, ?, ?)`,
            [apartmentId, userId, startDate, endDate, guests]
        );
        res.json({ message: 'Buchung erfolgreich erstellt!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Erstellen der Buchung' });
    }
};

// Alle Buchungen abrufen
exports.getAllBookings = (req, res) => {
    db.all(`SELECT * FROM bookings`, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Fehler beim Abrufen der Buchungen' });
        } else {
            res.json(rows);
        }
    });
};

// Einzelne Buchung nach ID abrufen
exports.getBookingById = (req, res) => {
    const id = req.params.id;
    db.get(`SELECT * FROM bookings WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Fehler beim Abrufen der Buchung' });
        } else {
            res.json(row);
        }
    });
};