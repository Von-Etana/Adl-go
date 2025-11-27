import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { createDelivery, getAvailableDeliveries, getMyDeliveries } from '../controllers/delivery.controller';
import { placeBid, getBids, acceptBid } from '../controllers/bidding.controller';
import { fundWallet, getTransactions, getBalance } from '../controllers/wallet.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

import storageRoutes from './storage.routes';

import referralRoutes from './referral.routes';

const router = Router();
const authController = new AuthController();

// Auth Routes
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateJWT, authController.getProfile);
router.put('/auth/profile', authenticateJWT, authController.updateProfile);

// Storage Routes
router.use('/storage', storageRoutes);

// Referral Routes
router.use('/referrals', referralRoutes);

// Delivery Routes
router.post('/deliveries', authenticateJWT, createDelivery);
router.get('/deliveries/available', authenticateJWT, getAvailableDeliveries);
router.get('/deliveries/my-deliveries', authenticateJWT, getMyDeliveries);

// Bidding Routes
router.post('/bids', authenticateJWT, placeBid);
router.get('/deliveries/:deliveryId/bids', authenticateJWT, getBids);
router.post('/bids/:bidId/accept', authenticateJWT, acceptBid);

// Wallet Routes
router.post('/wallet/fund', authenticateJWT, fundWallet);
router.get('/wallet/transactions', authenticateJWT, getTransactions);
router.get('/wallet/balance', authenticateJWT, getBalance);

export default router;
