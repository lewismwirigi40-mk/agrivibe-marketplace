// src/components/LocationSelector.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Crosshair, 
  ChevronDown, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { 
  getBrowserLocation, 
  getIPLocation, 
  saveUserLocation, 
  getSavedLocation,
  getUserLocation 
} from '../services/location';

interface LocationSelectorProps {
  onLocationSet?: (location: any) => void;
  onClose?: () => void;
}

export default function LocationSelector({ onLocationSet, onClose }: LocationSelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  // ✅ UPDATED: Full list of campuses with coordinates
  const campusCoords: Record<string, { lat: number; lng: number }> = {
    'DeKUT': { lat: -0.4201, lng: 36.9479 },
    'JKUAT': { lat: -1.0167, lng: 37.1833 },
    'KU': { lat: -1.1833, lng: 36.9167 },
    'UON': { lat: -1.2833, lng: 36.8167 },
    'MMUST': { lat: 0.2869, lng: 34.7522 },
    'TUK': { lat: -1.2921, lng: 36.8219 },
    'Kenyatta University': { lat: -1.1833, lng: 36.9167 },
    'Moi University': { lat: 0.2869, lng: 35.2769 },
    'Daystar University': { lat: -1.3019, lng: 36.7630 },
    'Strathmore University': { lat: -1.3037, lng: 36.7816 },
    'USIU': { lat: -1.2481, lng: 36.8035 },
    'Murang\'a University': { lat: -0.7222, lng: 37.1523 },
    'KCA University': { lat: -1.2827, lng: 36.8178 },
    'Africa Nazarene University': { lat: -1.3586, lng: 36.7939 },
    'Zetech University': { lat: -1.2196, lng: 36.8070 },
    'Mount Kenya University': { lat: -0.2869, lng: 36.8363 },
    'Kibabii University': { lat: 0.4588, lng: 34.6215 },
    'Machakos University': { lat: -1.5148, lng: 37.2680 },
  };

  const campuses = Object.keys(campusCoords);

  // Check for saved location on mount
  useEffect(() => {
    const saved = getSavedLocation();
    if (saved) {
      setSelectedCampus(saved.campus || '');
      setCurrentLocation(saved);
      if (onLocationSet) onLocationSet(saved);
    }
  }, []);

  const handleDetectLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await getBrowserLocation();
      const campus = await getCampusFromCoords(location.latitude, location.longitude);
      
      const locationData = {
        ...location,
        campus: campus || 'Unknown',
      };

      await saveUserLocation(locationData);
      setCurrentLocation(locationData);
      setShowSuccess(true);
      setSelectedCampus(campus || '');
      
      if (onLocationSet) onLocationSet(locationData);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      try {
        const ipLocation = await getIPLocation();
        const locationData = {
          ...ipLocation,
          campus: ipLocation.city || 'Unknown',
        };
        await saveUserLocation(locationData);
        setCurrentLocation(locationData);
        setShowSuccess(true);
        setSelectedCampus(ipLocation.city || '');
        if (onLocationSet) onLocationSet(locationData);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (ipErr) {
        setError('Could not detect your location. Please select it manually.');
        setShowManual(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSelect = async () => {
    if (!selectedCampus) {
      setError('Please select a campus');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const coords = campusCoords[selectedCampus];
      if (coords) {
        const locationData = {
          latitude: coords.lat,
          longitude: coords.lng,
          campus: selectedCampus,
        };
        await saveUserLocation(locationData);
        setCurrentLocation(locationData);
        setShowSuccess(true);
        if (onLocationSet) onLocationSet(locationData);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      setError('Failed to save location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCampusFromCoords = async (lat: number, lng: number): Promise<string> => {
    const campusMap = [
      { name: 'DeKUT', lat: -0.4201, lng: 36.9479, radius: 5 },
      { name: 'JKUAT', lat: -1.0167, lng: 37.1833, radius: 5 },
      { name: 'KU', lat: -1.1833, lng: 36.9167, radius: 5 },
      { name: 'UON', lat: -1.2833, lng: 36.8167, radius: 5 },
      { name: 'MMUST', lat: 0.2869, lng: 34.7522, radius: 5 },
      { name: 'TUK', lat: -1.2921, lng: 36.8219, radius: 5 },
      { name: 'Kenyatta University', lat: -1.1833, lng: 36.9167, radius: 5 },
      { name: 'Moi University', lat: 0.2869, lng: 35.2769, radius: 5 },
      { name: 'Daystar University', lat: -1.3019, lng: 36.7630, radius: 5 },
      { name: 'Strathmore University', lat: -1.3037, lng: 36.7816, radius: 5 },
      { name: 'USIU', lat: -1.2481, lng: 36.8035, radius: 5 },
      { name: 'Murang\'a University', lat: -0.7222, lng: 37.1523, radius: 5 },
      { name: 'KCA University', lat: -1.2827, lng: 36.8178, radius: 5 },
    ];

    for (const campus of campusMap) {
      const distance = getDistance(lat, lng, campus.lat, campus.lng);
      if (distance < campus.radius) {
        return campus.name;
      }
    }
    return 'Unknown';
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-agrivibe-green to-emerald-500 rounded-xl flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Your Location</h3>
          <p className="text-sm text-gray-500">Set your campus to see nearby vendors</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 mb-4"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-700">
              Location saved! {selectedCampus}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {currentLocation && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            <span className="font-medium">📍 Current:</span> {currentLocation.campus || 'Unknown'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {currentLocation.latitude}, {currentLocation.longitude}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleDetectLocation}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <Crosshair className="w-5 h-5" />
              Detect My Location
            </>
          )}
        </button>

        <button
          onClick={() => setShowManual(!showManual)}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${showManual ? 'rotate-180' : ''}`} />
          Select Campus Manually
        </button>

        <AnimatePresence>
          {showManual && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3">
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-agrivibe-green focus:shadow-lg focus:shadow-agrivibe-green/10 outline-none transition-all"
                >
                  <option value="">Select your campus</option>
                  {campuses.map((campus) => (
                    <option key={campus} value={campus}>
                      {campus}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleManualSelect}
                  disabled={isLoading || !selectedCampus}
                  className="w-full bg-gradient-to-r from-agrivibe-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-agrivibe-green/30 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Location'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}