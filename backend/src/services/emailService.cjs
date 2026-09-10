// backend/src/services/emailService.cjs
const nodemailer = require('nodemailer');

let transporter = null;

function initEmail(config) {
    transporter = nodemailer.createTransport({
        host: config?.host || process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
        port: config?.port || parseInt(process.env.EMAIL_PORT) || 2525,
        secure: config?.secure || false,
        auth: {
            user: config?.user || process.env.EMAIL_USER || '3f51e7152361ff',
            pass: config?.pass || process.env.EMAIL_PASSWORD || 'e69e4ac36ad0a4'
        }
    });
    
    console.log('✅ Email service initialized');
    return transporter;
}

function getTransporter() {
    if (!transporter) {
        initEmail();
    }
    return transporter;
}

// ============================================
// SEND EMAIL (Generic) - FIXED
// ============================================
async function sendEmail(to, subject, html, text) {
    try {
        // ✅ VALIDATE: Check if recipient is provided
        if (!to) {
            console.error('❌ Email error: No recipient provided');
            return { 
                success: false, 
                error: 'No recipient provided' 
            };
        }

        // ✅ VALIDATE: Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            console.error('❌ Email error: Invalid email format:', to);
            return { 
                success: false, 
                error: 'Invalid email format' 
            };
        }

        const transporter = getTransporter();
        
        // ✅ ENSURE: From email is set
        const fromEmail = process.env.EMAIL_FROM || 'noreply@agrivibe.com';
        
        const info = await transporter.sendMail({
            from: fromEmail,
            to: to,
            subject: subject || 'AgriVibe Notification',
            text: text || html?.replace(/<[^>]*>/g, '') || '',
            html: html || text || ' '
        });

        console.log('✅ Email sent to:', to);
        console.log('📧 Message ID:', info.messageId);
        
        if (nodemailer.getTestMessageUrl) {
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        }
        
        return {
            success: true,
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null,
            to: to
        };
    } catch (error) {
        console.error('❌ Email send error:', error.message);
        return {
            success: false,
            error: error.message,
            to: to
        };
    }
}

// ============================================
// SEND DELIVERY CODE EMAIL
// ============================================
async function sendDeliveryCodeEmail(to, orderNumber, code) {
    const subject = '🔑 Your AgriVibe Delivery Code';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
            <div style="background: #22c55e; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0;">🌾 AgriVibe</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
                <h2 style="color: #1a1a2e;">🔑 Your Delivery Code</h2>
                <p style="color: #4b5563;">Order #${orderNumber}</p>
                <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 36px; font-weight: bold; color: #22c55e; letter-spacing: 4px;">${code}</span>
                </div>
                <p style="color: #4b5563;">Give this code to your driver when you receive your items.</p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Thank you for choosing AgriVibe! 🌾</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
            </div>
        </div>
    `;
    const text = `🔑 Your Delivery Code for order #${orderNumber}: ${code}`;
    return sendEmail(to, subject, html, text);
}

// ============================================
// SEND ORDER CONFIRMATION EMAIL
// ============================================
async function sendOrderConfirmationEmail(to, orderNumber, total) {
    const subject = '✅ Order Confirmed - AgriVibe';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
            <div style="background: #22c55e; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0;">🌾 AgriVibe</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
                <h2 style="color: #1a1a2e;">✅ Order Confirmed!</h2>
                <p style="color: #4b5563;">Order #${orderNumber}</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Total:</strong> KES ${total}</p>
                </div>
                <p style="color: #4b5563;">You will receive a delivery code when your order is ready.</p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Thank you for shopping with AgriVibe! 🌾</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
            </div>
        </div>
    `;
    const text = `✅ Order #${orderNumber} confirmed! Total: KES ${total}`;
    return sendEmail(to, subject, html, text);
}

// ============================================
// SEND GUIDE PURCHASE EMAIL
// ============================================
async function sendGuidePurchaseEmail(to, guideTitle, guidePrice, downloadToken, orderNumber) {
    const downloadLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/guides/download/${downloadToken}`;
    
    const subject = `📚 Your Guide: "${guideTitle}" is Ready for Download`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
            <div style="background: #22c55e; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0;">🌾 AgriVibe</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
                <h2 style="color: #1a1a2e;">📚 Your Guide is Ready!</h2>
                <p style="color: #4b5563;">Thank you for your purchase!</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>📖 Guide:</strong> ${guideTitle}</p>
                    <p style="margin: 5px 0;"><strong>💰 Price:</strong> KES ${guidePrice}</p>
                    <p style="margin: 5px 0;"><strong>📦 Order:</strong> ${orderNumber}</p>
                </div>
                <a href="${downloadLink}" style="display: block; background: #22c55e; color: white; padding: 14px 28px; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
                    📥 Download Your Guide
                </a>
                <p style="color: #6b7280; font-size: 14px;">Or copy this link into your browser:</p>
                <p style="color: #3b82f6; word-break: break-all; font-size: 12px; background: #f3f4f6; padding: 10px; border-radius: 4px;">${downloadLink}</p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This link is valid for one download. For any issues, contact support@agrivibe.com</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
            </div>
        </div>
    `;
    const text = `📚 Your Guide "${guideTitle}" is ready!\nDownload: ${downloadLink}`;
    return sendEmail(to, subject, html, text);
}

module.exports = {
    initEmail,
    sendEmail,
    sendDeliveryCodeEmail,
    sendOrderConfirmationEmail,
    sendGuidePurchaseEmail
};