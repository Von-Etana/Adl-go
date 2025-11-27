import { Request, Response } from 'express';
import { DeliveryService } from '../services/delivery.service';
import { z } from 'zod';

const deliveryService = new DeliveryService();

const createDeliverySchema = z.object({
    pickupAddress: z.string(),
    pickupLocation: z.object({ lat: z.number(), lng: z.number() }),
    dropoffAddress: z.string(),
    dropoffLocation: z.object({ lat: z.number(), lng: z.number() }),
    packageDescription: z.string(),
    vehicleType: z.string(),
    customerOfferPrice: z.number().positive(),
    packageValue: z.number().optional(),
    insuranceRequested: z.boolean().optional(),
});

export const createDelivery = async (req: Request, res: Response) => {
    try {
        const data = createDeliverySchema.parse(req.body);
        // @ts-ignore - User is attached by auth middleware
        const delivery = await deliveryService.createDelivery(req.user, data);
        res.status(201).json(delivery);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(500).json({ error: 'Failed to create delivery' });
        }
    }
};

export const getAvailableDeliveries = async (req: Request, res: Response) => {
    try {
        const deliveries = await deliveryService.getAvailableDeliveries();
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
};

export const getMyDeliveries = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const deliveries = await deliveryService.getCustomerDeliveries(req.user.id);
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch deliveries' });
    }
};
