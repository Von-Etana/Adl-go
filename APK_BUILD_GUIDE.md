# APK Build Guide for ADLgo Mobile App

This guide explains how to build an APK file for the ADLgo mobile application.

## Prerequisites

1. **Node.js and npm** - Already installed
2. **Expo CLI** - Install globally if not already installed
3. **EAS CLI** - Expo Application Services CLI for building
4. **Expo Account** - Free account at expo.dev

## Setup Steps

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

If you don't have an Expo account, create one at https://expo.dev/signup

### 3. Configure Your Project

The following files have been created/updated:
- `eas.json` - Build configuration with three profiles (development, preview, production)
- `app.json` - Updated with Android package name and permissions

## Building the APK

### Option 1: Preview Build (Recommended for Testing)

This creates an APK that can be installed on any Android device for testing:

```bash
cd apps/mobile
eas build --profile preview --platform android
```

### Option 2: Development Build

For development with debugging capabilities:

```bash
cd apps/mobile
eas build --profile development --platform android
```

### Option 3: Production Build

For final production release:

```bash
cd apps/mobile
eas build --profile production --platform android
```

## Build Process

1. EAS will ask you to configure the project (first time only)
2. It will upload your code to Expo's build servers
3. The build process takes 10-20 minutes
4. Once complete, you'll get a download link for the APK

## Local Build (Alternative)

If you prefer to build locally without using EAS:

### Prerequisites for Local Build
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK) installed

### Steps:

1. **Install expo-dev-client**:
```bash
cd apps/mobile
npx expo install expo-dev-client
```

2. **Prebuild the native Android project**:
```bash
npx expo prebuild --platform android
```

3. **Build the APK locally**:
```bash
cd android
./gradlew assembleRelease
```

The APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

## Important Notes

### Environment Variables
Make sure to configure your environment variables in `app.json` or use EAS Secrets:

```bash
eas secret:create --scope project --name SUPABASE_URL --value "your-url"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "your-key"
```

### App Signing
- For production builds, you'll need to configure app signing
- EAS can manage this automatically or you can provide your own keystore

### Testing the APK
1. Download the APK from the EAS build link
2. Transfer to your Android device
3. Enable "Install from Unknown Sources" in Android settings
4. Install and test the app

## Troubleshooting

### Build Fails
- Check the build logs in the EAS dashboard
- Ensure all dependencies are compatible
- Verify app.json configuration

### APK Won't Install
- Check Android version compatibility
- Verify app permissions in app.json
- Ensure the APK is not corrupted

### App Crashes on Launch
- Check for missing environment variables
- Verify all native modules are properly linked
- Review crash logs using `adb logcat`

## Next Steps

After building:
1. Test the APK thoroughly on multiple devices
2. Fix any issues found during testing
3. Build a production version when ready
4. Submit to Google Play Store (optional)

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo App Configuration](https://docs.expo.dev/versions/latest/config/app/)
- [Android Build Process](https://docs.expo.dev/build-reference/android-builds/)
