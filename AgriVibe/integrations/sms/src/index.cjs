const twilio = require('twilio');

console.log('🔧 Loading Twilio integration...');

class SmsService {
    constructor(config) {
        console.log('📡 Creating Twilio client...');
        this.accountSid = config.accountSid;
        this.authToken = config.authToken;
        this.fromNumber = config.fromNumber;
        this.client = twilio(this.accountSid, this.authToken);
        console.log('✅ Twilio client created');
    }

    async send(to, message) {
    console.log(`📤 Twilio.send called: to=${to}`);
    try {
        // Clean the number: remove spaces, dashes, parentheses
        let formattedTo = to.replace(/\s/g, '').replace(/[^0-9+]/g, '');
        
        // If number already has +, keep it as is
        if (formattedTo.startsWith('+')) {
            // Do nothing - already has country code
        }
        // If number starts with 0, it's a local Kenyan number
        else if (formattedTo.startsWith('0')) {
            formattedTo = '+254' + formattedTo.substring(1);
        }
        // If number starts with 254, add +
        else if (formattedTo.startsWith('254')) {
            formattedTo = '+' + formattedTo;
        }
        // If number starts with 1, it's a US number
        else if (formattedTo.startsWith('1')) {
            formattedTo = '+' + formattedTo;
        }
        // If no country code, assume Kenya
        else {
            formattedTo = '+254' + formattedTo;
        }

        console.log(`📤 Final formatted number: ${formattedTo}`);

        const response = await this.client.messages.create({
            body: message,
            from: this.fromNumber,
            to: formattedTo
        });

        console.log(`✅ SMS sent! SID: ${response.sid}`);
        return {
            success: true,
            sid: response.sid,
            status: response.status
        };
    } catch (error) {
        console.error('SMS send error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}
}

function createSmsService(config) {
    return new SmsService(config);
}

module.exports = {
    createSmsService,
    SmsService
};

console.log('✅ Twilio integration loaded');