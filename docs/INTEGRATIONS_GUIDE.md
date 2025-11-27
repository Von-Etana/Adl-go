# Third-Party Integrations Guide

## Overview

This document provides setup instructions and usage examples for all third-party services integrated into the ADLgo application.

---

## 1. Supabase (Database & Storage)

### Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Create Storage Buckets**
   ```sql
   -- Run in Supabase SQL Editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES 
     ('kyc-documents', 'kyc-documents', false),
     ('proof-of-delivery', 'proof-of-delivery', false),
     ('profile-photos', 'profile-photos', true);
   ```

3. **Set Storage Policies**
   ```sql
   -- Allow authenticated users to upload their own files
   CREATE POLICY "Users can upload their own files"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

4. **Environment Variables**
   ```bash
   # Backend
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Mobile
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### Usage

#### Backend - Upload File
```typescript
import { StorageService } from './services/storage.service';

const storageService = new StorageService();

// Upload KYC document
const result = await storageService.uploadKYCDocument(
  userId,
  'drivers_license',
  fileBuffer,
  'image/jpeg'
);

console.log('File URL:', result.url);
```

#### Mobile - Upload Image
```typescript
import { supabase } from './config/supabase';
import * as ImagePicker from 'expo-image-picker';

const uploadImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (!result.canceled) {
    const file = result.assets[0];
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(`${userId}/profile.jpg`, file);
  }
};
```

---

## 2. Google Maps Platform

### Setup

1. **Enable APIs**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable the following APIs:
     - Maps SDK for Android
     - Maps SDK for iOS
     - Places API
     - Directions API
     - Distance Matrix API
     - Geocoding API

2. **Create API Key**
   - Create credentials → API Key
   - Restrict key to your app's package name (Android) and bundle ID (iOS)
   - Restrict to enabled APIs only

3. **Environment Variables**
   ```bash
   # Backend
   GOOGLE_MAPS_API_KEY=AIzaSy...
   
   # Mobile
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
   ```

### Usage

#### Backend - Calculate Distance
```typescript
import { GoogleMapsService } from './services/google-maps.service';

const mapsService = new GoogleMapsService();

const result = await mapsService.getDistanceMatrix(
  [{ lat: 9.0579, lng: 7.4951 }],
  [{ lat: 9.1108, lng: 7.4165 }]
);

console.log('Distance:', result.distanceText);
console.log('Duration:', result.durationText);
```

#### Mobile - Places Autocomplete
```tsx
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

<GooglePlacesAutocomplete
  placeholder="Enter pickup location"
  onPress={(data, details = null) => {
    console.log(data.description);
    console.log(details?.geometry.location);
  }}
  query={{
    key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: 'en',
    components: 'country:ng',
  }}
  fetchDetails={true}
/>
```

---

## 3. Flutterwave (Payments)

### Setup

