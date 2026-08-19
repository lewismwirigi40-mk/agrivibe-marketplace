const { createSmsService } = require('../../../integrations/sms/src/index.cjs');

console.log('🔧 Loading SMS service...');

let smsService = null;

function initSms(config) {
    console.log('📡 Initializing SMS service...');
    smsService = createSmsService({
        accountSid: config.TWILIO_ACCOUNT_SID,
        authToken: config.TWILIO_AUTH_TOKEN,
        fromNumber: config.TWILIO_PHONE_NUMBER
    });
    console.log('✅ SMS service initialized');
    return smsService;
}

function getSmsService() {
    if (!smsService) {
        throw new Error('SMS service not initialized');
    }
    return smsService;
}

async function sendSms(to, message) {
    console.log(`📤 sendSms called: to=${to}, message=${message}`);
    try {
        const service = getSmsService();
        const result = await service.send(to, message);
        console.log(`📤 SMS result:`, result);
        return result;
    } catch (error) {
        console.error('Send SMS error:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    initSms,
    getSmsService,
    sendSms
};

console.log('✅ SMS service loaded');