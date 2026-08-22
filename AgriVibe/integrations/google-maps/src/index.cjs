const { Client } = require('@googlemaps/google-maps-services-js');

class GoogleMapsService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.client = new Client({});
    }

    // Geocode: Convert address to coordinates
    async geocode(address) {
        try {
            const response = await this.client.geocode({
                params: {
                    address: address,
                    key: this.apiKey
                }
            });

            if (response.data.status === 'OK') {
                const location = response.data.results[0].geometry.location;
                return {
                    success: true,
                    latitude: location.lat,
                    longitude: location.lng,
                    formattedAddress: response.data.results[0].formatted_address,
                    placeId: response.data.results[0].place_id
                };
            } else {
                return {
                    success: false,
                    error: response.data.status
                };
            }
        } catch (error) {
            console.error('Geocode error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Reverse Geocode: Convert coordinates to address
    async reverseGeocode(lat, lng) {
        try {
            const response = await this.client.reverseGeocode({
                params: {
                    latlng: `${lat},${lng}`,
                    key: this.apiKey
                }
            });

            if (response.data.status === 'OK') {
                return {
                    success: true,
                    address: response.data.results[0].formatted_address,
                    placeId: response.data.results[0].place_id,
                    components: response.data.results[0].address_components
                };
            } else {
                return {
                    success: false,
                    error: response.data.status
                };
            }
        } catch (error) {
            console.error('Reverse geocode error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Distance Matrix: Calculate distance between two locations
    async getDistance(origin, destination) {
        try {
            const response = await this.client.distancematrix({
                params: {
                    origins: [origin],
                    destinations: [destination],
                    key: this.apiKey,
                    units: 'metric'
                }
            });

            if (response.data.status === 'OK') {
                const element = response.data.rows[0].elements[0];
                if (element.status === 'OK') {
                    return {
                        success: true,
                        distance: element.distance.text,
                        distanceMeters: element.distance.value,
                        duration: element.duration.text,
                        durationSeconds: element.duration.value
                    };
                } else {
                    return {
                        success: false,
                        error: element.status
                    };
                }
            } else {
                return {
                    success: false,
                    error: response.data.status
                };
            }
        } catch (error) {
            console.error('Distance matrix error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Place Autocomplete
    async autocomplete(input, bounds = null) {
        try {
            const params = {
                input: input,
                key: this.apiKey
            };
            if (bounds) {
                params.bounds = bounds;
            }

            const response = await this.client.placeAutocomplete({
                params: params
            });

            if (response.data.status === 'OK') {
                return {
                    success: true,
                    predictions: response.data.predictions.map(p => ({
                        description: p.description,
                        placeId: p.place_id,
                        mainText: p.structured_formatting.main_text,
                        secondaryText: p.structured_formatting.secondary_text
                    }))
                };
            } else {
                return {
                    success: false,
                    error: response.data.status
                };
            }
        } catch (error) {
            console.error('Autocomplete error:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

function createGoogleMapsService(apiKey) {
    return new GoogleMapsService(apiKey);
}

module.exports = {
    createGoogleMapsService,
    GoogleMapsService
};