const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campusController.cjs');
const { authMiddleware, authorize } = require('../middleware/auth.cjs');

// Public routes
router.get('/', campusController.getAllCampuses);
router.get('/type/:type', campusController.getCampusesByType);
router.get('/city/:city', campusController.getCampusesByCity);
router.get('/slug/:slug', campusController.getCampusBySlug);
router.get('/:id', campusController.getCampusById);

// Admin only routes
router.post('/', authMiddleware, authorize('admin'), campusController.createCampus);
router.put('/:id', authMiddleware, authorize('admin'), campusController.updateCampus);
router.delete('/:id', authMiddleware, authorize('admin'), campusController.deleteCampus);

module.exports = router;