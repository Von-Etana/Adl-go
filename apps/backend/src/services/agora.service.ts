import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import dotenv from 'dotenv';

dotenv.config();

const AGORA_APP_ID = process.env.AGORA_APP_ID || '';
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '';

export class AgoraService {
    /**
     * Generate RTC token for voice call
     */
    generateRTCToken(
        channelName: string,
        uid: number,
        role: 'publisher' | 'subscriber' = 'publisher',
        expirationTimeInSeconds: number = 3600
    ): string {
        if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
            throw new Error('Agora credentials not configured');
        }

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

        const token = RtcTokenBuilder.buildTokenWithUid(
            AGORA_APP_ID,
            AGORA_APP_CERTIFICATE,
            channelName,
            uid,
            agoraRole,
            privilegeExpiredTs
        );

        return token;
    }

    /**
     * Generate token for customer-driver call
     */
    generateCallToken(deliveryId: string, userId: string): {
        token: string;
        channelName: string;
        appId: string;
        uid: number;
    } {
        const channelName = `delivery_${deliveryId}`;
        const uid = this.generateUid(userId);

        const token = this.generateRTCToken(channelName, uid, 'publisher', 3600);

        return {
            token,
            channelName,
            appId: AGORA_APP_ID,
            uid,
        };
    }

    /**
     * Generate unique UID from user ID
     */
    private generateUid(userId: string): number {
        // Convert UUID to a number (simple hash)
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Validate token
     */
    validateToken(token: string, channelName: string, uid: number): boolean {
        try {
            // Token validation logic would go here
            // For now, we'll just check if token exists
            return !!token && !!channelName && !!uid;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get call duration (to be implemented with call logs)
     */
    async getCallDuration(channelName: string): Promise<number> {
        // This would typically query Agora's analytics API
        // For now, return 0
        return 0;
    }
}
