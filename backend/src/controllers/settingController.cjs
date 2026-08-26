// backend/src/controllers/settingController.cjs
const Setting = require('../models/Setting.cjs');

// Get all settings
exports.getAllSettings = async (req, res) => {
    try {
        const settings = await Setting.findAll();
        const settingsObj = {};
        settings.forEach(s => {
            settingsObj[s.key] = s.value;
        });
        res.json({ success: true, settings: settingsObj });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch settings' });
    }
};

// Update settings
exports.updateSettings = async (req, res) => {
    try {
        const { settings } = req.body;

        for (const [key, value] of Object.entries(settings)) {
            await Setting.upsert({
                key: key,
                value: value,
                group: 'general'
            });
        }

        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
};

// Get a single setting
exports.getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await Setting.findOne({ where: { key } });
        res.json({ success: true, setting });
    } catch (error) {
        console.error('Get setting error:', error);
        res.status(500).json({ success: false, error: 'Failed to get setting' });
    }
};