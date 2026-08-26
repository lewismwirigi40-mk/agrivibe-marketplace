// backend/src/controllers/notificationController.cjs
const Notification = require('../models/Notification.cjs');

// Create Notification (Internal use)
exports.createNotification = async (user_id, type, title, message, data = {}, channel = 'in_app') => {
    try {
        const notification = await Notification.create({
            user_id,
            type,
            title,
            message,
            data,
            channel,
            sent_at: new Date()
        });
        return notification;
    } catch (error) {
        console.error('Create notification error:', error);
        return null;
    }
};

// Get User Notifications
exports.getUserNotifications = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { limit = 50, offset = 0 } = req.query;

        const notifications = await Notification.findAndCountAll({
            where: { user_id },
            // 🟢 FIXED: Explicitly select existing columns, omitting the missing 'link' column
            attributes: [
                'id', 
                'user_id', 
                'type', 
                'title', 
                'message', 
                'data', 
                'channel', 
                'is_read', 
                'read_at', 
                'sent_at', 
                'created_at', 
                'updated_at'
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Calculate and append counter matrices safely
        const unreadCount = await Notification.count({ 
            where: { user_id, is_read: false } 
        });

        return res.json({
            success: true,
            total: notifications.count,
            unread: unreadCount,
            notifications: notifications.rows
        });

    } catch (error) {
        console.error('❌ Get notifications error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch notifications',
            message: error.message 
        });
    }
};

// Mark as Read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const notification = await Notification.findOne({
            where: { id, user_id }
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        await notification.update({
            is_read: true,
            read_at: new Date()
        });

        res.json({
            success: true,
            message: 'Notification marked as read',
            notification
        });

    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
    }
};

// Mark All as Read
exports.markAllAsRead = async (req, res) => {
    try {
        const user_id = req.user.id;

        await Notification.update(
            { is_read: true, read_at: new Date() },
            { where: { user_id, is_read: false } }
        );

        res.json({ success: true, message: 'All notifications marked as read' });

    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark all as read' });
    }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const notification = await Notification.findOne({
            where: { id, user_id }
        });

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        await notification.destroy();

        res.json({ success: true, message: 'Notification deleted successfully' });

    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
};

// Get Unread Count
exports.getUnreadCount = async (req, res) => {
    try {
        const user_id = req.user.id;

        const count = await Notification.count({
            where: { user_id, is_read: false }
        });

        res.json({ success: true, unread_count: count });

    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ success: false, error: 'Failed to get unread count' });
    }
};