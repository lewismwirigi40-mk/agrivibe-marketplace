// backend/src/routes/notificationRoutes.cjs
const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth.cjs');
const notificationController = require('../controllers/notificationController.cjs');

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================
router.use(authMiddleware);

// ============================================
// USER NOTIFICATION ROUTES
// ============================================

// ✅ Get all notifications for the logged-in user
router.get('/', notificationController.getUserNotifications);

// ✅ Get recent notifications (for widget/bell)
router.get('/recent', notificationController.getRecentNotifications);

// ✅ Get unread count (for badge)
router.get('/unread-count', notificationController.getUnreadCount);


// ============================================
// NOTIFICATION ACTION ROUTES
// ============================================

// ✅ Mark a single notification as read
router.put('/:id/read', notificationController.markAsRead);

// ✅ Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// ✅ Delete a single notification
router.delete('/:id', notificationController.deleteNotification);

// ✅ Delete all notifications (user)
router.delete('/delete-all', notificationController.deleteAllNotifications);


// ============================================
// ADMIN ROUTES
// ============================================

// ✅ Get all notifications (system-wide - admin)
router.get('/admin/all', authorize('admin'), notificationController.getAllNotifications);

// ✅ Broadcast notification to multiple users (admin)
router.post('/broadcast', authorize('admin'), notificationController.broadcastNotification);

// ✅ Get notification stats (admin)
router.get('/admin/stats', authorize('admin'), notificationController.getNotificationStats);


// ============================================
// TEST ROUTE
// ============================================

// ✅ Test notification (for development)
router.post('/test', authorize('admin'), notificationController.testNotification);

module.exports = router;