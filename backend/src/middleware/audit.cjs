// backend/src/middleware/audit.cjs
const { createLog } = require('../controllers/auditController.cjs');

// Middleware to log user actions
exports.logAction = (action, type = 'view') => {
    return async (req, res, next) => {
        try {
            const user = req.user;
            if (user) {
                const details = req.method === 'GET' 
                    ? `${req.method} ${req.originalUrl}`
                    : `${req.method} ${req.originalUrl} - ${JSON.stringify(req.body)}`;
                
                await createLog(
                    user.id,
                    `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
                    action,
                    details.substring(0, 1000),
                    type,
                    req.ip,
                    req.headers['user-agent']
                );
            }
        } catch (error) {
            console.error('Audit log error:', error);
        }
        next();
    };
};