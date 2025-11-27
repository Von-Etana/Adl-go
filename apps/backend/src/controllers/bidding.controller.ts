import { Request, Response } from 'express';
import { BiddingService } from '../services/bidding.service';
import { z } from 'zod';

const biddingService = new BiddingService();

const placeBidSchema = z.object({
    deliveryId: z.string().uuid(),
    amount: z.number().positive(),
});

export const placeBid = async (req: Request, res: Response) => {
    try {
        const { deliveryId, amount } = placeBidSchema.parse(req.body);
        // @ts-ignore
        const bid = await biddingService.placeBid(req.user, deliveryId, amount);
        res.status(201).json(bid);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(400).json({ error: error.message || 'Failed to place bid' });
        }
    }
};

export const getBids = async (req: Request, res: Response) => {
    try {
        const { deliveryId } = req.params;
        const bids = await biddingService.getBidsForDelivery(deliveryId);
        res.json(bids);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bids' });
    }
};

export const acceptBid = async (req: Request, res: Response) => {
    try {
        const { bidId } = req.params;
        // @ts-ignore
        const bid = await biddingService.acceptBid(bidId, req.user.id);
        res.json(bid);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Failed to accept bid' });
    }
};
