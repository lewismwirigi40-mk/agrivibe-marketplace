const axios = require('axios');
const crypto = require('crypto');

class MpesaClient {
    constructor(config) {
        this.consumerKey = config.consumerKey;
        this.consumerSecret = config.consumerSecret;
        this.passkey = config.passkey;
        this.shortcode = config.shortcode;
        this.environment = config.environment || 'sandbox';
        this.callbackUrl = config.callbackUrl || 'https://your-domain.com/api/webhooks/mpesa';
        
this.baseUrl = this.environment === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
     // Safaricom sandbox IP
        
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }

        const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
        
        try {
              const response = await axios.get(
    `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Host': 'sandbox.safaricom.co.ke',
            'User-Agent': 'Mozilla/5.0'
        }
    }
);    
            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
            return this.accessToken;
        } catch (error) {
            console.error('M-Pesa token error:', error.response?.data || error.message);
            throw new Error('Failed to get M-Pesa access token');
        }
    }

    async stkPush(phoneNumber, amount, accountReference, transactionDesc) {
        try {
            const token = await this.getAccessToken();
            
            const timestamp = this.getTimestamp();
            const password = Buffer.from(
                `${this.shortcode}${this.passkey}${timestamp}`
            ).toString('base64');

            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
                {
                    BusinessShortCode: this.shortcode,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: amount,
                    PartyA: phoneNumber,
                    PartyB: this.shortcode,
                    PhoneNumber: phoneNumber,
                    CallBackURL: 'https://lance-catering-profile.ngrok-free.dev/api/webhooks/mpesa',
                    AccountReference: accountReference,
                    TransactionDesc: transactionDesc || 'AgriVibe Payment'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Host': 'sandbox.safaricom.co.ke'
                    }
                }
            );

            return {
                success: true,
                merchantRequestId: response.data.MerchantRequestID,
                checkoutRequestId: response.data.CheckoutRequestID,
                responseCode: response.data.ResponseCode,
                responseDescription: response.data.ResponseDescription,
                customerMessage: response.data.CustomerMessage
            };

        } catch (error) {
    console.error("========== STK PUSH ERROR ==========");
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Message:", error.message);
    console.error("====================================");

    return {
        success: false,
        error: error.response?.data?.errorMessage ||
               error.response?.data?.errorCode ||
               error.message ||
               "STK Push failed"
    };
}
    }

    async queryStatus(checkoutRequestId) {
        try {
            const token = await this.getAccessToken();
            
            const timestamp = this.getTimestamp();
            const password = Buffer.from(
                `${this.shortcode}${this.passkey}${timestamp}`
            ).toString('base64');

            const response = await axios.post(
                `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
                {
                    BusinessShortCode: this.shortcode,
                    Password: password,
                    Timestamp: timestamp,
                    CheckoutRequestID: checkoutRequestId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return {
                success: true,
                resultCode: response.data.ResultCode,
                resultDesc: response.data.ResultDesc,
                mpesaReceiptNumber: response.data.MpesaReceiptNumber,
                transactionDate: response.data.TransactionDate,
                amount: response.data.Amount
            };

        } catch (error) {
            console.error('M-Pesa query error:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.errorMessage || 'Query failed'
            };
        }
    }

    getTimestamp() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
}

module.exports = MpesaClient;