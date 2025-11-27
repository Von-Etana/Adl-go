import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TERMII_API_KEY = process.env.TERMII_API_KEY || '';
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'ADLgo';
const TERMII_BASE_URL = 'https://api.ng.termii.com/api';

export class TermiiService {
    /**
     * Send OTP via SMS
     */
    async sendOTP(phoneNumber: string, otp: string): Promise<void> {
        try {
            const response = await axios.post(
                `${TERMII_BASE_URL}/sms/send`,
                {
                    to: phoneNumber,
                    from: TERMII_SENDER_ID,
                    sms: `Your ADLgo verification code is: ${otp}. Valid for 10 minutes.`,
                    type: 'plain',
                    channel: 'generic',
                    api_key: TERMII_API_KEY,
                }
            );

            if (response.data.message !== 'Successfully Sent') {
                throw new Error('Failed to send OTP');
            }
        } catch (error: any) {
            console.error('Termii OTP Error:', error.response?.data || error.message);
            throw new Error('Failed to send OTP');
        }
    }

    /**
     * Send OTP using Termii's built-in OTP service
     */
    async sendTermiiOTP(phoneNumber: string): Promise<string> {
        try {
            const response = await axios.post(
                `${TERMII_BASE_URL}/sms/otp/send`,
                {
                    api_key: TERMII_API_KEY,
                    message_type: 'NUMERIC',
                    to: phoneNumber,
                    from: TERMII_SENDER_ID,
                    channel: 'generic',
                    pin_attempts: 3,
                    pin_time_to_live: 10,
                    pin_length: 6,
                    pin_placeholder: '< 1234 >',
                    message_text: 'Your ADLgo verification code is < 1234 >. Valid for 10 minutes.',
                    pin_type: 'NUMERIC',
                }
            );

            return response.data.pinId;
        } catch (error: any) {
            console.error('Termii OTP Error:', error.response?.data || error.message);
            throw new Error('Failed to send OTP');
        }
    }

    /**
     * Verify OTP sent via Termii
     */
    async verifyTermiiOTP(pinId: string, pin: string): Promise<boolean> {
        try {
            const response = await axios.post(
                `${TERMII_BASE_URL}/sms/otp/verify`,
                {
                    api_key: TERMII_API_KEY,
                    pin_id: pinId,
                    pin,
                }
            );

            return response.data.verified === 'True';
        } catch (error: any) {
            console.error('Termii Verify Error:', error.response?.data || error.message);
            return false;
        }
    }

    /**
     * Send generic SMS notification
     */
    async sendSMS(phoneNumber: string, message: string): Promise<void> {
        try {
            await axios.post(`${TERMII_BASE_URL}/sms/send`, {
                to: phoneNumber,
                from: TERMII_SENDER_ID,
                sms: message,
                type: 'plain',
                channel: 'generic',
                api_key: TERMII_API_KEY,
            });
        } catch (error: any) {
            console.error('Termii SMS Error:', error.response?.data || error.message);
            throw new Error('Failed to send SMS');
        }
    }

    /**
     * Send delivery notification to driver
     */
    async notifyDriverNewDelivery(phoneNumber: string, pickupAddress: string): Promise<void> {
        const message = `New delivery request! Pickup: ${pickupAddress}. Open ADLgo app to bid.`;
        await this.sendSMS(phoneNumber, message);
    }

    /**
     * Send bid acceptance notification
     */
    async notifyBidAccepted(phoneNumber: string, customerName: string): Promise<void> {
        const message = `Your bid has been accepted by ${customerName}! Check the app for details.`;
        await this.sendSMS(phoneNumber, message);
    }

    /**
     * Send delivery completion notification
     */
    async notifyDeliveryCompleted(phoneNumber: string, amount: number): Promise<void> {
        const message = `Delivery completed! ₦${amount.toLocaleString()} has been added to your wallet.`;
        await this.sendSMS(phoneNumber, message);
    }
}
