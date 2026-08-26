// backend/src/controllers/auditController.cjs
const AuditLog = require('../models/AuditLog.cjs');
const { Op } = require('sequelize');

// Create audit log entry (internal use)
exports.createLog = async (user_id, user_name, action, details = '', type = 'view', ip_address = null, user_agent = null) => {
    try {
        await AuditLog.create({
            user_id,
            user_name,
            action,
            details,
            type,
            ip_address,
            user_agent
        });
    } catch (error) {
        console.error('Create audit log error:', error);
    }
};

// Get all audit logs
exports.getLogs = async (req, res) => {
    try {
        const { limit = 100, offset = 0, type, search } = req.query;

        const where = {};
        if (type && type !== 'all') {
            where.type = type;
        }
        if (search) {
            where[Op.or] = [
                { user_name: { [Op.iLike]: `%${search}%` } },
                { action: { [Op.iLike]: `%${search}%` } },
                { details: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const logs = await AuditLog.findAndCountAll({
            where,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            total: logs.count,
            logs: logs.rows
        });
    } catch (error) {
        console.error('Get audit logs error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
    }
};

// Get audit log stats
exports.getStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const total = await AuditLog.count();
        const todayCount = await AuditLog.count({
            where: { created_at: { [Op.gte]: today } }
        });
        const weekCount = await AuditLog.count({
            where: { created_at: { [Op.gte]: weekAgo } }
        });
        const actionCount = await AuditLog.count({
            where: { type: { [Op.in]: ['update', 'delete'] } }
        });

        res.json({
            success: true,
            stats: {
                total,
                today: todayCount,
                week: weekCount,
                actions: actionCount
            }
        });
    } catch (error) {
        console.error('Get audit stats error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
};