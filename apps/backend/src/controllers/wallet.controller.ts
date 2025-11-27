import { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';
import { z } from 'zod';

const walletService = new WalletService();

const fundWalletSchema = z.object({
    amount: z.number().positive(),
    reference: z.string(),
});

export const fundWallet = async (req: Request, res: Response) => {
    try {
        const { amount, reference } = fundWalletSchema.parse(req.body);
        // @ts-ignore
        const result = await walletService.fundWallet(req.user.id, amount, reference);
        res.json(result);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(400).json({ error: error.message || 'Failed to fund wallet' });
        }
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const transactions = await walletService.getTransactions(req.user.id);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

export const getBalance = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const balance = await walletService.getBalance(req.user.id);
        res.json(balance);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
};
