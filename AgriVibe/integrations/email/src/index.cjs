const sgMail = require('@sendgrid/mail');

class EmailService {
    constructor(apiKey) {
        sgMail.setApiKey(apiKey);
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@agrivibe.com';
        this.fromName = process.env.EMAIL_FROM_NAME || 'AgriVibe';
    }

    async send(to, subject, html, text = null) {
        try {
            const msg = {
                to,
                from: {
                    email: this.fromEmail,
                    name: this.fromName
                },
                subject,
                html,
                text: text || html.replace(/<[^>]*>/g, '')
            };

            const response = await sgMail.send(msg);
            return {
                success: true,
                messageId: response[0]?.headers['x-message-id']
            };
        } catch (error) {
            console.error('Email send error:', error.response?.body || error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendOrderConfirmation(to, orderNumber, items, total) {
        const html = `
            <h1>✅ Order Confirmed!</h1>
            <p>Thank you for your order #${orderNumber}.</p>
            <h2>Order Summary</h2>
            <ul>
                ${items.map(item => `<li>${item.name} x ${item.quantity} = KES ${item.total}</li>`).join('')}
            </ul>
            <p><strong>Total: KES ${total}</strong></p>
            <p>You will receive a delivery code when your order is ready.</p>
            <p>Thank you for choosing AgriVibe! 🌾</p>
        `;
        return this.send(to, `Order #${orderNumber} Confirmed`, html);
    }

    async sendDeliveryCode(to, orderNumber, code) {
        const html = `
            <h1>🔑 Your Delivery Code</h1>
            <p>Order #${orderNumber}</p>
            <h2>Code: <strong>${code}</strong></h2>
            <p>Give this code to your driver only when you receive your items.</p>
            <p>Thank you for choosing AgriVibe! 🌾</p>
        `;
        return this.send(to, `Delivery Code for Order #${orderNumber}`, html);
    }

    async sendOrderDelivered(to, orderNumber) {
        const html = `
            <h1>📦 Order Delivered!</h1>
            <p>Order #${orderNumber} has been delivered.</p>
            <p>Thank you for shopping with AgriVibe! 🌾</p>
            <p>Please rate your delivery experience in the app.</p>
        `;
        return this.send(to, `Order #${orderNumber} Delivered`, html);
    }
}

function createEmailService(config) {
    return new EmailService(config.apiKey);
}

module.exports = {
    createEmailService,
    EmailService
};