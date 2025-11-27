import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Bid } from './Bid';

export enum DeliveryStatus {
    PENDING = 'pending',
    BIDDING = 'bidding',
    ACCEPTED = 'accepted',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('deliveries')
export class Delivery {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    pickupAddress!: string;

    @Column('jsonb')
    pickupLocation!: { lat: number; lng: number };

    @Column()
    dropoffAddress!: string;

    @Column('jsonb')
    dropoffLocation!: { lat: number; lng: number };

    @Column()
    packageDescription!: string;

    @Column()
    vehicleType!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    customerOfferPrice!: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    packageValue?: number;

    @Column({ default: false })
    insuranceRequested!: boolean;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    insuranceFee!: number;

    @Column({
        type: 'enum',
        enum: DeliveryStatus,
        default: DeliveryStatus.PENDING,
    })
    status!: DeliveryStatus;

    @ManyToOne(() => User, (user) => user.deliveries)
    customer!: User;

    @ManyToOne(() => User, { nullable: true })
    driver!: User;

    @OneToMany(() => Bid, (bid) => bid.delivery)
    bids!: Bid[];

    @Column({ default: false })
    isConsolidated!: boolean;

    @Column('simple-json', { nullable: true })
    consolidationItems!: { description: string; weight: number; value: number }[];

    @Column({ default: false })
    isInternational!: boolean;

    @Column({ nullable: true })
    destinationCountry!: string;

    @Column('simple-json', { nullable: true })
    customsDeclaration!: { description: string; quantity: number; value: number }[];

    @Column({ default: false })
    isInterstate!: boolean;

    @Column({ nullable: true })
    destinationState!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
