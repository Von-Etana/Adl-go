import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Delivery } from './Delivery';

@Entity('chat_rooms')
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    deliveryId: string;

    @ManyToOne(() => Delivery)
    @JoinColumn({ name: 'deliveryId' })
    delivery: Delivery;

    @Column()
    customerId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'customerId' })
    customer: User;

    @Column()
    driverId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'driverId' })
    driver: User;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastMessageAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
