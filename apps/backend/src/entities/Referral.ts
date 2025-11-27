import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './User';

export enum ReferralStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

@Entity('referrals')
export class Referral {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'referrerId' })
    referrer!: User;

    @Column()
    referrerId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'referredUserId' })
    referredUser!: User;

    @Column()
    referredUserId!: string;

    @Column({
        type: 'enum',
        enum: ReferralStatus,
        default: ReferralStatus.PENDING,
    })
    status!: ReferralStatus;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    rewardAmount!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
