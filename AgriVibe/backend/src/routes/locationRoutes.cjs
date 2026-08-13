const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// All routes require authentication
router.use(authMiddleware);

// Update user location
router.put('/location', locationController.updateUserLocation);

// Get user location
router.get('/location', locationController.getUserLocation);

// Get nearby products (within radius)
router.get('/nearby-products', locationController.getNearbyProducts);

// Geocode address (convert address to coordinates)
router.post('/geocode', locationController.geocodeAddress);

// Reverse geocode (convert coordinates to address)
router.post('/reverse-geocode', locationController.reverseGeocode);

// Get distance between two addresses
router.post('/distance', locationController.getDistance);

// Autocomplete address
router.post('/autocomplete', locationController.autocompleteAddress);

module.exports = router;