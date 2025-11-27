import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
    user?: any;
}

export class SocketGateway {
    private static instance: SocketGateway;
    private io: SocketIOServer;

    private constructor(httpServer: HttpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: '*', // Allow all origins for now, restrict in production
                methods: ['GET', 'POST'],
            },
        });

        this.initializeMiddlewares();
        this.initializeEvents();
    }

    public static initialize(httpServer: HttpServer): SocketGateway {
        if (!SocketGateway.instance) {
            SocketGateway.instance = new SocketGateway(httpServer);
        }
        return SocketGateway.instance;
    }

    public static getInstance(): SocketGateway {
        if (!SocketGateway.instance) {
            throw new Error('SocketGateway not initialized');
        }
        return SocketGateway.instance;
    }

    public getIO(): SocketIOServer {
        return this.io;
    }

    private initializeMiddlewares() {
        this.io.use((socket: AuthenticatedSocket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
                socket.user = decoded;
                next();
            } catch (err) {
                next(new Error('Authentication error'));
            }
        });
    }

    private initializeEvents() {
        this.io.on('connection', (socket: AuthenticatedSocket) => {
            console.log(`User connected: ${socket.user?.id}`);

            // Join user to their own room for private notifications
            socket.join(socket.user?.id);

            // If user is a driver, join the drivers room
            if (socket.user?.role === 'driver') {
                socket.join('drivers');
                console.log(`User ${socket.user?.id} joined drivers room`);
            }

            socket.on('join_delivery', (deliveryId: string) => {
                socket.join(deliveryId);
                console.log(`User ${socket.user?.id} joined delivery room ${deliveryId}`);
            });

            socket.on('leave_delivery', (deliveryId: string) => {
                socket.leave(deliveryId);
                console.log(`User ${socket.user?.id} left delivery room ${deliveryId}`);
            });

            socket.on('update_location', (data: { lat: number; lng: number }) => {
                // Broadcast location to relevant rooms (e.g., active delivery)
                console.log(`Location update from ${socket.user?.id}:`, data);
            });

            // Chat Events
            socket.on('join_chat', (chatRoomId: string) => {
                socket.join(chatRoomId);
                console.log(`User ${socket.user?.id} joined chat room ${chatRoomId}`);
            });

            socket.on('leave_chat', (chatRoomId: string) => {
                socket.leave(chatRoomId);
                console.log(`User ${socket.user?.id} left chat room ${chatRoomId}`);
            });

            socket.on('send_message', async (data: { chatRoomId: string; content: string; type?: string }) => {
                try {
                    // Persist message using ChatService (lazy loaded to avoid circular dependencies if any)
                    const { ChatService } = require('../services/chat.service');
                    const chatService = new ChatService();

                    const message = await chatService.sendMessage(
                        data.chatRoomId,
                        socket.user?.id,
                        data.content,
                        data.type
                    );

                    // Broadcast to chat room
                    this.io.to(data.chatRoomId).emit('new_message', message);

                    // Also emit to receiver's personal room for notifications if they are not in chat
                    // This logic would require knowing the receiver ID, which we can get from the chat room
                    // For now, simple broadcast is sufficient
                } catch (error) {
                    console.error('Error sending message:', error);
                    socket.emit('error', { message: 'Failed to send message' });
                }
            });

            socket.on('typing', (data: { chatRoomId: string; isTyping: boolean }) => {
                socket.to(data.chatRoomId).emit('user_typing', {
                    userId: socket.user?.id,
                    isTyping: data.isTyping,
                });
            });

            socket.on('mark_read', async (data: { chatRoomId: string }) => {
                try {
                    const { ChatService } = require('../services/chat.service');
                    const chatService = new ChatService();
                    await chatService.markMessagesAsRead(data.chatRoomId, socket.user?.id);
                } catch (error) {
                    console.error('Error marking messages as read:', error);
                }
            });

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.user?.id}`);
            });
        });
    }
}
