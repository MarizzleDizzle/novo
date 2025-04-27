const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingC');

// Buchung erstellen
router.post('/', bookingController.createBooking);

// Alle Buchungen abrufen
router.get('/', bookingController.getAllBookings);

// Einzelne Buchung abrufen
router.get('/:id', bookingController.getBookingById);

module.exports = router;
