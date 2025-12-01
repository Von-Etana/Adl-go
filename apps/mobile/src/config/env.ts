// Environment configuration for the mobile app
// This file provides access to environment variables in a type-safe way

interface AppConfig {
    API_URL: string;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    GOOGLE_MAPS_API_KEY: string;
    SOCKET_URL: string;
}

// For development, use these values
// For production builds, these will be replaced by EAS secrets
const config: AppConfig = {
    // Backend API URL
    API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',

    // Supabase configuration
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',

    // Google Maps API Key
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',

    // WebSocket URL
    SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000',
};

// Validate required environment variables
const validateConfig = () => {
    const missing: string[] = [];

    if (!config.SUPABASE_URL) missing.push('EXPO_PUBLIC_SUPABASE_URL');
    if (!config.SUPABASE_ANON_KEY) missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');

    if (missing.length > 0) {
        console.warn(
            `⚠️  Missing environment variables: ${missing.join(', ')}\n` +
            'Some features may not work correctly.\n' +
            'See APK_QUICK_START.md for configuration instructions.'
        );
    }
};

// Run validation in development
if (__DEV__) {
    validateConfig();
}

export default config;
