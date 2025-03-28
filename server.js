const express = require('express');
const app = express();
const port = 3000;

// Statische Dateien bereitstellen (Frontend)
app.use(express.static('public'));

// Beispiel-API-Route
app.get('/users', (req, res) => {
  res.json({ users: [{ name: 'Max', email: 'max@example.com' }] });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});