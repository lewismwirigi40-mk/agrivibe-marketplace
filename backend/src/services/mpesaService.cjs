// backend/src/services/mpesaService.cjs
const axios = require('axios');

class MpesaService {
    constructor() {
        this.consumerKey = process.env.MPESA_CONSUMER_KEY;
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        this.passkey = process.env.MPESA_PASSKEY;
        this.shortcode = process.env.MPESA_SHORTCODE;
        this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
        this.baseUrl = this.environment === 'sandbox' 
            ? 'https://sandbox.safaricom.co.ke' 
            : 'https://api.safaricom.co.ke';
        this.token = null;
    }

    async getAccessToken() {
        try {
            const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
            const response = await axios.get(
                `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
                { headers: { Authorization: `Basic ${auth}` } }
            );
            this.token = response.data.access_token;
            return this.token;
        } catch (error) {
            console.error('M-Pesa token error:', error.response?.data || error.message);
            throw error;
        }
    }

    async stkPush(phone, amount, accountRef, callbackUrl) {
        try {
            await this.getAccessToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g/, '').slice(0, 14);
            const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
            
            // Format phone number
            let formattedPhone = phone.replace(/[^0-9]/g, '');
            if (formattedPhone.startsWith('0')) {
                formattedPhone = '254' + formattedPhone.substring(1);
            } else if (formattedPhone.startsWith('+254')) {
                formattedPhone = formattedPhone.substring(1);
            } else if (!formattedPhone.startsWith('254')) {
                formattedPhone = '254' + formattedPhone;
            }
            
            console.log('📱 Sending STK Push to:', formattedPhone);
            console.log('💰 Amount:', Math.round(amount));
            console.log('📦 Account Ref:', accountRef);
            
            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
                {
                    BusinessShortCode: this.shortcode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: Math.round(amount),
                    PartyA: formattedPhone,
                    PartyB: this.shortcode,
                    PhoneNumber: formattedPhone,
                    CallBackURL: callbackUrl || process.env.MPESA_CALLBACK_URL || 'https://your-ngrok-url.ngrok.io/api/mpesa/callback',
                    AccountReference: accountRef,
                    TransactionDesc: 'AgriVibe Guide Purchase'
                },
                { headers: { Authorization: `Bearer ${this.token}` } }
            );
            
            console.log('✅ STK Push Response:', response.data);
            return {
                success: true,
                ...response.data
            };
        } catch (error) {
            console.error('❌ STK Push error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.errorMessage || error.message,
                responseCode: error.response?.data?.ResponseCode || '500'
            };
        }
    }

    async queryStatus(checkoutRequestId) {
        try {
            await this.getAccessToken();
            const timestamp = new Date().toISOString().replace(/[^0-9]/g/, '').slice(0, 14);
            const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
            
            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
                {
                    BusinessShortCode: this.shortcode,
                    Password: password,
                    Timestamp: timestamp,
                    CheckoutRequestID: checkoutRequestId
                },
                { headers: { Authorization: `Bearer ${this.token}` } }
            );
            return {
                success: true,
                ...response.data
            };
        } catch (error) {
            console.error('Query status error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.errorMessage || error.message
            };
        }
    }
}

module.exports = new MpesaService();