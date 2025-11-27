import { Router } from 'express';
import { getReferralStats, generateReferralCode } from '../controllers/referral.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats', authenticateJWT, getReferralStats);
router.post('/generate', authenticateJWT, generateReferralCode);

export default router;
