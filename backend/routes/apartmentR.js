

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const apartmentController = require('../controller/apartmentC');

// Multer Setup für Bild-Uploads
const uploadDir = path.join(__dirname, '../public/uploads');
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: multerStorage });

// POST Apartment erstellen
router.post('/', upload.array('images'), apartmentController.createApartment);

// GET Alle Apartments
router.get('/', apartmentController.getAllApartments);

// GET Apartment nach ID
router.get('/:id', apartmentController.getApartmentById);

module.exports = router;