1. **Create Account**
   - Go to [flutterwave.com](https://flutterwave.com)
   - Complete KYC verification
   - Get API keys from Settings → API

2. **Configure Webhooks**
   - Add webhook URL: `https://your-api.com/webhooks/flutterwave`
   - Note the webhook hash for verification

3. **Environment Variables**
   ```bash
   # Backend
   FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-...
   FLUTTERWAVE_SECRET_KEY=FLWSECK-...
   FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-...
   FLUTTERWAVE_WEBHOOK_HASH=your_hash
   
   # Mobile
   EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-...
   ```

### Usage

#### Backend - Initialize Payment
```typescript
import { FlutterwaveService } from './services/flutterwave.service';

const flutterwaveService = new FlutterwaveService();

const payment = await flutterwaveService.initializePayment({
  amount: 5000,
  email: 'user@example.com',
  phoneNumber: '+2348000000000',
  name: 'John Doe',
  txRef: `TXN_${Date.now()}`,
  redirectUrl: 'https://your-app.com/payment/callback',
});

// Send payment.link to user
```

#### Backend - Pay Bills
```typescript
// Pay airtime
const result = await flutterwaveService.payBill({
  type: 'airtime',
  amount: 1000,
  phoneNumber: '+2348000000000',
  reference: `AIRTIME_${Date.now()}`,
});

// Pay electricity
const result = await flutterwaveService.payBill({
  type: 'electricity',
  amount: 5000,
  billerId: 'BIL099',
  customerId: '1234567890',
  reference: `ELEC_${Date.now()}`,
});
```

#### Mobile - WebView Payment
```tsx
import { WebView } from 'react-native-webview';

const PaymentScreen = ({ paymentLink }) => {
  return (
    <WebView
      source={{ uri: paymentLink }}
      onNavigationStateChange={(navState) => {
        if (navState.url.includes('/payment/callback')) {
          // Payment completed, verify on backend
        }
      }}
    />
  );
};
```

---

## 4. Termii (OTP & SMS)

### Setup

1. **Create Account**
   - Go to [termii.com](https://termii.com)
   - Verify your account
   - Get API key from dashboard

2. **Register Sender ID**
   - Request sender ID (e.g., "ADLgo")
   - Wait for approval (usually 24-48 hours)

3. **Environment Variables**
   ```bash
   # Backend only
   TERMII_API_KEY=TL...
   TERMII_SENDER_ID=ADLgo
   ```

### Usage

#### Backend - Send OTP
```typescript
import { TermiiService } from './services/termii.service';

const termiiService = new TermiiService();

// Generate OTP
const otp = Math.floor(100000 + Math.random() * 900000).toString();

// Send via SMS
await termiiService.sendOTP('+2348000000000', otp);

// Store OTP in Redis with 10-minute expiry
await redis.setex(`otp:${phoneNumber}`, 600, otp);
```

#### Backend - Send Notifications
```typescript
// Notify driver of new delivery
await termiiService.notifyDriverNewDelivery(
  driverPhone,
  'Wuse 2, Abuja'
);

// Notify bid acceptance
await termiiService.notifyBidAccepted(
  driverPhone,
  'John Doe'
);
```

---

## 5. Agora (Voice Calls)

### Setup

1. **Create Project**
   - Go to [agora.io](https://console.agora.io)
   - Create a new project
   - Enable "App Certificate" for security
   - Note App ID and App Certificate

2. **Environment Variables**
   ```bash
   # Backend
   AGORA_APP_ID=your_app_id
   AGORA_APP_CERTIFICATE=your_certificate
   
   # Mobile
   EXPO_PUBLIC_AGORA_APP_ID=your_app_id
   ```

### Usage

#### Backend - Generate Token
```typescript
import { AgoraService } from './services/agora.service';

const agoraService = new AgoraService();

// Generate call token for delivery
const callData = agoraService.generateCallToken(
  deliveryId,
  userId
);

// Send to mobile app
res.json({
  token: callData.token,
  channelName: callData.channelName,
  appId: callData.appId,
  uid: callData.uid,
});
```

#### Mobile - Voice Call
```tsx
import RtcEngine from 'react-native-agora';

const VoiceCallScreen = ({ callData }) => {
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    const initAgora = async () => {
      const rtcEngine = await RtcEngine.create(callData.appId);
      await rtcEngine.joinChannel(
        callData.token,
        callData.channelName,
        null,
        callData.uid
      );
      setEngine(rtcEngine);
    };

    initAgora();

    return () => {
      engine?.leaveChannel();
      engine?.destroy();
    };
  }, []);

  return (
    <View>
      <Text>In Call...</Text>
      <Button title="End Call" onPress={() => engine?.leaveChannel()} />
    </View>
  );
};
```

---

## Installation Commands

### Backend
```bash
cd apps/backend
npm install @supabase/supabase-js agora-access-token
```

### Mobile
```bash
cd apps/mobile
npm install @supabase/supabase-js react-native-agora react-native-webview
```

---

## Testing

### Test Credentials

#### Flutterwave Test Cards
```
Card Number: 5531886652142950
CVV: 564
Expiry: 09/32
PIN: 3310
OTP: 12345
```

#### Termii Test Mode
- Use test API key for development
- SMS will not be sent in test mode
- Check dashboard for "sent" messages

### Environment Setup

1. **Development**
   ```bash
   # Copy example files
   cp .env.example .env
   
   # Fill in your test credentials
   nano .env
   ```

2. **Production**
   - Use production API keys
   - Enable webhook verification
   - Set up proper error monitoring

---

## Security Best Practices

1. **Never commit `.env` files**
   - Add to `.gitignore`
   - Use environment-specific files

2. **Rotate API keys regularly**
   - Every 90 days minimum
   - Immediately if compromised

3. **Restrict API keys**
   - Google Maps: Restrict to app bundle IDs
   - Flutterwave: Whitelist IPs
   - Supabase: Use Row Level Security

4. **Validate webhooks**
   - Always verify signatures
   - Check event authenticity
   - Log suspicious requests

---

## Troubleshooting

### Common Issues

1. **Supabase Upload Fails**
   - Check bucket exists
   - Verify storage policies
   - Ensure file size < 50MB

2. **Google Maps Not Loading**
   - Verify API key is correct
   - Check API is enabled
   - Ensure billing is set up

3. **Flutterwave Payment Fails**
   - Verify test mode is enabled
   - Check webhook URL is accessible
   - Validate request payload

4. **Termii SMS Not Sending**
   - Verify sender ID is approved
   - Check phone number format (+234...)
   - Ensure sufficient balance

5. **Agora Call Quality Issues**
   - Check network connection
   - Verify token hasn't expired
   - Enable echo cancellation

---

## Support

- **Supabase**: https://supabase.com/docs
- **Google Maps**: https://developers.google.com/maps
- **Flutterwave**: https://developer.flutterwave.com
- **Termii**: https://developers.termii.com
- **Agora**: https://docs.agora.io
