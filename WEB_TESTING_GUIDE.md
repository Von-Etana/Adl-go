# Testing ADLgo on Web

## Quick Start

### 1. Start the Mobile App (Web Mode)
```bash
cd apps/mobile
npm run web
```

This will:
- Start the Expo development server
- Open your browser automatically at `http://localhost:8081`
- Hot reload on code changes

### 2. Alternative: Use Expo CLI
```bash
cd apps/mobile
npx expo start --web
```

Then press `w` to open in web browser.

---

## Web-Specific Configuration

### Current Setup
- ✅ Expo configured for web support
- ✅ React Native Web automatically included with Expo
- ✅ Environment variables configured in `app.config.js`

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

---

## Testing Features on Web

### What Works on Web:
- ✅ Navigation (React Navigation)
- ✅ Forms and inputs
- ✅ State management (Zustand)
- ✅ API calls (Axios)
- ✅ Most UI components

### What Has Limitations:
- ⚠️ Google Maps (requires web-specific implementation)
- ⚠️ Camera/Image picker (browser permissions required)
- ⚠️ Native modules (Agora, some Expo modules)
- ⚠️ React Native Reanimated (limited web support)

---

## Recommended Testing Flow

### 1. Start Backend First
```bash
cd apps/backend
npm run dev
```
Backend runs on `http://localhost:3000`

### 2. Start Mobile Web
```bash
cd apps/mobile
npm run web
```
Web app runs on `http://localhost:8081`

### 3. Test These Features:
- [ ] Login/Registration flow
- [ ] Profile page
- [ ] Referral system
- [ ] Basic navigation
- [ ] State management

### 4. Features to Test on Mobile/Emulator:
- Google Maps integration
- Camera/Image upload
- Real-time features (Socket.io)
- Push notifications

---

## Troubleshooting

### Issue: "Module not found" errors
**Solution:** Some React Native packages don't support web
```bash
# Install web-specific alternatives if needed
npm install react-native-web
```

### Issue: Google Maps not showing
**Solution:** Use Google Maps JavaScript API for web
```bash
npm install @react-google-maps/api
```

### Issue: Styles look different
**Solution:** React Native Web has some style limitations
- Use flexbox carefully
- Test responsive design
- Some shadow styles may not work

---

## Development Tips

### 1. Use Browser DevTools
- Open Chrome DevTools (F12)
- Inspect React components
- Debug network requests
- Check console for errors

### 2. Hot Reload
- Changes auto-reload in browser
- Faster than mobile development
- Great for UI iteration

### 3. Responsive Testing
- Test different screen sizes
- Use Chrome's device toolbar
- Simulate mobile viewports

---

## Production Build (Optional)

To create a production web build:
```bash
cd apps/mobile
npx expo export:web
```

Output will be in `web-build/` directory.

---

## Next Steps

1. Start the web server: `npm run web`
2. Open browser to `http://localhost:8081`
3. Test authentication flow
4. Navigate through the app
5. Check console for any errors

For full mobile experience, use:
- Android: `npm run android`
- iOS: `npm run ios`
- Or Expo Go app on your phone
