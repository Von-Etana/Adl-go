import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';

const authService = new AuthService();

const loginSchema = z.object({
    phoneNumber: z.string().min(10),
    firebaseUid: z.string().min(1),
});

const updateProfileSchema = z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    profilePhotoUrl: z.string().url().optional(),
    address: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
});

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { phoneNumber, firebaseUid } = loginSchema.parse(req.body);

            const user = await authService.findOrCreateUser(phoneNumber, firebaseUid);
            const token = authService.generateToken(user);

            res.json({
                success: true,
                data: {
                    user,
                    token,
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ success: false, error: error.errors });
            } else {
                console.error('Login error:', error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            // @ts-ignore - userId added by auth middleware
            const userId = req.user.userId;
            const user = await authService.getUserProfile(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            // @ts-ignore - userId added by auth middleware
            const userId = req.user.userId;
            const data = updateProfileSchema.parse(req.body);

            const user = await authService.updateUserProfile(userId, data);

            res.json({ success: true, data: user });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ success: false, error: error.errors });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }
}
