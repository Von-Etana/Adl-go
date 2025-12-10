import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Delivery } from '../entities/Delivery';
import { Bid } from '../entities/Bid';
import { ChatRoom } from '../entities/ChatRoom';
import { Message } from '../entities/Message';
import { Referral } from '../entities/Referral';
import { Transaction } from '../entities/Transaction';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true, // Set to false in production
    logging: false,
    entities: [User, Delivery, Bid, ChatRoom, Message, Referral, Transaction],
    subscribers: [],
    migrations: [],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Data Source has been initialized!');
    } catch (err) {
        console.error('Error during Data Source initialization:', err);
    }
};
