const express = require('express');
const path = require('path');
const db = require('./db/database');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Registrierung eines neuen Benutzers
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!['customer', 'provider', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Ungültige Rolle' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, email, hashedPassword, role], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Registrierung erfolgreich', userId: this.lastID });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Nutzer nicht gefunden' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Falsches Passwort' });
    }

    res.json({ message: 'Login erfolgreich', user });
  });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});