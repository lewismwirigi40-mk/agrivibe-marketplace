const { createGoogleMapsService } = require('../../../integrations/google-maps/src/index.cjs');

let mapsService = null;

function initMaps(config) {
    mapsService = createGoogleMapsService(config.GOOGLE_MAPS_API_KEY);
    return mapsService;
}

function getMapsService() {
    if (!mapsService) {
        throw new Error('Maps service not initialized');
    }
    return mapsService;
}

// Geocode address to coordinates
async function geocodeAddress(address) {
    try {
        const service = getMapsService();
        return await service.geocode(address);
    } catch (error) {
        console.error('Geocode address error:', error);
        return { success: false, error: error.message };
    }
}

// Reverse geocode coordinates to address
async function reverseGeocode(lat, lng) {
    try {
        const service = getMapsService();
        return await service.reverseGeocode(lat, lng);
    } catch (error) {
        console.error('Reverse geocode error:', error);
        return { success: false, error: error.message };
    }
}

// Get distance between two locations
async function getLocationDistance(origin, destination) {
    try {
        const service = getMapsService();
        return await service.getDistance(origin, destination);
    } catch (error) {
        console.error('Get distance error:', error);
        return { success: false, error: error.message };
    }
}

// Autocomplete address
async function autocompleteAddress(input) {
    try {
        const service = getMapsService();
        return await service.autocomplete(input);
    } catch (error) {
        console.error('Autocomplete error:', error);
        return { success: false, error: error.message };
    }
}

// Calculate distance between two coordinates (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

module.exports = {
    initMaps,
    getMapsService,
    geocodeAddress,
    reverseGeocode,
    getLocationDistance,
    autocompleteAddress,
    calculateDistance
};