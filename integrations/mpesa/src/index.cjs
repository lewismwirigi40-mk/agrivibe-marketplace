const MpesaClient = require('./client.cjs');
const MpesaWebhook = require('./webhook.cjs');

function createMpesaClient(config) {
    return new MpesaClient(config);
}

function createMpesaWebhook(config) {
    return new MpesaWebhook(config);
}

module.exports = {
    createMpesaClient,
    createMpesaWebhook,
    MpesaClient,
    MpesaWebhook
};