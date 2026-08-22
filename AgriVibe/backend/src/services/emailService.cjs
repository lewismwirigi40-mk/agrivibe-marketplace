const nodemailer = require('nodemailer');

let transporter = null;
function initEmail(config) {
    transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
            user: '3f51e7152361ff',
            pass: 'e69e4ac36ad0a4'
        }
    });
    
    console.log('✅ Mailtrap service initialized');
    return transporter;
}

function getTransporter() {
    if (!transporter) {
        throw new Error('Email not initialized');
    }
    return transporter;
}

async function sendEmail(to, subject, html, text) {
    try {
        const transporter = getTransporter();
        
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'aurelia80@ethereal.email',
            to: to,
            subject: subject,
            text: text || html.replace(/<[^>]*>/g, ''),
            html: html
        });

        console.log('✅ Email sent:', info.messageId);
        console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        
        return {
            success: true,
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info)
        };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function sendDeliveryCodeEmail(to, orderNumber, code) {
    const subject = '🔑 Your AgriVibe Delivery Code';
    const html = `
        <h1>🔑 Your Delivery Code</h1>
        <p>Order #${orderNumber}</p>
        <h2 style="font-size: 32px; color: #2d7d2d;">${code}</h2>
        <p>Give this code to your driver when you receive your items.</p>
        <p>Thank you for choosing AgriVibe! 🌾</p>
    `;
    return sendEmail(to, subject, html);
}

async function sendOrderConfirmationEmail(to, orderNumber, total) {
    const subject = '✅ Order Confirmed - AgriVibe';
    const html = `
        <h1>✅ Order Confirmed!</h1>
        <p>Order #${orderNumber}</p>
        <p>Total: KES ${total}</p>
        <p>You will receive a delivery code when your order is ready.</p>
        <p>Thank you for shopping with AgriVibe! 🌾</p>
    `;
    return sendEmail(to, subject, html);
}

module.exports = {
    initEmail,
    sendEmail,
    sendDeliveryCodeEmail,
    sendOrderConfirmationEmail
}