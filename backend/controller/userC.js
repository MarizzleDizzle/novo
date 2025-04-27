const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
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

// Benutzer registrieren
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!['customer', 'provider', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Ungültige Rolle angegeben' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await runAsync(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role]
        );
        res.json({ message: 'Benutzer erfolgreich registriert!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler bei der Registrierung des Benutzers' });
    }
};

// Alle Benutzer abrufen
exports.getAllUsers = (req, res) => {
    db.all(`SELECT id, name, email FROM users`, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Fehler beim Abrufen der Benutzer' });
        } else {
            res.json(rows);
        }
    });
};

// Einzelnen Benutzer nach ID abrufen
exports.getUserById = (req, res) => {
    const id = req.params.id;
    db.get(`SELECT id, name, email FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Fehler beim Abrufen des Benutzers' });
        } else {
            res.json(row);
        }
    });
};

// Benutzer Login
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT id, name, email, role, password FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Fehler beim Login' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Ungültige E-Mail oder Passwort' });
        }

        const { password: _, ...userWithoutPassword } = user;

        res.cookie('user', JSON.stringify(userWithoutPassword), {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Tage
        });

        res.json({ message: 'Login erfolgreich', user: userWithoutPassword });
    });
};