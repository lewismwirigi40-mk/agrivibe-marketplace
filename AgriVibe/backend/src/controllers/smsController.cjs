const { sendSms } = require('../services/smsService.cjs');

console.log('🔧 Loading SMS controller...');

exports.sendTestSms = async (req, res) => {
    console.log('📩 SMS test endpoint hit!');
    try {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            return res.status(400).json({ error: 'Phone number and message are required' });
        }

        console.log(`📱 Sending SMS to ${phoneNumber}: ${message}`);

        const result = await sendSms(phoneNumber, message);

        if (result.success) {
            res.json({
                message: 'SMS sent successfully',
                sid: result.sid,
                status: result.status
            });
        } else {
            res.status(400).json({
                error: result.error || 'Failed to send SMS'
            });
        }

    } catch (error) {
        console.error('Send test SMS error:', error);
        res.status(500).json({ error: 'Failed to send SMS' });
    }
};

console.log('✅ SMS controller loaded');