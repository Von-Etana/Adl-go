import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Delivery } from './Delivery';

export enum BidStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity('bids')
export class Bid {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({
        type: 'enum',
        enum: BidStatus,
        default: BidStatus.PENDING,
    })
    status!: BidStatus;

    @ManyToOne(() => User, (user) => user.bids)
    driver!: User;

    @ManyToOne(() => Delivery, (delivery) => delivery.bids)
    delivery!: Delivery;

    @CreateDateColumn()
    createdAt!: Date;
}
