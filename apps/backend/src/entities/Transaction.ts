import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

export enum TransactionType {
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal',
    PAYMENT = 'payment',
    REFUND = 'refund',
}

export enum TransactionStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({
        type: 'enum',
        enum: TransactionType,
    })
    type!: TransactionType;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status!: TransactionStatus;

    @Column({ nullable: true })
    reference!: string;

    @Column({ nullable: true })
    description!: string;

    @ManyToOne(() => User, (user) => user.transactions)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;
}
