const express = require('express');
const router = express.Router();
const userController = require('../controller/userC');

// Benutzer registrieren
router.post('/register', userController.registerUser);

// Benutzer Login
router.post('/login', userController.loginUser);

// Alle Benutzer abrufen
router.get('/', userController.getAllUsers);

// Einzelnen Benutzer abrufen
router.get('/:id', userController.getUserById);

// Benutzerprofil aktualisieren
router.put('/update', userController.updateUser);

// Passwort ändern
router.put('/change-password', userController.changePassword);

// Rolle auf Anbieter ändern
router.put('/become-provider', userController.becomeProvider);

module.exports = router;
