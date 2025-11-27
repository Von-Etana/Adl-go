import { AppDataSource } from '../config/database';
import { Referral, ReferralStatus } from '../entities/Referral';
import { User } from '../entities/User';
import { Repository } from 'typeorm';

export class ReferralService {
    private referralRepository: Repository<Referral>;
    private userRepository: Repository<User>;

    constructor() {
        this.referralRepository = AppDataSource.getRepository(Referral);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async generateReferralCode(userId: string): Promise<string> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new Error('User not found');

        if (user.referralCode) return user.referralCode;

        // Generate a unique 8-character code
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        user.referralCode = code;
        await this.userRepository.save(user);

        return code;
    }

    async processReferral(newUserId: string, referralCode: string): Promise<void> {
        const referrer = await this.userRepository.findOneBy({ referralCode });
        if (!referrer) return; // Invalid code, ignore

        const newUser = await this.userRepository.findOneBy({ id: newUserId });
        if (!newUser) return;

        // Prevent self-referral
        if (referrer.id === newUser.id) return;

        // Link users
        newUser.referredByCode = referralCode;
        await this.userRepository.save(newUser);

        // Create referral record
        const referral = this.referralRepository.create({
            referrer,
            referredUser: newUser,
            status: ReferralStatus.PENDING,
            rewardAmount: 500, // Default reward amount
        });

        await this.referralRepository.save(referral);
    }

    async completeReferral(referredUserId: string): Promise<void> {
        const referral = await this.referralRepository.findOne({
            where: { referredUserId, status: ReferralStatus.PENDING },
            relations: ['referrer'],
        });

        if (!referral) return;

        referral.status = ReferralStatus.COMPLETED;
        await this.referralRepository.save(referral);

        // Credit referrer's wallet
        const referrer = referral.referrer;
        referrer.walletBalance = Number(referrer.walletBalance) + Number(referral.rewardAmount);
        await this.userRepository.save(referrer);
    }

    async getReferralStats(userId: string) {
        const referrals = await this.referralRepository.find({
            where: { referrerId: userId },
            order: { createdAt: 'DESC' },
        });

        const totalEarned = referrals
            .filter(r => r.status === ReferralStatus.COMPLETED)
            .reduce((sum, r) => sum + Number(r.rewardAmount), 0);

        return {
            code: (await this.userRepository.findOneBy({ id: userId }))?.referralCode,
            totalReferrals: referrals.length,
            totalEarned,
            history: referrals,
        };
    }
}
