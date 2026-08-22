const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController.cjs');
const { authMiddleware } = require('../middleware/auth.cjs');

// All routes require authentication
router.use(authMiddleware);

router.get('/', notificationController.getUserNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;