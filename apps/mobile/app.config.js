import Constants from 'expo-constants';

export default {
    name: 'ADLgo',
    slug: 'adlgo',
    version: '1.0.0',
    orientation: 'portrait',
    main: 'index.ts',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.adlgo.app'
    },
    android: {
        versionCode: 1,
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff'
        },
        package: 'com.adlgo.app',
        permissions: [
            'ACCESS_FINE_LOCATION',
            'ACCESS_COARSE_LOCATION',
            'CAMERA',
            'INTERNET'
        ]
    },
    web: {
        favicon: './assets/favicon.png'
    },
    extra: {
        eas: {
            projectId: "272043ff-5973-4a75-8b3e-3e9a28600d49"
        },
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    }
};
