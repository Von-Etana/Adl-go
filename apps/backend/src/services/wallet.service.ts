import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Transaction, TransactionType, TransactionStatus } from '../entities/Transaction';

export class WalletService {
    private userRepository = AppDataSource.getRepository(User);
    private transactionRepository = AppDataSource.getRepository(Transaction);

    async fundWallet(userId: string, amount: number, reference: string) {
        return await AppDataSource.transaction(async (manager) => {
            const user = await manager.findOne(User, { where: { id: userId } });
            if (!user) throw new Error('User not found');

            // Create Transaction Record
            const transaction = manager.create(Transaction, {
                user,
                amount,
                type: TransactionType.DEPOSIT,
                status: TransactionStatus.SUCCESS,
                reference,
                description: 'Wallet Funding',
            });
            await manager.save(transaction);

            // Update User Balance
            // Note: In a real app, use atomic updates or locking to prevent race conditions
            user.walletBalance = Number(user.walletBalance) + Number(amount);
            await manager.save(user);

            return { newBalance: user.walletBalance, transaction };
        });
    }

    async deductFunds(userId: string, amount: number, description: string) {
        return await AppDataSource.transaction(async (manager) => {
            const user = await manager.findOne(User, { where: { id: userId } });
            if (!user) throw new Error('User not found');

            if (Number(user.walletBalance) < amount) {
                throw new Error('Insufficient funds');
            }

            // Create Transaction Record
            const transaction = manager.create(Transaction, {
                user,
                amount,
                type: TransactionType.PAYMENT,
                status: TransactionStatus.SUCCESS,
                description,
            });
            await manager.save(transaction);

            // Update User Balance
            user.walletBalance = Number(user.walletBalance) - Number(amount);
            await manager.save(user);

            return { newBalance: user.walletBalance, transaction };
        });
    }

    async getTransactions(userId: string) {
        return await this.transactionRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async getBalance(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');
        return { balance: user.walletBalance };
    }
}
