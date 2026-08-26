// backend/src/routes/notificationRoutes.cjs
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.cjs');
const notificationController = require('../controllers/notificationController.cjs');

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================
router.use(authMiddleware);

// Get all notifications for the logged-in user
router.get('/', notificationController.getUserNotifications);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark a single notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;