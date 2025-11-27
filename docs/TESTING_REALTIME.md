# Quick Start Guide - Testing Real-Time Features

## Prerequisites

1. **Backend Running**
   ```bash
   cd apps/backend
   npm run dev
   ```
   Server should be running on `http://localhost:3000`

2. **Database Setup**
   - PostgreSQL running
   - Database migrations executed
   - Test users created (1 customer, 1 driver)

3. **Mobile App Running**
   ```bash
   cd apps/mobile
   npm start
   ```

## Test Scenario 1: Customer Creates Delivery, Driver Receives Request

### Customer App (Device/Simulator 1)

1. **Login as Customer**
   - Phone: `+2348000000001`
   - Complete authentication

2. **Create Delivery**
   - Navigate to "Create Delivery"
   - Fill in:
     - Pickup: "Wuse 2, Abuja"
     - Dropoff: "Gwarinpa Estate, Abuja"
     - Package Type: "Electronics"
     - Vehicle: "Car"
     - Offer Price: "1500"
   - Tap "Find Driver"

3. **Wait on Finding Driver Screen**
   - Should see "Searching for nearby drivers..."
   - Map placeholder with radar animation
   - Trip summary showing pickup, dropoff, and offer price

### Driver App (Device/Simulator 2)

1. **Login as Driver**
   - Phone: `+2348000000002`
   - Complete authentication
   - Ensure KYC is approved

2. **Go Online**
   - Toggle "Go Online" switch
   - Should see "You are Online" status

3. **Receive Delivery Request**
   - **EXPECTED**: OrderRequestScreen should appear automatically
   - Should display:
     - Pickup: "Wuse 2, Abuja"
     - Dropoff: "Gwarinpa Estate, Abuja"
     - Customer Offer: "₦1,500"
     - 30-second countdown timer

4. **Place Bid**
   - Adjust bid amount (e.g., "1400")
   - Tap "Bid ₦1,400"

### Customer App (Back to Device 1)

5. **See Bid Appear**
   - **EXPECTED**: Bid card should appear in real-time
   - Should show:
     - Driver name
     - Rating
     - Vehicle
     - Bid amount: "₦1,400"
     - Arrival time: "5 mins"

6. **Accept Bid**
   - Tap "Accept" on the bid
   - **EXPECTED**: Navigation to Active Delivery screen (to be implemented)

### Driver App (Back to Device 2)

7. **Bid Accepted Notification**
   - **EXPECTED**: Receive "bid_accepted" event
   - Console log should show: "Bid accepted"

## Test Scenario 2: Multiple Drivers Bidding

### Setup
- 1 Customer app
- 2+ Driver apps

### Steps

1. **Customer creates delivery** (same as above)

2. **All online drivers receive request**
   - Each driver app should show OrderRequestScreen
   - Each driver can place their own bid

3. **Customer sees all bids in real-time**
   - Bids appear as they are placed
   - Customer can compare prices and ratings
   - Customer accepts one bid

4. **Other drivers are notified**
   - Drivers whose bids were not accepted should be notified (to be implemented)

## Debugging Tips

### Check Socket Connection

**Backend Console**:
```
User connected: <user-id>
User <user-id> joined drivers room
```

**Mobile Console**:
```
Socket connected
```

### Check Events

**When delivery is created**:
- Backend: `Emitting new_delivery_request to drivers room`
- Driver App: `New delivery request received: {...}`

**When bid is placed**:
- Backend: `Emitting new_bid to customer <customer-id>`
- Customer App: `New bid received: {...}`

**When bid is accepted**:
- Backend: `Emitting bid_accepted to driver <driver-id>`
- Driver App: `Bid accepted`

### Common Issues

1. **Socket not connecting**
   - Check `SOCKET_URL` in mobile app
   - Ensure backend is running
   - Check JWT token is valid

2. **Events not received**
   - Verify user joined correct room
   - Check event names match exactly
   - Ensure socket is connected before emitting

3. **Driver not receiving requests**
   - Verify driver is online (`isOnline = true`)
   - Check driver joined "drivers" room
   - Ensure socket connection is active

4. **Customer not seeing bids**
   - Verify customer joined delivery room
   - Check `activeDeliveryId` is set correctly
   - Ensure socket listener is registered

## Network Inspection

### Using React Native Debugger

1. Enable network inspection
2. Filter for:
   - WebSocket connections (`ws://localhost:3000`)
   - API calls (`http://localhost:3000/api`)

### Using Browser DevTools (for Expo Web)

1. Open DevTools → Network tab
2. Filter: `WS` for WebSocket
3. Click on connection to see messages

## Test Data

### Sample Delivery Request
```json
{
  "pickupAddress": "Wuse 2, Abuja",
  "pickupLocation": { "lat": 9.0579, "lng": 7.4951 },
  "dropoffAddress": "Gwarinpa Estate, Abuja",
  "dropoffLocation": { "lat": 9.1108, "lng": 7.4165 },
  "packageDescription": "Electronics - Laptop",
  "vehicleType": "car",
  "customerOfferPrice": 1500
}
```

### Sample Bid
```json
{
  "deliveryId": "uuid-here",
  "amount": 1400
}
```

## Expected Socket Events

### new_delivery_request
```json
{
  "id": "delivery-uuid",
  "pickup": {
    "address": "Wuse 2, Abuja",
    "location": { "lat": 9.0579, "lng": 7.4951 }
  },
  "dropoff": {
    "address": "Gwarinpa Estate, Abuja",
    "location": { "lat": 9.1108, "lng": 7.4165 }
  },
  "offerPrice": 1500,
  "distance": "5 km"
}
```

### new_bid
```json
{
  "bidId": "bid-uuid",
  "driver": {
    "id": "driver-uuid",
    "name": "Emmanuel Okonkwo",
    "rating": 4.8,
    "vehicle": "Toyota Corolla (Silver)",
    "arrivalTime": "5 mins"
  },
  "amount": 1400
}
```

### bid_accepted
```json
{
  "bidId": "bid-uuid",
  "deliveryId": "delivery-uuid",
  "customer": {
    "id": "customer-uuid",
    "name": "John Doe",
    "phone": "+2348000000001"
  }
}
```

## Performance Benchmarks

- **Socket Connection Time**: < 500ms
- **Event Delivery Time**: < 100ms
- **API Response Time**: < 1000ms
- **UI Update Time**: < 50ms

## Next Steps After Testing

1. **Fix any identified issues**
2. **Implement location tracking**
3. **Add push notifications**
4. **Create Active Delivery screen**
5. **Add error handling and retry logic**
6. **Write automated tests**
