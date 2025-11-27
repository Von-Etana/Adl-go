import { AppDataSource } from '../config/database';
import { ChatRoom } from '../entities/ChatRoom';
import { Message, MessageType } from '../entities/Message';
import { User } from '../entities/User';

export class ChatService {
    private chatRoomRepository = AppDataSource.getRepository(ChatRoom);
    private messageRepository = AppDataSource.getRepository(Message);
    private userRepository = AppDataSource.getRepository(User);

    /**
     * Get or create a chat room for a delivery
     */
    async getOrCreateChatRoom(deliveryId: string, customerId: string, driverId: string): Promise<ChatRoom> {
        let chatRoom = await this.chatRoomRepository.findOne({
            where: { deliveryId },
            relations: ['customer', 'driver'],
        });

        if (!chatRoom) {
            chatRoom = this.chatRoomRepository.create({
                deliveryId,
                customerId,
                driverId,
                lastMessageAt: new Date(),
            });
            await this.chatRoomRepository.save(chatRoom);
        }

        return chatRoom;
    }

    /**
     * Send a message
     */
    async sendMessage(
        chatRoomId: string,
        senderId: string,
        content: string,
        type: MessageType = MessageType.TEXT
    ): Promise<Message> {
        const message = this.messageRepository.create({
            chatRoomId,
            senderId,
            content,
            type,
        });

        await this.messageRepository.save(message);

        // Update last message time in chat room
        await this.chatRoomRepository.update(chatRoomId, {
            lastMessageAt: new Date(),
        });

        return this.messageRepository.findOne({
            where: { id: message.id },
            relations: ['sender'],
        }) as Promise<Message>;
    }

    /**
     * Get messages for a chat room
     */
    async getMessages(chatRoomId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
        return this.messageRepository.find({
            where: { chatRoomId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
            relations: ['sender'],
        });
    }

    /**
     * Mark messages as read
     */
    async markMessagesAsRead(chatRoomId: string, userId: string): Promise<void> {
        // Mark messages sent by the OTHER user as read
        await this.messageRepository
            .createQueryBuilder()
            .update(Message)
            .set({ readAt: new Date() })
            .where('chatRoomId = :chatRoomId', { chatRoomId })
            .andWhere('senderId != :userId', { userId })
            .andWhere('readAt IS NULL')
            .execute();
    }

    /**
     * Get unread count for a user
     */
    async getUnreadCount(userId: string): Promise<number> {
        // This is a simplified query. In a real app, you'd join with ChatRoom to ensure user is participant
        // For now, assuming we check unread messages in rooms where user is participant
        const unreadCount = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoin('message.chatRoom', 'chatRoom')
            .where('message.readAt IS NULL')
            .andWhere('message.senderId != :userId', { userId })
            .andWhere(
                '(chatRoom.customerId = :userId OR chatRoom.driverId = :userId)',
                { userId }
            )
            .getCount();

        return unreadCount;
    }
}
