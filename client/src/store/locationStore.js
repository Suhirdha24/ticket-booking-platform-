import { create } from 'zustand';

const LOCATION_STORAGE_KEY = 'eventlinqs_selected_city';

export const MAJOR_CITIES = [
  'All Cities',
  'Bengaluru',
  'Mumbai',
  'Chennai',
  'Delhi',
  'Hyderabad',
  'Pune',
  'Kochi',
  'Coimbatore',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Goa',
  'Indore',
  'Lucknow',
];

function getInitialCity() {
  try {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    return saved || 'All Cities';
  } catch {
    return 'All Cities';
  }
}

export const useLocationStore = create((set) => ({
  selectedCity: getInitialCity(),
  isDetecting: false,
  isLocationModalOpen: false,

  setCity: (city) => {
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, city);
    } catch {}
    set({ selectedCity: city, isLocationModalOpen: false });
  },

  openLocationModal: () => set({ isLocationModalOpen: true }),
  closeLocationModal: () => set({ isLocationModalOpen: false }),

  detectCurrentLocation: () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    set({ isDetecting: true });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Reverse geocode via free OpenStreetMap Nominatim API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const detectedCity =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.state ||
            'Bengaluru';

          // Match closest major city or use detected name
          const matched = MAJOR_CITIES.find(
            (c) => c.toLowerCase() === detectedCity.toLowerCase()
          );

          const finalCity = matched || detectedCity;
          try {
            localStorage.setItem(LOCATION_STORAGE_KEY, finalCity);
          } catch {}

          set({ selectedCity: finalCity, isDetecting: false, isLocationModalOpen: false });
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
          set({ isDetecting: false });
        }
      },
      (error) => {
        console.warn('Geolocation permission denied or timed out:', error);
        set({ isDetecting: false });
      },
      { timeout: 8000 }
    );
  },
}));
