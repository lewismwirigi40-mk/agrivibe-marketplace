const axios = require('axios');

let phoneNumberId = null;
let accessToken = null;

function initWhatsApp(config) {
    phoneNumberId = config.WHATSAPP_PHONE_NUMBER_ID;
    accessToken = config.WHATSAPP_ACCESS_TOKEN;
    console.log('✅ WhatsApp service initialized');
}

async function sendWhatsAppMessage(to, message) {
    try {
        let formattedTo = to;
        if (formattedTo.startsWith('+')) {
            formattedTo = formattedTo.substring(1);
        }

        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: formattedTo,
                type: 'text',
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ WhatsApp message sent:', response.data.messages[0].id);
        return {
            success: true,
            messageId: response.data.messages[0].id
        };
    } catch (error) {
        console.error('❌ WhatsApp send error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || 'Failed to send WhatsApp message'
        };
    }
}

module.exports = {
    initWhatsApp,
    sendWhatsAppMessage
};