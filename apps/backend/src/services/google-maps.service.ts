import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api';

export class GoogleMapsService {
    /**
     * Get distance and duration between two points
     */
    async getDistanceMatrix(
        origins: { lat: number; lng: number }[],
        destinations: { lat: number; lng: number }[]
    ): Promise<{
        distance: number;
        duration: number;
        distanceText: string;
        durationText: string;
    }> {
        try {
            const originsStr = origins.map((o) => `${o.lat},${o.lng}`).join('|');
            const destinationsStr = destinations.map((d) => `${d.lat},${d.lng}`).join('|');

            const response = await axios.get(
                `${GOOGLE_MAPS_BASE_URL}/distancematrix/json`,
                {
                    params: {
                        origins: originsStr,
                        destinations: destinationsStr,
                        key: GOOGLE_MAPS_API_KEY,
                        mode: 'driving',
                    },
                }
            );

            const element = response.data.rows[0].elements[0];

            if (element.status !== 'OK') {
                throw new Error('Unable to calculate distance');
            }

            return {
                distance: element.distance.value, // in meters
                duration: element.duration.value, // in seconds
                distanceText: element.distance.text,
                durationText: element.duration.text,
            };
        } catch (error: any) {
            console.error('Google Maps Distance Error:', error.response?.data || error.message);
            throw new Error('Failed to calculate distance');
        }
    }

    /**
     * Get directions between two points
     */
    async getDirections(
        origin: { lat: number; lng: number },
        destination: { lat: number; lng: number }
    ): Promise<{
        polyline: string;
        distance: number;
        duration: number;
        steps: Array<{ instruction: string; distance: string; duration: string }>;
    }> {
        try {
            const response = await axios.get(
                `${GOOGLE_MAPS_BASE_URL}/directions/json`,
                {
                    params: {
                        origin: `${origin.lat},${origin.lng}`,
                        destination: `${destination.lat},${destination.lng}`,
                        key: GOOGLE_MAPS_API_KEY,
                        mode: 'driving',
                    },
                }
            );

            if (response.data.status !== 'OK') {
                throw new Error('Unable to get directions');
            }

            const route = response.data.routes[0];
            const leg = route.legs[0];

            return {
                polyline: route.overview_polyline.points,
                distance: leg.distance.value,
                duration: leg.duration.value,
                steps: leg.steps.map((step: any) => ({
                    instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
                    distance: step.distance.text,
                    duration: step.duration.text,
                })),
            };
        } catch (error: any) {
            console.error('Google Maps Directions Error:', error.response?.data || error.message);
            throw new Error('Failed to get directions');
        }
    }

    /**
     * Geocode address to coordinates
     */
    async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
        try {
            const response = await axios.get(
                `${GOOGLE_MAPS_BASE_URL}/geocode/json`,
                {
                    params: {
                        address,
                        key: GOOGLE_MAPS_API_KEY,
                    },
                }
            );

            if (response.data.status !== 'OK') {
                throw new Error('Unable to geocode address');
            }

            const location = response.data.results[0].geometry.location;

            return {
                lat: location.lat,
                lng: location.lng,
            };
        } catch (error: any) {
            console.error('Google Maps Geocode Error:', error.response?.data || error.message);
            throw new Error('Failed to geocode address');
        }
    }

    /**
     * Reverse geocode coordinates to address
     */
    async reverseGeocode(lat: number, lng: number): Promise<string> {
        try {
            const response = await axios.get(
                `${GOOGLE_MAPS_BASE_URL}/geocode/json`,
                {
                    params: {
                        latlng: `${lat},${lng}`,
                        key: GOOGLE_MAPS_API_KEY,
                    },
                }
            );

            if (response.data.status !== 'OK') {
                throw new Error('Unable to reverse geocode');
            }

            return response.data.results[0].formatted_address;
        } catch (error: any) {
            console.error('Google Maps Reverse Geocode Error:', error.response?.data || error.message);
            throw new Error('Failed to reverse geocode');
        }
    }

    /**
     * Find nearby drivers
     */
    async findNearbyDrivers(
        location: { lat: number; lng: number },
        radius: number = 5000 // 5km default
    ): Promise<any[]> {
        // This would typically query your database for drivers within radius
        // and use Google Maps to calculate actual driving distance
        // For now, return empty array
        return [];
    }

    /**
     * Calculate delivery price based on distance
     */
    calculatePrice(distanceInMeters: number, vehicleType: string): number {
        const distanceInKm = distanceInMeters / 1000;

        // Base prices per km
        const pricePerKm: Record<string, number> = {
            bike: 150,
            car: 250,
            van: 400,
            truck: 600,
        };

        const basePrice = 500; // Minimum charge
        const rate = pricePerKm[vehicleType] || pricePerKm.car;

        return Math.max(basePrice, Math.ceil(distanceInKm * rate));
    }
}
