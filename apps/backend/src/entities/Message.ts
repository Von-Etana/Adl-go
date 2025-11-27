import 'reflect-metadata';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './User';
import { ChatRoom } from './ChatRoom';

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    LOCATION = 'location',
}

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    chatRoomId: string;

    @ManyToOne(() => ChatRoom)
    @JoinColumn({ name: 'chatRoomId' })
    chatRoom: ChatRoom;

    @Column()
    senderId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column({ type: 'text' })
    content: string;

    @Column({
        type: 'enum',
        enum: MessageType,
        default: MessageType.TEXT,
    })
    type: MessageType;

    @Column({ type: 'timestamp', nullable: true })
    readAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
