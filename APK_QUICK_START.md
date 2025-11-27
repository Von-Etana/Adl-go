# APK Build - Quick Start

## ✅ Setup Complete!

Your ADLgo mobile app is now configured for APK building. Here's what has been set up:

### Files Created/Updated:
1. **`eas.json`** - Build configuration with 3 profiles
2. **`app.json`** - Updated with Android package info and permissions
3. **`APK_BUILD_GUIDE.md`** - Comprehensive build documentation
4. **`build-apk.ps1`** - Interactive build script

### Current Status:
- ✅ EAS CLI installed (v16.28.0)
- ✅ Logged in as: **von-etana**
- ✅ Available accounts: von-etana, adl-go, adlgo-app
- ✅ Build configuration ready

---

## 🚀 Build Your APK Now

### Method 1: Using the Interactive Script (Easiest)

```powershell
.\build-apk.ps1
```

This will show you a menu with options to build preview, development, or production APKs.

### Method 2: Direct Commands

#### For Testing (Recommended First):
```bash
cd apps\mobile
eas build --profile preview --platform android
```

#### For Development:
```bash
cd apps\mobile
eas build --profile development --platform android
```

#### For Production:
```bash
cd apps\mobile
eas build --profile production --platform android
```

---

## 📋 What Happens During Build

1. **Project Configuration** (First time only)
   - EAS will ask which account to use (choose: adl-go or adlgo-app)
   - It will generate an app identifier if needed

2. **Code Upload**
   - Your code is uploaded to Expo's build servers
   - Dependencies are installed

3. **Build Process**
   - Takes approximately 10-20 minutes
   - You can monitor progress in the terminal or at expo.dev

4. **Download APK**
   - You'll receive a download link
   - APK can be installed on any Android device

---

## 📱 Installing the APK

1. Download the APK from the build link
2. Transfer to your Android device (via USB, email, or cloud)
3. On your device:
   - Go to Settings → Security
   - Enable "Install from Unknown Sources"
4. Open the APK file and install

---

## ⚙️ Build Profiles Explained

### Preview Build
- **Purpose**: Testing on real devices
- **Output**: APK file
- **Best for**: Sharing with testers, QA
- **Signing**: Managed by Expo

### Development Build
- **Purpose**: Development and debugging
- **Output**: APK with dev tools
- **Best for**: Active development
- **Features**: Debugging, hot reload

### Production Build
- **Purpose**: Final release
- **Output**: Optimized APK
- **Best for**: Play Store submission
- **Signing**: Production keystore

---

## 🔧 Important Configuration

### Package Name
```
com.adlgo.mobile
```

### Permissions Included
- ACCESS_FINE_LOCATION (for delivery tracking)
- ACCESS_COARSE_LOCATION (for general location)
- CAMERA (for KYC, photo uploads)
- INTERNET (for API calls)

### Version Info
- Version: 1.0.0
- Version Code: 1

---

## 🌐 Environment Variables

Before building, ensure your environment variables are set. You can either:

### Option 1: Use EAS Secrets (Recommended)
```bash
eas secret:create --scope project --name SUPABASE_URL --value "your-url"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "your-key"
eas secret:create --scope project --name GOOGLE_MAPS_API_KEY --value "your-key"
```

### Option 2: Add to app.json
```json
{
  "expo": {
    "extra": {
      "SUPABASE_URL": "your-url",
      "SUPABASE_ANON_KEY": "your-key"
    }
  }
}
```

---

## 🐛 Troubleshooting

### Build Fails
- Check build logs at expo.dev
- Verify all dependencies are compatible
- Ensure app.json is valid JSON

### "Not logged in" Error
```bash
eas login
```

### "No project found" Error
```bash
cd apps\mobile
eas build:configure
```

### APK Won't Install
- Check Android version (minimum required)
- Enable "Unknown Sources"
- Verify APK is not corrupted

---

## 📚 Next Steps

1. **Build a preview APK** to test on your device
2. **Test all features** thoroughly
3. **Fix any issues** found during testing
4. **Build production APK** when ready
5. **Submit to Google Play Store** (optional)

---

## 🔗 Useful Links

- [EAS Build Dashboard](https://expo.dev/accounts/von-etana/projects)
- [Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android Permissions](https://docs.expo.dev/versions/latest/config/app/#permissions)

---

## 💡 Tips

- **First build**: Choose the "adlgo-app" account when prompted
- **Build time**: Usually 10-20 minutes, be patient
- **Testing**: Always test on multiple devices
- **Updates**: Use `eas update` for OTA updates after initial install

---

**Ready to build?** Run `.\build-apk.ps1` or use the commands above! 🚀
