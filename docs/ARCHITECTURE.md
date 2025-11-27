# ADLgo Technical Architecture Blueprint

> **Comprehensive Technical Architecture for Hybrid Logistics & Fintech Mobile Application**

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Patterns](#3-architecture-patterns)
4. [Database Schema](#4-database-schema)
5. [API Design](#5-api-design)
6. [Real-Time Systems](#6-real-time-systems)
7. [Security Architecture](#7-security-architecture)
8. [Third-Party Integrations](#8-third-party-integrations)
9. [Deployment Strategy](#9-deployment-strategy)

---

## 1. System Overview

### 1.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Native Mobile App]
        B[Web Admin Dashboard]
    end
    
    subgraph "API Gateway"
        C[Next.js API Routes / Express]
        D[WebSocket Gateway Socket.io]
    end
    
    subgraph "Business Logic Layer"
        E[Authentication Service]
        F[Bidding Engine]
        G[Delivery Service]
        H[Payment Service]
        I[Notification Service]
        J[KYC Verification Service]
    end
    
    subgraph "Data Layer"
        K[(PostgreSQL)]
        L[(Redis Cache)]
        M[File Storage S3/Cloudinary]
    end
    
    subgraph "External Services"
        N[Google Maps API]
        O[Flutterwave Payment]
        P[Firebase Auth]
        Q[Twilio SMS/Voice]
        R[Bill Payment APIs]
    end
    
    A --> C
    A --> D
    B --> C
    C --> E
    C --> F
    C --> G
    C --> H
    C --> I
    C --> J
    D --> F
    E --> K
    F --> K
    F --> L
    G --> K
    H --> K
    I --> K
    J --> K
    J --> M
    E --> P
    G --> N
    H --> O
    I --> Q
    H --> R
```

### 1.2 System Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **Mobile App** | Customer & Driver interface | React Native + Expo |
| **Backend API** | Business logic & data management | Next.js/Express + TypeScript |
| **WebSocket Server** | Real-time bidding & tracking | Socket.io |
| **Database** | Persistent data storage | PostgreSQL + TypeORM |
| **Cache** | Session & real-time data | Redis |
| **File Storage** | KYC documents, POD images | AWS S3 / Cloudinary |
| **Admin Dashboard** | Operations management | Next.js + React |

---

## 2. Technology Stack

### 2.1 Mobile Application

```json
{
  "framework": "React Native 0.73+",
  "runtime": "Expo SDK 50+",
  "language": "TypeScript 5.0+",
  "stateManagement": "Zustand",
  "navigation": "React Navigation v6",
  "uiLibrary": "Tamagui / Custom Components",
  "animations": "React Native Reanimated 3",
  "maps": "react-native-maps",
  "realtime": "Socket.io-client",
  "http": "Axios",
  "forms": "React Hook Form + Zod",
  "storage": "AsyncStorage / MMKV"
}
```

### 2.2 Backend Services

```json
{
  "framework": "Next.js 14+ / Express 4.18+",
  "language": "TypeScript 5.0+",
  "orm": "TypeORM 0.3+",
  "database": "PostgreSQL 15+",
  "cache": "Redis 7+",
  "realtime": "Socket.io 4.6+",
  "validation": "Zod",
  "authentication": "Firebase Admin SDK",
  "fileUpload": "Multer + Sharp",
  "scheduling": "node-cron",
  "logging": "Winston",
  "monitoring": "Sentry"
}
```

### 2.3 DevOps & Infrastructure

```json
{
  "hosting": {
    "backend": "Railway / Render / AWS EC2",
    "database": "Railway PostgreSQL / AWS RDS",
    "cache": "Railway Redis / AWS ElastiCache",
    "storage": "AWS S3 / Cloudinary"
  },
  "cicd": "GitHub Actions",
  "containerization": "Docker",
  "monitoring": "Sentry + LogRocket",
  "analytics": "Mixpanel / Amplitude"
}
```

---

## 3. Architecture Patterns

### 3.1 Mobile App Architecture

```
apps/mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── atoms/          # Basic components (Button, Input)
│   │   ├── molecules/      # Composite components (Card, Form)
│   │   └── organisms/      # Complex components (Header, BottomSheet)
│   ├── screens/            # Screen components
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── driver/
│   │   └── shared/
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API clients & business logic
│   ├── store/              # Zustand state management
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── constants/          # App constants & config
│   ├── types/              # TypeScript types
│   └── theme/              # Design tokens & styling
```

### 3.2 Backend Architecture (Layered)

```
apps/backend/
├── src/
│   ├── entities/           # TypeORM entities (models)
│   ├── services/           # Business logic layer
│   ├── controllers/        # Request handlers
│   ├── routes/             # API route definitions
│   ├── middleware/         # Express middleware
│   ├── gateways/           # WebSocket gateways
│   ├── validators/         # Zod schemas
│   ├── utils/              # Helper functions
│   ├── config/             # Configuration files
│   └── types/              # TypeScript types
```

### 3.3 Design Patterns

#### Repository Pattern
```typescript
// services/delivery.service.ts
export class DeliveryService {
  constructor(
    private deliveryRepo: Repository<Delivery>,
    private biddingService: BiddingService
  ) {}

  async createDelivery(data: CreateDeliveryDto): Promise<Delivery> {
    // Business logic here
  }
}
```

#### Service Layer Pattern
```typescript
// Separation of concerns
- Controllers: Handle HTTP requests/responses
- Services: Contain business logic
- Repositories: Data access layer
```

#### Observer Pattern (Real-time)
```typescript
// WebSocket event-driven architecture
socket.on('bid:placed', (data) => {
  // Notify all relevant clients
  io.to(`delivery:${data.deliveryId}`).emit('bid:update', data);
});
```

---

## 4. Database Schema

### 4.1 Core Entities

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  profile_photo_url TEXT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'driver', 'admin')),
  is_driver_verified BOOLEAN DEFAULT FALSE,
  wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  referral_code VARCHAR(10) UNIQUE,
  referred_by_code VARCHAR(10),
  firebase_uid VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_firebase ON users(firebase_uid);
CREATE INDEX idx_users_referral ON users(referral_code);
```

#### Driver Profiles Table
```sql
CREATE TABLE driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('bike', 'car', 'van', 'truck')),
  vehicle_brand VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year INTEGER,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  license_number VARCHAR(50) UNIQUE NOT NULL,
  license_photo_url TEXT,
  vehicle_registration_url TEXT,
  insurance_url TEXT,
  selfie_verification_url TEXT,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  is_online BOOLEAN DEFAULT FALSE,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  rating_average DECIMAL(3, 2) DEFAULT 0.00,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_driver_user ON driver_profiles(user_id);
CREATE INDEX idx_driver_online ON driver_profiles(is_online);
CREATE INDEX idx_driver_location ON driver_profiles(current_latitude, current_longitude);
```

#### Deliveries Table
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) NOT NULL,
  driver_id UUID REFERENCES users(id),
  
  -- Locations
  pickup_address TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8) NOT NULL,
  pickup_longitude DECIMAL(11, 8) NOT NULL,
  dropoff_address TEXT NOT NULL,
  dropoff_latitude DECIMAL(10, 8) NOT NULL,
  dropoff_longitude DECIMAL(11, 8) NOT NULL,
  
  -- Package details
  package_type VARCHAR(50),
  package_description TEXT,
  
  -- Pricing
  customer_offer_price DECIMAL(10, 2) NOT NULL,
  final_price DECIMAL(10, 2),
  
  -- Delivery preferences
  vehicle_type VARCHAR(20) NOT NULL,
  delivery_category VARCHAR(20) NOT NULL CHECK (delivery_category IN ('express', 'standard', 'same_day')),
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'finding_driver' CHECK (status IN (
    'finding_driver', 'driver_assigned', 'driver_arriving', 
    'picked_up', 'in_transit', 'delivered', 'cancelled'
  )),
  
  -- Security
  delivery_otp VARCHAR(4),
  proof_of_delivery_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  driver_assigned_at TIMESTAMP,
  picked_up_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deliveries_customer ON deliveries(customer_id);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_deliveries_created ON deliveries(created_at DESC);
```

#### Bids Table
```sql
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID REFERENCES deliveries(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES users(id) NOT NULL,
  bid_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_bids_delivery ON bids(delivery_id);
CREATE INDEX idx_bids_driver ON bids(driver_id);
CREATE INDEX idx_bids_status ON bids(status);
```

#### Wallet Transactions Table
```sql
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN (
    'credit', 'debit', 'refund', 'commission', 'withdrawal'
  )),
  amount DECIMAL(10, 2) NOT NULL,
  balance_before DECIMAL(10, 2) NOT NULL,
  balance_after DECIMAL(10, 2) NOT NULL,
  reference VARCHAR(100) UNIQUE,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wallet_user ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_created ON wallet_transactions(created_at DESC);
```

#### Bill Payments Table
```sql
CREATE TABLE bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  bill_type VARCHAR(30) NOT NULL CHECK (bill_type IN ('airtime', 'data', 'electricity', 'cable_tv')),
  provider VARCHAR(50) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed')),
  payment_reference VARCHAR(100) UNIQUE,
  provider_reference VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bill_user ON bill_payments(user_id);
CREATE INDEX idx_bill_status ON bill_payments(status);
```

#### Ratings Table
```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID REFERENCES deliveries(id) NOT NULL,
  rater_id UUID REFERENCES users(id) NOT NULL,
  rated_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ratings_delivery ON ratings(delivery_id);
CREATE INDEX idx_ratings_rated ON ratings(rated_id);
```

### 4.2 Entity Relationships

```mermaid
erDiagram
    USERS ||--o{ DELIVERIES : creates
    USERS ||--o{ DELIVERIES : fulfills
    USERS ||--o| DRIVER_PROFILES : has
    USERS ||--o{ WALLET_TRANSACTIONS : owns
    USERS ||--o{ BILL_PAYMENTS : makes
    USERS ||--o{ BIDS : places
    USERS ||--o{ RATINGS : gives
    USERS ||--o{ RATINGS : receives
    
    DELIVERIES ||--o{ BIDS : receives
    DELIVERIES ||--|| RATINGS : has
    
    USERS {
        uuid id PK
        string phone_number UK
        string email UK
        string full_name
        string role
        decimal wallet_balance
        string referral_code UK
    }
    
    DRIVER_PROFILES {
        uuid id PK
        uuid user_id FK
        string vehicle_type
        string plate_number UK
        boolean is_online
        decimal rating_average
    }
    
    DELIVERIES {
        uuid id PK
        uuid customer_id FK
        uuid driver_id FK
        string status
        decimal final_price
        string delivery_otp
    }
    
    BIDS {
        uuid id PK
        uuid delivery_id FK
        uuid driver_id FK
        decimal bid_amount
        string status
    }
```

---

## 5. API Design

### 5.1 RESTful API Endpoints

#### Authentication
```
POST   /api/auth/register              # Register new user
POST   /api/auth/login                 # Login with phone/email
POST   /api/auth/verify-otp            # Verify OTP
POST   /api/auth/refresh-token         # Refresh JWT token
POST   /api/auth/logout                # Logout user
```

#### User Management
```
GET    /api/users/me                   # Get current user profile
PATCH  /api/users/me                   # Update profile
GET    /api/users/:id                  # Get user by ID (admin)
POST   /api/users/switch-mode          # Toggle customer/driver mode
```

#### Driver KYC
```
POST   /api/drivers/kyc/submit         # Submit KYC documents
GET    /api/drivers/kyc/status         # Check verification status
PATCH  /api/drivers/kyc/update         # Update KYC info
POST   /api/drivers/location           # Update driver location
PATCH  /api/drivers/online-status      # Toggle online/offline
```

#### Deliveries
```
POST   /api/deliveries                 # Create new delivery
GET    /api/deliveries                 # List deliveries (filtered)
GET    /api/deliveries/:id             # Get delivery details
PATCH  /api/deliveries/:id/status      # Update delivery status
POST   /api/deliveries/:id/cancel      # Cancel delivery
POST   /api/deliveries/:id/proof       # Upload proof of delivery
POST   /api/deliveries/:id/verify-otp  # Verify delivery OTP
```

#### Bidding
```
GET    /api/deliveries/:id/bids        # Get all bids for delivery
POST   /api/deliveries/:id/bids        # Place a bid (driver)
PATCH  /api/bids/:id/accept            # Accept a bid (customer)
DELETE /api/bids/:id                   # Withdraw bid (driver)
```

#### Wallet
```
GET    /api/wallet/balance             # Get wallet balance
GET    /api/wallet/transactions        # Get transaction history
POST   /api/wallet/fund                # Add funds to wallet
POST   /api/wallet/withdraw            # Withdraw from wallet
```

#### Bill Payments
```
GET    /api/bills/providers            # Get available providers
POST   /api/bills/validate             # Validate account number
POST   /api/bills/pay                  # Make bill payment
GET    /api/bills/history              # Get payment history
```

#### Ratings
```
POST   /api/ratings                    # Submit rating
GET    /api/ratings/user/:id           # Get user ratings
GET    /api/ratings/delivery/:id       # Get delivery ratings
```

### 5.2 API Response Format

#### Success Response
```typescript
{
  success: true,
  data: {
    // Response data
  },
  message: "Operation successful",
  timestamp: "2025-11-26T10:00:00Z"
}
```

#### Error Response
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input data",
    details: [
      {
        field: "phone_number",
        message: "Phone number is required"
      }
    ]
  },
  timestamp: "2025-11-26T10:00:00Z"
}
```

### 5.3 Request Validation (Zod)

```typescript
// validators/delivery.validator.ts
import { z } from 'zod';

export const createDeliverySchema = z.object({
  pickupAddress: z.string().min(5),
  pickupLatitude: z.number().min(-90).max(90),
  pickupLongitude: z.number().min(-180).max(180),
  dropoffAddress: z.string().min(5),
  dropoffLatitude: z.number().min(-90).max(90),
  dropoffLongitude: z.number().min(-180).max(180),
  packageType: z.string().optional(),
  packageDescription: z.string().max(500).optional(),
  customerOfferPrice: z.number().positive(),
  vehicleType: z.enum(['bike', 'car', 'van', 'truck']),
  deliveryCategory: z.enum(['express', 'standard', 'same_day']),
});

export type CreateDeliveryDto = z.infer<typeof createDeliverySchema>;
```

---

## 6. Real-Time Systems

### 6.1 WebSocket Events

#### Connection Management
```typescript
// Client connects
socket.on('connect', () => {
  socket.emit('authenticate', { token: userToken });
});

// Server authenticates
socket.on('authenticate', async (data) => {
  const user = await verifyToken(data.token);
  socket.data.userId = user.id;
  socket.join(`user:${user.id}`);
});
```

#### Delivery Bidding Flow
```typescript
// Customer creates delivery
socket.emit('delivery:created', {
  deliveryId: 'uuid',
  pickupLocation: { lat, lng },
  dropoffLocation: { lat, lng },
  offerPrice: 1500,
  vehicleType: 'bike'
});

// Nearby drivers receive notification
io.to('drivers:online').emit('delivery:available', {
  deliveryId: 'uuid',
  distance: '2.5km',
  offerPrice: 1500
});

// Driver places bid
socket.emit('bid:place', {
  deliveryId: 'uuid',
  bidAmount: 1800
});

// Customer receives bid update
io.to(`delivery:${deliveryId}`).emit('bid:update', {
  driverId: 'uuid',
  driverName: 'Musa',
  bidAmount: 1800,
  rating: 4.8,
  vehicleType: 'car'
});

// Customer accepts bid
socket.emit('bid:accept', {
  bidId: 'uuid'
});

// Driver receives acceptance
io.to(`user:${driverId}`).emit('bid:accepted', {
  deliveryId: 'uuid',
  customerName: 'Tunde',
  pickupLocation: { lat, lng }
});
```

#### Live Tracking
```typescript
// Driver updates location
socket.emit('location:update', {
  latitude: 9.0765,
  longitude: 7.3986
});

// Customer receives location update
io.to(`delivery:${deliveryId}`).emit('driver:location', {
  latitude: 9.0765,
  longitude: 7.3986,
  heading: 45,
  speed: 30
});
```

#### Chat System
```typescript
// Send message
socket.emit('message:send', {
  deliveryId: 'uuid',
  recipientId: 'uuid',
  message: 'I am on my way'
});

// Receive message
socket.on('message:received', (data) => {
  // Display in chat UI
});
```

### 6.2 Redis Caching Strategy

```typescript
// Cache driver locations (TTL: 30 seconds)
redis.setex(`driver:location:${driverId}`, 30, JSON.stringify({
  latitude,
  longitude,
  timestamp: Date.now()
}));

// Cache active deliveries (TTL: 5 minutes)
redis.setex(`delivery:${deliveryId}`, 300, JSON.stringify(deliveryData));

// Cache user sessions (TTL: 24 hours)
redis.setex(`session:${userId}`, 86400, JSON.stringify(sessionData));

// Geospatial queries for nearby drivers
redis.geoadd('drivers:online', longitude, latitude, driverId);
redis.georadius('drivers:online', userLng, userLat, 5, 'km');
```

---

## 7. Security Architecture

### 7.1 Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Firebase
    participant Database
    
    Client->>API: POST /auth/login (phone)
    API->>Firebase: Send OTP via SMS
    Firebase-->>Client: OTP sent
    Client->>API: POST /auth/verify-otp (phone, otp)
    API->>Firebase: Verify OTP
    Firebase-->>API: OTP valid
    API->>Database: Find/Create user
    Database-->>API: User data
    API->>API: Generate JWT
    API-->>Client: JWT + User data
    Client->>API: Subsequent requests (Bearer token)
    API->>API: Verify JWT
    API-->>Client: Protected resource
```

### 7.2 Security Measures

#### JWT Token Structure
```typescript
{
  userId: 'uuid',
  role: 'customer' | 'driver' | 'admin',
  iat: 1700000000,
  exp: 1700086400 // 24 hours
}
```

#### Middleware Stack
```typescript
// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Helmet security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));

// Request validation
app.use(validateRequest(schema));

// Authentication
app.use(authenticateJWT);

// Authorization
app.use(authorize(['driver', 'admin']));
```

#### Data Encryption
- **Passwords**: Bcrypt (if using email/password)
- **Sensitive Data**: AES-256 encryption
- **API Keys**: Environment variables, never committed
- **File Uploads**: Signed URLs with expiration

### 7.3 Privacy & Compliance

- **Phone Number Masking**: Display only last 4 digits in UI
- **Location Privacy**: Only share approximate location until order accepted
- **Data Retention**: Auto-delete old data per GDPR/NDPR
- **Audit Logs**: Track all sensitive operations

---

## 8. Third-Party Integrations

### 8.1 Google Maps Platform

```typescript
// Places Autocomplete
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

<GooglePlacesAutocomplete
  placeholder="Enter pickup location"
  onPress={(data, details) => {
    setPickupLocation({
      address: data.description,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng
    });
  }}
  query={{
    key: GOOGLE_MAPS_API_KEY,
    language: 'en',
    components: 'country:ng' // Nigeria only
  }}
/>

// Directions API
const getRoute = async (origin, destination) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${API_KEY}`
  );
  return response.json();
};
```

### 8.2 Flutterwave Payment

```typescript
// Initialize payment
const initializePayment = async (amount: number) => {
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FLW_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tx_ref: generateReference(),
      amount,
      currency: 'NGN',
      customer: {
        email: user.email,
        phone_number: user.phone
      },
      redirect_url: 'adlgo://payment-callback'
    })
  });
  return response.json();
};

// Bill payment
const payBill = async (billData) => {
  const response = await fetch('https://api.flutterwave.com/v3/bills', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${FLW_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      country: 'NG',
      customer: billData.accountNumber,
      amount: billData.amount,
      type: billData.billType, // AIRTIME, DSTV, etc.
      reference: generateReference()
    })
  });
  return response.json();
};
```

### 8.3 Firebase Services

```typescript
// Authentication
import auth from '@react-native-firebase/auth';

const sendOTP = async (phoneNumber: string) => {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  return confirmation;
};

const verifyOTP = async (confirmation, code: string) => {
  const userCredential = await confirmation.confirm(code);
  return userCredential.user;
};

// Cloud Messaging (Push Notifications)
import messaging from '@react-native-firebase/messaging';

messaging().onMessage(async remoteMessage => {
  showNotification(remoteMessage.notification);
});
```

### 8.4 Twilio (VoIP Calls)

```typescript
// Initiate masked call
const initiateCall = async (deliveryId: string) => {
  const response = await fetch('/api/calls/initiate', {
    method: 'POST',
    body: JSON.stringify({ deliveryId })
  });
  
  // Backend creates Twilio conference
  // Both parties call in, numbers are masked
};
```

---

## 9. Deployment Strategy

### 9.1 Environment Configuration

```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/adlgo
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
GOOGLE_MAPS_API_KEY=your-key
FLUTTERWAVE_SECRET_KEY=your-key
FIREBASE_PROJECT_ID=your-project-id
AWS_S3_BUCKET=adlgo-uploads
```

### 9.2 Docker Configuration

```dockerfile
# Dockerfile (Backend)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./apps/backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: adlgo
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 9.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### 9.4 Mobile App Deployment

```bash
# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

### 9.5 Monitoring & Logging

```typescript
// Sentry error tracking
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Winston logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## 10. Performance Optimization

### 10.1 Database Optimization

- **Indexing**: All foreign keys and frequently queried fields
- **Connection Pooling**: Max 20 connections
- **Query Optimization**: Use `EXPLAIN ANALYZE` for slow queries
- **Pagination**: Limit results to 20-50 per page

### 10.2 Caching Strategy

| Data Type | Cache Duration | Strategy |
|-----------|----------------|----------|
| User sessions | 24 hours | Redis |
| Driver locations | 30 seconds | Redis Geospatial |
| Active deliveries | 5 minutes | Redis |
| Bill providers | 1 hour | Redis |
| Static assets | 1 year | CDN |

### 10.3 Mobile App Optimization

- **Code Splitting**: Lazy load screens
- **Image Optimization**: WebP format, lazy loading
- **Bundle Size**: < 50MB total
- **Startup Time**: < 3 seconds
- **Memory Usage**: < 200MB average

---

## Conclusion

This architecture provides a scalable, secure, and performant foundation for the ADLgo platform. The modular design allows for easy feature additions and maintenance while ensuring high availability and user satisfaction.

For implementation details, refer to the Feature Breakdown document and Design System documentation.
