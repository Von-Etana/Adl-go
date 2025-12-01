import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    fullName: string;
    phoneNumber: string;
    profilePhotoUrl?: string;
    role: 'customer' | 'driver';
    email?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: {
                id: '1',
                fullName: 'Tunde',
                phoneNumber: '+2348000000000',
                role: 'customer',
            }, // Mock initial user
            token: 'mock-token',
            isAuthenticated: true, // Mock authenticated state
            login: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
