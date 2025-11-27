# ADLgo Setup Checklist

## Prerequisites

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 15+ installed and running
- [ ] Redis 7+ installed and running
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Android Studio / Xcode (for mobile development)

---

## Third-Party Service Accounts

### 1. Supabase
- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Copy project URL
- [ ] Copy anon key
- [ ] Copy service role key
- [ ] Create storage buckets:
  - [ ] `kyc-documents`
  - [ ] `proof-of-delivery`
  - [ ] `profile-photos`
- [ ] Set up storage policies

### 2. Google Cloud Platform
- [ ] Create account at [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Create new project
- [ ] Enable billing
- [ ] Enable APIs:
  - [ ] Maps SDK for Android
  - [ ] Maps SDK for iOS
  - [ ] Places API
  - [ ] Directions API
  - [ ] Distance Matrix API
  - [ ] Geocoding API
- [ ] Create API key
- [ ] Restrict API key to app bundle IDs
- [ ] Copy API key

### 3. Flutterwave
- [ ] Create account at [flutterwave.com](https://flutterwave.com)
- [ ] Complete KYC verification
- [ ] Navigate to Settings → API
- [ ] Copy public key
- [ ] Copy secret key
- [ ] Copy encryption key
- [ ] Set up webhook URL
- [ ] Copy webhook hash
- [ ] Test with test cards

### 4. Termii
- [ ] Create account at [termii.com](https://termii.com)
- [ ] Verify account
- [ ] Copy API key
- [ ] Request sender ID (e.g., "ADLgo")
- [ ] Wait for sender ID approval (24-48 hours)
- [ ] Test SMS sending

### 5. Agora
- [ ] Create account at [agora.io](https://console.agora.io)
- [ ] Create new project
- [ ] Enable App Certificate
- [ ] Copy App ID
- [ ] Copy App Certificate
- [ ] Test voice call

---

## Backend Setup

### 1. Environment Configuration
```bash
cd apps/backend
cp .env.example .env
```

- [ ] Set `PORT=3000`
- [ ] Set `DATABASE_URL` (PostgreSQL connection string)
- [ ] Set `REDIS_URL` (Redis connection string)
- [ ] Set `JWT_SECRET` (min 32 characters)
- [ ] Set `SUPABASE_URL`
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set `GOOGLE_MAPS_API_KEY`
- [ ] Set `FLUTTERWAVE_PUBLIC_KEY`
- [ ] Set `FLUTTERWAVE_SECRET_KEY`
- [ ] Set `FLUTTERWAVE_ENCRYPTION_KEY`
- [ ] Set `FLUTTERWAVE_WEBHOOK_HASH`
- [ ] Set `TERMII_API_KEY`
- [ ] Set `TERMII_SENDER_ID`
- [ ] Set `AGORA_APP_ID`
- [ ] Set `AGORA_APP_CERTIFICATE`

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Run migrations
npm run migration:run

# Seed database (optional)
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

- [ ] Server running on http://localhost:3000
- [ ] Database connected
- [ ] Redis connected
- [ ] No errors in console

---

## Mobile App Setup

### 1. Environment Configuration
```bash
cd apps/mobile
cp .env.example .env
```

- [ ] Set `EXPO_PUBLIC_API_URL=http://localhost:3000/api`
- [ ] Set `EXPO_PUBLIC_SOCKET_URL=http://localhost:3000`
- [ ] Set `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Set `EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`
- [ ] Set `EXPO_PUBLIC_AGORA_APP_ID`
- [ ] Set `EXPO_PUBLIC_SUPABASE_URL`
- [ ] Set `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure app.json
```json
{
  "expo": {
    "name": "ADLgo",
    "slug": "adlgo",
    "version": "1.0.0",
    "android": {
      "package": "com.adlgo.app",
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "RECORD_AUDIO"
      ]
    },
    "ios": {
      "bundleIdentifier": "com.adlgo.app",
      "config": {
        "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
      },
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "ADLgo needs your location to show nearby drivers and deliveries",
        "NSLocationAlwaysUsageDescription": "ADLgo needs your location to track deliveries in the background",
        "NSCameraUsageDescription": "ADLgo needs camera access to capture proof of delivery",
        "NSMicrophoneUsageDescription": "ADLgo needs microphone access for voice calls"
      }
    }
  }
}
```

### 4. Start Development Server
```bash
npm start
```

- [ ] Expo DevTools opened
- [ ] QR code displayed
- [ ] No errors in console

### 5. Test on Device
- [ ] Install Expo Go app
- [ ] Scan QR code
- [ ] App loads successfully
- [ ] No runtime errors

---

## Testing Checklist

### Backend API
- [ ] Health check endpoint works (`GET /health`)
- [ ] Authentication endpoints work
  - [ ] Register user
  - [ ] Login
  - [ ] Verify OTP
- [ ] Delivery endpoints work
  - [ ] Create delivery
  - [ ] Get deliveries
  - [ ] Place bid
  - [ ] Accept bid
- [ ] Wallet endpoints work
  - [ ] Get balance
  - [ ] Fund wallet
  - [ ] Get transactions
- [ ] Socket.IO connection works
  - [ ] Client can connect
  - [ ] Events are emitted
  - [ ] Events are received

### Mobile App
- [ ] Authentication flow works
  - [ ] Login screen
  - [ ] OTP verification
  - [ ] Profile setup
- [ ] Customer flow works
  - [ ] Create delivery
  - [ ] See incoming bids
  - [ ] Accept bid
  - [ ] Track delivery
- [ ] Driver flow works
  - [ ] Go online/offline
  - [ ] Receive delivery requests
  - [ ] Place bid
  - [ ] Navigate to pickup
  - [ ] Complete delivery
- [ ] Maps integration works
  - [ ] Map displays
  - [ ] Location autocomplete
  - [ ] Route drawing
- [ ] Payment integration works
  - [ ] Fund wallet
  - [ ] Pay bills
  - [ ] View transactions
- [ ] Voice call works
  - [ ] Initiate call
  - [ ] Receive call
  - [ ] End call

---

## Production Deployment

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Use production database
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Configure rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Set up logging (Winston)
- [ ] Deploy to hosting platform (Railway/Render)
- [ ] Set up CI/CD pipeline

### Mobile App
- [ ] Update app version
- [ ] Build production bundle
  ```bash
  eas build --platform android
  eas build --platform ios
  ```
- [ ] Test production build
- [ ] Submit to Google Play Store
- [ ] Submit to Apple App Store
- [ ] Set up crash reporting (Sentry)
- [ ] Set up analytics (Firebase Analytics)

---

## Post-Deployment

- [ ] Monitor error logs
- [ ] Check API response times
- [ ] Monitor database performance
- [ ] Check payment webhook logs
- [ ] Monitor SMS delivery rates
- [ ] Check voice call quality
- [ ] Gather user feedback
- [ ] Plan next iteration

---

## Troubleshooting

### Backend won't start
1. Check PostgreSQL is running
2. Check Redis is running
3. Verify environment variables
4. Check port 3000 is not in use

### Mobile app won't build
1. Clear Expo cache: `expo start -c`
2. Delete node_modules and reinstall
3. Check for TypeScript errors
4. Verify all dependencies are installed

### Socket connection fails
1. Check backend is running
2. Verify SOCKET_URL is correct
3. Check JWT token is valid
4. Check CORS settings

### Payment fails
1. Verify Flutterwave keys are correct
2. Check test mode is enabled
3. Verify webhook URL is accessible
4. Check request payload format

### Maps not loading
1. Verify Google Maps API key
2. Check APIs are enabled
3. Ensure billing is set up
4. Check bundle ID restrictions

---

## Support Resources

- **Documentation**: `/docs` folder
- **API Reference**: `http://localhost:3000/api-docs`
- **Postman Collection**: `/docs/postman_collection.json`
- **GitHub Issues**: Report bugs and feature requests

---

## Next Steps

After completing this checklist:

1. Review the [INTEGRATIONS_GUIDE.md](./INTEGRATIONS_GUIDE.md) for detailed usage
2. Check [TESTING_REALTIME.md](./TESTING_REALTIME.md) for testing real-time features
3. Read [REALTIME_INTEGRATION.md](./REALTIME_INTEGRATION.md) for architecture details
4. Plan your first production deployment
