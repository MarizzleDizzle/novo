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

    // Datumskonvertierung und Validierung
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
        return res.status(400).json({ error: "Ungültiges Datumsintervall" });
    }

    try {
        // Überlappende Buchungen prüfen
        const overlaps = await new Promise((resolve, reject) => {
            db.all(
                `SELECT id FROM bookings 
                WHERE apartment_id = ? 
                AND start_date < ? 
                AND end_date > ?`,
                [apartmentId, endDate, startDate],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows.length > 0);
                }
            );
        });

        if (overlaps) {
            return res.status(400).json({
                error: "Das Objekt ist in diesem Zeitraum nicht verfügbar."
            });
        }

        // Neue Buchung erstellen
        await runAsync(
            `INSERT INTO bookings
                 (apartment_id, user_id, start_date, end_date, guests)
             VALUES (?, ?, ?, ?, ?)`,
            [apartmentId, userId, startDate, endDate, guests]
        );
        res.json({ message: "Buchung erfolgreich!" });

    } catch (error) {
        console.error("Fehler:", error);
        res.status(500).json({ error: "Serverfehler bei der Buchung" });
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

// Buchungen nach User ID abrufen
exports.getBookingsByUserId = (req, res) => {
    const userId = req.params.userId;
    db.all(
        `SELECT bookings.*, apartments.title AS apartment_title
         FROM bookings
                  LEFT JOIN apartments ON bookings.apartment_id = apartments.id
         WHERE bookings.user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) {
                console.error("Datenbankfehler:", err.message);
                return res.status(500).json({ error: 'Datenbankfehler' });
            }
            res.json(rows);
        }
    );
};