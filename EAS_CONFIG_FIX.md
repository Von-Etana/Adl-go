# EAS Configuration Fix

## Issue
The build failed because the project uses `app.config.js` (dynamic configuration) instead of `app.json`, and EAS couldn't automatically write the project ID to it.

## Solution Applied
Manually added the EAS project ID to `app.config.js`:

```javascript
extra: {
    eas: {
        projectId: "272043ff-5973-4a75-8b3e-3e9a28600d49"
    },
    // ... other config
}
```

Also added:
- Android version code: 1
- Android permissions: Location, Camera, Internet

## Configuration Summary

### Package Details
- **Package Name**: `com.adlgo.app`
- **Bundle ID (iOS)**: `com.adlgo.app`
- **Version**: 1.0.0
- **Version Code**: 1

### EAS Project
- **Project ID**: 272043ff-5973-4a75-8b3e-3e9a28600d49
- **Account**: von-etana / adlgo-app

### Permissions
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- CAMERA
- INTERNET

## Next Steps

You can now build your APK:

```bash
cd apps\mobile
eas build --profile preview --platform android
```

Or use the interactive script:

```powershell
.\build-apk.ps1
```

## Note on app.json vs app.config.js

Your project uses `app.config.js` which is the dynamic configuration file. This allows you to:
- Use environment variables
- Add conditional logic
- Keep configuration DRY

The `app.json` file in the directory can be safely ignored or deleted as `app.config.js` takes precedence.

## Files Updated
- ✅ `app.config.js` - Added EAS project ID, version code, and permissions
- ✅ Configuration is now complete and ready for building
