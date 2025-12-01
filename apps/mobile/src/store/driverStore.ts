import { create } from 'zustand';

interface DriverState {
    isOnline: boolean;
    location: { latitude: number; longitude: number } | null;
    earnings: {
        today: number;
        week: number;
    };
    toggleOnline: () => void;
    updateLocation: (lat: number, lng: number) => void;
}

export const useDriverStore = create<DriverState>((set) => ({
    isOnline: false,
    location: null,
    earnings: {
        today: 12500,
        week: 85000,
    },
    toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
    updateLocation: (latitude, longitude) => set({ location: { latitude, longitude } }),
}));
