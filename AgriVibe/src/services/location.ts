// src/services/location.ts
import api from './api';

export interface Location {
  latitude: number;
  longitude: number;
  campus?: string;
  city?: string;
  address?: string;
}

export interface UserLocationResponse {
  id: string;
  latitude: number | null;
  longitude: number | null;
  location_address: string | null;
  location_updated_at: string | null;
  location_sharing_enabled: boolean;
}

/**
 * Get user's location using browser geolocation API
 */
export const getBrowserLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

/**
 * Get location from IP address (fallback)
 */
export const getIPLocation = async (): Promise<Location> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
    };
  } catch (error) {
    console.error('Failed to get IP location:', error);
    throw error;
  }
};

/**
 * Calculate distance between two coordinates in km
 */
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Save user location to backend
 */
export const saveUserLocation = async (location: Location): Promise<UserLocationResponse> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await api.put('/auth/location', {
      latitude: location.latitude,
      longitude: location.longitude,
      location_address: location.address || '',
    });

    // Save to localStorage for quick access
    localStorage.setItem('userLocation', JSON.stringify(location));

    return response.data.user;
  } catch (error) {
    console.error('Failed to save location:', error);
    throw error;
  }
};

/**
 * Get user location from backend
 */
export const getUserLocation = async (): Promise<UserLocationResponse | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await api.get('/auth/location');
    return response.data.location;
  } catch (error) {
    console.error('Failed to get location:', error);
    return null;
  }
};

/**
 * Get saved user location from localStorage
 */
export const getSavedLocation = (): Location | null => {
  try {
    const data = localStorage.getItem('userLocation');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to get saved location:', error);
  }
  return null;
};

/**
 * Toggle location sharing
 */
export const toggleLocationSharing = async (enabled: boolean): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await api.put('/auth/location/toggle', { enabled });
    return response.data.location_sharing_enabled;
  } catch (error) {
    console.error('Failed to toggle location sharing:', error);
    throw error;
  }
};