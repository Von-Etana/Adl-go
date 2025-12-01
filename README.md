# ADLgo - Logistics & Fintech Super App

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020.svg)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A hybrid logistics delivery and fintech mobile application with InDrive-style bidding system

## 🎯 Overview

ADLgo is a production-ready mobile application (iOS & Android) built with React Native + Expo that combines:
- **Logistics**: On-demand delivery with competitive bidding
- **Fintech**: Wallet management and bill payments
- **Real-time**: WebSocket-powered live bidding and tracking
- **Dual Mode**: Seamless switching between Customer and Driver modes

## ✨ Key Features

### For Customers
- 📦 Create delivery requests with custom pricing
- 💰 Receive competitive bids from nearby drivers
- 📍 Real-time delivery tracking
- 💳 Integrated wallet for payments
- 📱 Pay bills (Airtime, Data, Electricity, Cable TV)
- ⭐ Rate and review drivers

### For Drivers
- 🚗 Toggle online/offline status
- 🔔 Receive real-time delivery requests
- 💵 Place competitive bids
- 🗺️ Turn-by-turn navigation
- 📸 Proof of delivery capture
- 💰 Instant earnings to wallet

## 🏗️ Architecture

```
ADL-go/
├── apps/
│   ├── backend/          # Express.js + TypeORM + Socket.IO
│   └── mobile/           # React Native + Expo
├── docs/                 # Documentation
└── packages/             # Shared code (future)
```

### Tech Stack

**Backend**:
- Node.js + Express.js
- TypeORM + PostgreSQL
- Socket.IO (real-time)
- Redis (caching)

**Mobile**:
- React Native 0.81
- Expo SDK 54
- Zustand (state management)
- React Navigation
- Socket.IO Client

**Third-Party Services**:
- **Supabase**: File storage
- **Google Maps**: Location services
- **Flutterwave**: Payments
- **Termii**: SMS/OTP
- **Agora**: Voice calls

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Expo CLI
- Android Studio / Xcode

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ADL-go.git
   cd ADL-go
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd apps/backend
   npm install
   
   # Mobile
   cd ../mobile
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Backend
   cd apps/backend
   cp .env.example .env
   # Edit .env with your credentials
   
   # Mobile
   cd ../mobile
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up database**
   ```bash
   cd apps/backend
   npm run migration:run
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd apps/backend
   npm run dev
   
   # Terminal 2 - Mobile
   cd apps/mobile
   npm start
   ```

6. **Open on device**
   - Install Expo Go app
   - Scan QR code from terminal
   - App should load successfully

## 📚 Documentation

- **[Setup Checklist](./docs/SETUP_CHECKLIST.md)**: Complete setup guide
- **[Integrations Guide](./docs/INTEGRATIONS_GUIDE.md)**: Third-party service setup
- **[Integrations Summary](./docs/INTEGRATIONS_SUMMARY.md)**: Overview of all integrations
- **[Real-time Integration](./docs/REALTIME_INTEGRATION.md)**: WebSocket architecture
- **[Testing Real-time](./docs/TESTING_REALTIME.md)**: How to test bidding flow
- **[Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)**: Development roadmap

## 🔑 Environment Variables

### Backend

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/adlgo
REDIS_URL=redis://localhost:6379

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key

# Authentication
JWT_SECRET=your_secret_min_32_characters

# Google Maps
GOOGLE_MAPS_API_KEY=your_key

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-...
FLUTTERWAVE_SECRET_KEY=FLWSECK-...
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TEST-...
FLUTTERWAVE_WEBHOOK_HASH=your_hash

# Termii
TERMII_API_KEY=your_key
TERMII_SENDER_ID=ADLgo

# Agora
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_certificate
```

### Mobile

```bash
# API
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000

# Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key

# Flutterwave
EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-...

# Agora
EXPO_PUBLIC_AGORA_APP_ID=your_app_id

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 🧪 Testing

### Test the Bidding Flow

1. **Start backend**: `cd apps/backend && npm run dev`
2. **Start mobile app**: `cd apps/mobile && npm start`
3. **Open two devices/simulators**:
   - Device 1: Login as customer
   - Device 2: Login as driver
4. **Customer creates delivery**
5. **Driver receives request in real-time**
6. **Driver places bid**
7. **Customer sees bid appear instantly**
8. **Customer accepts bid**

See [TESTING_REALTIME.md](./docs/TESTING_REALTIME.md) for detailed testing guide.

## 📱 Screenshots

[Add screenshots here]

## 🎨 Design System

- **Colors**: Dark (#1A1A1A), Orange (#FF6B4A), White (#FFFFFF)
- **Typography**: System fonts with custom weights
- **Spacing**: 4px base unit (xs, sm, md, base, lg, xl, xxl, xxxl)
- **Border Radius**: 8px, 12px, 16px, 24px, full
- **Shadows**: sm, md, lg

## 🔐 Security

- JWT-based authentication
- Encrypted passwords (bcrypt)
- Webhook signature verification
- Row-level security (Supabase)
- API key restrictions
- HTTPS in production

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP

### Deliveries
- `POST /api/deliveries` - Create delivery
- `GET /api/deliveries` - Get deliveries
- `GET /api/deliveries/:id` - Get delivery by ID

### Bidding
- `POST /api/deliveries/:id/bids` - Place bid
- `GET /api/deliveries/:id/bids` - Get bids
- `POST /api/deliveries/:id/bids/:bidId/accept` - Accept bid

### Wallet
- `GET /api/wallet/balance` - Get balance
- `POST /api/wallet/fund` - Fund wallet
- `GET /api/wallet/transactions` - Get transactions

### Bills
- `POST /api/bills/pay` - Pay bill
- `GET /api/bills/categories` - Get bill categories

## 🌐 WebSocket Events

### Client → Server
- `join_delivery` - Join delivery room
- `leave_delivery` - Leave delivery room
- `update_location` - Update driver location

### Server → Client
- `new_delivery_request` - New delivery for drivers
- `new_bid` - New bid for customer
- `bid_accepted` - Bid accepted notification

## 🚢 Deployment

### Backend (Railway/Render)
```bash
# Set environment variables
# Deploy via Git push or CLI
```

### Mobile (Expo EAS)
```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 💰 Cost Estimates

- **Supabase**: $0-25/month
- **Google Maps**: $50-100/month
- **Flutterwave**: 1.4% per transaction
- **Termii**: ₦2.50 per SMS
- **Agora**: $0.99 per 1000 minutes

**Total**: ~₦50,000-100,000/month ($60-120)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Designer**: [Designer Name]
- **Product Manager**: [PM Name]

## 📞 Support

- **Email**: support@adlgo.com
- **Twitter**: [@adlgo](https://twitter.com/adlgo)
- **Discord**: [Join our community](https://discord.gg/adlgo)

## 🙏 Acknowledgments

- React Native community
- Expo team
- All open-source contributors

---

**Built with ❤️ in Nigeria**
