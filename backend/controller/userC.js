const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database(path.resolve(__dirname, '../mein-database.db'));
const jwt = require('jsonwebtoken');

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



// Benutzerprofil aktualisieren
exports.updateUser = (req, res) => {
    const { id, name, email } = req.body;

    if (!id || !name || !email) {
        return res.status(400).json({ error: 'Fehlende Felder' });
    }

    db.run(
        `UPDATE users SET name = ?, email = ? WHERE id = ?`,
        [name, email, id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Fehler beim Aktualisieren des Profils' });
            }
            res.json({ message: 'Profil erfolgreich aktualisiert' });
        }
    );
};

// Passwort ändern
exports.changePassword = async (req, res) => {
    const { id, oldPassword, newPassword } = req.body;

    if (!id || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Fehlende Felder' });
    }

    db.get(`SELECT password FROM users WHERE id = ?`, [id], async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Fehler beim Abrufen des Benutzers' });
        }

        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(401).json({ error: 'Altes Passwort ist falsch' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        db.run(
            `UPDATE users SET password = ? WHERE id = ?`,
            [hashedNewPassword, id],
            function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Fehler beim Aktualisieren des Passworts' });
                }
                res.json({ message: 'Passwort erfolgreich geändert' });
            }
        );
    });
};

// Benutzerrolle auf Anbieter setzen
exports.becomeProvider = (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Benutzer-ID fehlt' });
    }

    db.run(
        `UPDATE users SET role = 'provider' WHERE id = ?`,
        [id],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Fehler beim Aktualisieren der Rolle' });
            }
            res.json({ message: 'Benutzerrolle erfolgreich auf Anbieter gesetzt' });
        }
    );
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

        // JWT Token erstellen
        const token = jwt.sign(
            {
                userID: userWithoutPassword.id,
                name: userWithoutPassword.name,
                role: userWithoutPassword.role
            },
            "owbnetui723z894hnwqbeuerdz3w8uperhnjbnfvuiö",
            { expiresIn: "7d" }
        );

        res.json({
            token,
            userID: userWithoutPassword.id,
            role: userWithoutPassword.role,
            name: userWithoutPassword.name
        });
    });
};