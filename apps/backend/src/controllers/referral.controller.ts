import { Request, Response } from 'express';
import { ReferralService } from '../services/referral.service';

const referralService = new ReferralService();

export const getReferralStats = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const stats = await referralService.getReferralStats(userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch referral stats' });
    }
};

export const generateReferralCode = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const code = await referralService.generateReferralCode(userId);
        res.json({ code });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate referral code' });
    }
};
