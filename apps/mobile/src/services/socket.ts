import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/env';

const SOCKET_URL = config.SOCKET_URL;

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public async connect() {
        const token = await AsyncStorage.getItem('token');

        if (this.socket?.connected) {
            return;
        }

        this.socket = io(SOCKET_URL, {
            auth: {
                token,
            },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('connect_error', (err) => {
            console.log('Socket connection error:', err);
        });
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    public emit(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    public on(event: string, callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    public off(event: string) {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

export const socketService = SocketService.getInstance();
