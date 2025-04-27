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

module.exports = router;
