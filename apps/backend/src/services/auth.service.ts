import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/User';
import { AppDataSource } from '../config/database';
import jwt from 'jsonwebtoken';

export class AuthService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async findOrCreateUser(phoneNumber: string, firebaseUid: string): Promise<User> {
        let user = await this.userRepository.findOne({ where: { phoneNumber } });

        if (!user) {
            user = this.userRepository.create({
                phoneNumber,
                firebaseUid,
                fullName: 'New User', // Placeholder, should be updated in profile setup
                role: UserRole.CUSTOMER,
            });
            await this.userRepository.save(user);
        } else if (!user.firebaseUid) {
            // Link existing user with Firebase UID if not already linked
            user.firebaseUid = firebaseUid;
            await this.userRepository.save(user);
        }

        return user;
    }

    async getUserProfile(userId: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    async updateUserProfile(userId: string, data: Partial<User>): Promise<User | null> {
        await this.userRepository.update(userId, data);
        return this.getUserProfile(userId);
    }

    generateToken(user: User): string {
        return jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '24h' }
        );
    }
}
