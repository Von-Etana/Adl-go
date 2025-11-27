# 🎉 APK Build Setup Complete!

Your ADLgo mobile app is now fully configured for APK building. Here's everything you need to know.

---

## 📦 What Was Done

### 1. Build Configuration Files Created
- ✅ **`eas.json`** - EAS Build configuration with 3 profiles (development, preview, production)
- ✅ **`app.json`** - Updated with Android package name, version, and permissions
- ✅ **`.env.example`** - Environment variables template

### 2. Code Improvements
- ✅ **`src/config/env.ts`** - Centralized environment configuration
- ✅ **`src/services/api.ts`** - Updated to use environment variables
- ✅ **`src/services/socket.ts`** - Updated to use environment variables

### 3. Documentation Created
- ✅ **`APK_QUICK_START.md`** - Quick reference guide
- ✅ **`APK_BUILD_GUIDE.md`** - Comprehensive build documentation
- ✅ **`build-apk.ps1`** - Interactive build script

### 4. Configuration Details
- **Package Name**: `com.adlgo.mobile`
- **Version**: 1.0.0
- **Version Code**: 1
- **Permissions**: Location, Camera, Internet

---

## 🚀 How to Build Your APK

### Quick Method (Recommended)
```powershell
.\build-apk.ps1
```
This interactive script will guide you through the build process.

### Manual Method

#### Step 1: Configure Environment (First Time Only)
```bash
cd apps\mobile
eas build:configure
```
Choose the **adlgo-app** account when prompted.

#### Step 2: Build APK
```bash
# For testing (recommended first)
eas build --profile preview --platform android

# For development
eas build --profile development --platform android

# For production
eas build --profile production --platform android
```

---

## ⚙️ Environment Variables Setup

### For Local Development
Create a `.env` file in `apps/mobile/`:
```bash
cp .env.example .env
```
Then fill in your actual values.

### For EAS Builds (Production)
Set secrets using EAS CLI:
```bash
# Backend API URL
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://your-api.com/api"

# Supabase
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://your-project.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-key"

# Google Maps
eas secret:create --scope project --name EXPO_PUBLIC_GOOGLE_MAPS_API_KEY --value "your-key"

# WebSocket
eas secret:create --scope project --name EXPO_PUBLIC_SOCKET_URL --value "https://your-api.com"
```

---

## 📱 Build Process Timeline

1. **Initiate Build** (1 minute)
   - Upload code to EAS servers
   - Validate configuration

2. **Install Dependencies** (3-5 minutes)
   - npm install
   - Download native dependencies

3. **Compile Native Code** (5-10 minutes)
   - Build Android native modules
   - Compile Java/Kotlin code

4. **Bundle JavaScript** (2-3 minutes)
   - Bundle React Native code
   - Optimize assets

5. **Sign & Package** (1-2 minutes)
   - Sign APK
   - Create final package

**Total Time**: ~10-20 minutes

---

## 📥 Installing the APK

### On Physical Device

1. **Download APK**
   - Click the link from EAS build output
   - Or download from expo.dev dashboard

2. **Transfer to Device**
   - USB transfer
   - Email to yourself
   - Cloud storage (Google Drive, Dropbox)

3. **Enable Installation**
   - Settings → Security → Unknown Sources (ON)
   - Or Settings → Apps → Special Access → Install Unknown Apps

4. **Install**
   - Open the APK file
   - Tap "Install"
   - Wait for installation to complete

### On Emulator

1. **Start Android Emulator**
2. **Drag and drop APK** onto emulator window
3. **APK installs automatically**

---

## 🔍 Monitoring Your Build

### In Terminal
The build progress will be shown in your terminal with real-time updates.

### On Web Dashboard
Visit: https://expo.dev/accounts/von-etana/projects

Here you can:
- View build logs
- Download APKs
- See build history
- Monitor build queue

---

## 🐛 Common Issues & Solutions

### Issue: "Not logged in"
**Solution**:
```bash
eas login
```

### Issue: "No project found"
**Solution**:
```bash
cd apps\mobile
eas build:configure
```

### Issue: Build fails with "Missing credentials"
**Solution**:
Let EAS manage credentials automatically (choose "Yes" when prompted)

### Issue: APK won't install on device
**Solutions**:
- Enable "Unknown Sources" in Android settings
- Check minimum Android version compatibility
- Verify APK is not corrupted (re-download)

### Issue: App crashes on launch
**Solutions**:
- Check environment variables are set correctly
- View crash logs: `adb logcat`
- Ensure all required permissions are granted

---

## 📊 Build Profiles Comparison

| Feature | Development | Preview | Production |
|---------|------------|---------|------------|
| **Purpose** | Active development | Testing | Release |
| **Size** | Larger | Medium | Optimized |
| **Debug Tools** | ✅ Yes | ❌ No | ❌ No |
| **Performance** | Slower | Fast | Fastest |
| **Best For** | Developers | QA/Testers | End Users |
| **Signing** | Dev keystore | Managed | Production keystore |

---

## 🎯 Next Steps

### Immediate Actions
1. ✅ **Build a preview APK** for testing
   ```bash
   cd apps\mobile
   eas build --profile preview --platform android
   ```

2. ✅ **Test on real device**
   - Install the APK
   - Test all features
   - Check for crashes

3. ✅ **Set up environment variables**
   - Create `.env` file for local dev
   - Set EAS secrets for production builds

### After Testing
4. **Fix any issues** found during testing
5. **Build production APK** when ready
6. **Prepare for Play Store** (optional)
   - Create app listing
   - Prepare screenshots
   - Write description

---

## 📚 Additional Resources

### Documentation
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [App Configuration](https://docs.expo.dev/versions/latest/config/app/)
- [Environment Variables](https://docs.expo.dev/guides/environment-variables/)

### Your Project Files
- `APK_QUICK_START.md` - Quick reference
- `APK_BUILD_GUIDE.md` - Detailed guide
- `.env.example` - Environment template

### Dashboards
- [Expo Dashboard](https://expo.dev/accounts/von-etana/projects)
- [Build History](https://expo.dev/accounts/von-etana/projects/mobile/builds)

---

## 💡 Pro Tips

1. **First Build**: Always start with a preview build to test
2. **Environment Variables**: Set them up before building
3. **Build Queue**: Builds are queued, so be patient during busy times
4. **Caching**: Subsequent builds are faster due to caching
5. **Updates**: Use `eas update` for OTA updates after initial install
6. **Testing**: Test on multiple devices and Android versions
7. **Logs**: Always check build logs if something fails

---

## 🎊 You're Ready!

Everything is set up and ready to go. To build your first APK, simply run:

```powershell
.\build-apk.ps1
```

Or use the manual commands in the sections above.

**Good luck with your build!** 🚀

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the build logs at expo.dev
3. Consult the APK_BUILD_GUIDE.md for detailed information
4. Check Expo documentation

**Current Status**:
- ✅ EAS CLI: Installed (v16.28.0)
- ✅ Logged in as: von-etana
- ✅ Available accounts: von-etana, adl-go, adlgo-app
- ✅ Configuration: Complete
- ✅ Ready to build: YES!
