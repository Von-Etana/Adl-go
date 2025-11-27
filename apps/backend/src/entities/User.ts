import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Delivery } from './Delivery';
import { Bid } from './Bid';
import { Transaction } from './Transaction';

export enum UserRole {
    CUSTOMER = 'customer',
    DRIVER = 'driver',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ unique: true, length: 20 })
    @Index()
    phoneNumber!: string;

    @Column({ unique: true, nullable: true })
    email!: string;

    @Column()
    fullName!: string;

    @Column({ nullable: true })
    profilePhotoUrl!: string;

    @Column({ nullable: true })
    address!: string;

    @Column({ nullable: true })
    emergencyContactName!: string;

    @Column({ nullable: true })
    emergencyContactPhone!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role!: UserRole;

    @Column({ default: false })
    isDriverVerified!: boolean;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    walletBalance!: number;

    @Column({ unique: true, nullable: true, length: 10 })
    @Index()
    referralCode!: string;

    @Column({ nullable: true, length: 10 })
    referredByCode!: string;

    @Column({ unique: true, nullable: true })
    @Index()
    firebaseUid!: string;

    @OneToMany(() => Delivery, (delivery) => delivery.customer)
    deliveries!: Delivery[];

    @OneToMany(() => Bid, (bid) => bid.driver)
    bids!: Bid[];

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions!: Transaction[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
