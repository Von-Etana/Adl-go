# APK Build Checklist

Use this checklist to ensure you have everything ready before building your APK.

## Pre-Build Checklist

### ✅ Environment Setup
- [ ] EAS CLI installed (`eas --version`)
- [ ] Logged into Expo account (`eas whoami`)
- [ ] Project configured (`eas.json` exists)
- [ ] App configuration updated (`app.json` has package name)

### ✅ Environment Variables
- [ ] `.env.example` reviewed
- [ ] `.env` file created (for local dev)
- [ ] Backend API URL configured
- [ ] Supabase credentials set
- [ ] Google Maps API key set
- [ ] WebSocket URL configured

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] App runs successfully on web (`npm run web`)
- [ ] No critical console errors
- [ ] All features tested locally

### ✅ Assets
- [ ] App icon exists (`assets/icon.png`)
- [ ] Splash screen exists (`assets/splash-icon.png`)
- [ ] Adaptive icon exists (`assets/adaptive-icon.png`)
- [ ] All required images present

### ✅ Configuration Review
- [ ] Package name is correct (`com.adlgo.mobile`)
- [ ] Version number is correct (1.0.0)
- [ ] Version code is correct (1)
- [ ] Permissions are appropriate
- [ ] App name is correct

## Build Process Checklist

### For Preview Build (Testing)
- [ ] Navigate to mobile directory (`cd apps\mobile`)
- [ ] Run build command (`eas build --profile preview --platform android`)
- [ ] Select correct account (adlgo-app)
- [ ] Wait for build to complete (~15 minutes)
- [ ] Download APK from provided link
- [ ] Save APK to safe location

### For Production Build
- [ ] All preview testing completed
- [ ] All bugs fixed
- [ ] Environment variables set in EAS
- [ ] Run build command (`eas build --profile production --platform android`)
- [ ] Wait for build to complete
- [ ] Download and archive APK

## Post-Build Checklist

### Testing
- [ ] APK downloaded successfully
- [ ] APK transferred to test device
- [ ] "Unknown Sources" enabled on device
- [ ] APK installed successfully
- [ ] App launches without crashes
- [ ] Login/Authentication works
- [ ] Location services work
- [ ] Camera/Image picker works
- [ ] Maps display correctly
- [ ] API calls succeed
- [ ] WebSocket connection works
- [ ] All main features tested
- [ ] Performance is acceptable
- [ ] No critical bugs found

### Documentation
- [ ] Build notes documented
- [ ] Known issues listed
- [ ] Version changelog updated
- [ ] Testing results recorded

### Distribution (if applicable)
- [ ] APK shared with testers
- [ ] Feedback collection method set up
- [ ] Bug tracking system ready

## Environment Variables Checklist

### Required for Production Build
```bash
# Check if these are set in EAS:
eas secret:list

# Should see:
- [ ] EXPO_PUBLIC_API_URL
- [ ] EXPO_PUBLIC_SUPABASE_URL
- [ ] EXPO_PUBLIC_SUPABASE_ANON_KEY
- [ ] EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
- [ ] EXPO_PUBLIC_SOCKET_URL
```

## Troubleshooting Checklist

If build fails:
- [ ] Check build logs in terminal
- [ ] Check build logs at expo.dev
- [ ] Verify all dependencies are compatible
- [ ] Ensure app.json is valid JSON
- [ ] Check for TypeScript errors
- [ ] Verify environment variables

If APK won't install:
- [ ] "Unknown Sources" enabled
- [ ] Sufficient storage on device
- [ ] Android version compatible
- [ ] APK not corrupted (re-download)
- [ ] Previous version uninstalled (if upgrading)

If app crashes:
- [ ] Check device logs (`adb logcat`)
- [ ] Verify environment variables
- [ ] Check API endpoints are accessible
- [ ] Ensure all permissions granted
- [ ] Review crash reports

## Quick Commands Reference

```bash
# Check EAS CLI version
eas --version

# Check login status
eas whoami

# Build preview APK
cd apps\mobile
eas build --profile preview --platform android

# Build production APK
cd apps\mobile
eas build --profile production --platform android

# Set environment variable
eas secret:create --scope project --name VAR_NAME --value "value"

# List environment variables
eas secret:list

# View build history
eas build:list

# Run interactive build script
.\build-apk.ps1
```

## Notes Section

### Build 1 - [Date]
- Build Type: ___________
- Build Status: ___________
- Issues Found: ___________
- Notes: ___________

### Build 2 - [Date]
- Build Type: ___________
- Build Status: ___________
- Issues Found: ___________
- Notes: ___________

### Build 3 - [Date]
- Build Type: ___________
- Build Status: ___________
- Issues Found: ___________
- Notes: ___________

---

**Remember**: Always test preview builds thoroughly before creating production builds!
