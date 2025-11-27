import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY || '';
const FLUTTERWAVE_PUBLIC_KEY = process.env.FLUTTERWAVE_PUBLIC_KEY || '';
const FLUTTERWAVE_ENCRYPTION_KEY = process.env.FLUTTERWAVE_ENCRYPTION_KEY || '';
const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

export class FlutterwaveService {
    private headers = {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
    };

    /**
     * Initialize payment
     */
    async initializePayment(data: {
        amount: number;
        email: string;
        phoneNumber: string;
        name: string;
        txRef: string;
        redirectUrl: string;
    }): Promise<{ link: string; txRef: string }> {
        try {
            const response = await axios.post(
                `${FLUTTERWAVE_BASE_URL}/payments`,
                {
                    tx_ref: data.txRef,
                    amount: data.amount,
                    currency: 'NGN',
                    redirect_url: data.redirectUrl,
                    payment_options: 'card,banktransfer,ussd',
                    customer: {
                        email: data.email,
                        phonenumber: data.phoneNumber,
                        name: data.name,
                    },
                    customizations: {
                        title: 'ADLgo Wallet Funding',
                        description: 'Fund your ADLgo wallet',
                        logo: 'https://your-logo-url.com/logo.png',
                    },
                },
                { headers: this.headers }
            );

            return {
                link: response.data.data.link,
                txRef: data.txRef,
            };
        } catch (error: any) {
            console.error('Flutterwave Init Error:', error.response?.data || error.message);
            throw new Error('Failed to initialize payment');
        }
    }

    /**
     * Verify payment
     */
    async verifyPayment(transactionId: string): Promise<{
        status: string;
        amount: number;
        currency: string;
        txRef: string;
    }> {
        try {
            const response = await axios.get(
                `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
                { headers: this.headers }
            );

            const { status, amount, currency, tx_ref } = response.data.data;

            return {
                status,
                amount,
                currency,
                txRef: tx_ref,
            };
        } catch (error: any) {
            console.error('Flutterwave Verify Error:', error.response?.data || error.message);
            throw new Error('Failed to verify payment');
        }
    }

    /**
     * Pay bills (Airtime, Data, Electricity, Cable TV)
     */
    async payBill(data: {
        type: 'airtime' | 'data' | 'electricity' | 'cable';
        amount: number;
        phoneNumber?: string;
        billerId?: string;
        customerId?: string;
        reference: string;
    }): Promise<{ reference: string; status: string }> {
        try {
            let endpoint = '';
            let payload: any = {
                amount: data.amount,
                reference: data.reference,
            };

            switch (data.type) {
                case 'airtime':
                    endpoint = '/bills/airtime';
                    payload.phone_number = data.phoneNumber;
                    break;
                case 'data':
                    endpoint = '/bills/data-bundles';
                    payload.phone_number = data.phoneNumber;
                    payload.biller_code = data.billerId;
                    break;
                case 'electricity':
                    endpoint = '/bills/electricity';
                    payload.biller_code = data.billerId;
                    payload.customer = data.customerId;
                    break;
                case 'cable':
                    endpoint = '/bills/cable';
                    payload.biller_code = data.billerId;
                    payload.customer = data.customerId;
                    break;
            }

            const response = await axios.post(
                `${FLUTTERWAVE_BASE_URL}${endpoint}`,
                payload,
                { headers: this.headers }
            );

            return {
                reference: response.data.data.reference,
                status: response.data.data.status,
            };
        } catch (error: any) {
            console.error('Flutterwave Bill Payment Error:', error.response?.data || error.message);
            throw new Error('Failed to pay bill');
        }
    }

    /**
     * Get bill categories
     */
    async getBillCategories(type: string): Promise<any[]> {
        try {
            const response = await axios.get(
                `${FLUTTERWAVE_BASE_URL}/bills/${type}/billers`,
                { headers: this.headers }
            );

            return response.data.data;
        } catch (error: any) {
            console.error('Flutterwave Get Billers Error:', error.response?.data || error.message);
            throw new Error('Failed to get bill categories');
        }
    }

    /**
     * Validate bill customer
     */
    async validateCustomer(
        billerId: string,
        customerId: string,
        type: string
    ): Promise<{ valid: boolean; customerName?: string }> {
        try {
            const response = await axios.post(
                `${FLUTTERWAVE_BASE_URL}/bills/${type}/validate`,
                {
                    item_code: billerId,
                    code: customerId,
                },
                { headers: this.headers }
            );

            return {
                valid: response.data.status === 'success',
                customerName: response.data.data?.customer_name,
            };
        } catch (error: any) {
            console.error('Flutterwave Validate Error:', error.response?.data || error.message);
            return { valid: false };
        }
    }

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(signature: string, payload: any): boolean {
        const hash = crypto
            .createHmac('sha256', process.env.FLUTTERWAVE_WEBHOOK_HASH || '')
            .update(JSON.stringify(payload))
            .digest('hex');

        return hash === signature;
    }

    /**
     * Transfer to bank account (for driver payouts)
     */
    async transferToBank(data: {
        accountNumber: string;
        accountBank: string;
        amount: number;
        narration: string;
        reference: string;
    }): Promise<{ reference: string; status: string }> {
        try {
            const response = await axios.post(
                `${FLUTTERWAVE_BASE_URL}/transfers`,
                {
                    account_bank: data.accountBank,
                    account_number: data.accountNumber,
                    amount: data.amount,
                    narration: data.narration,
                    currency: 'NGN',
                    reference: data.reference,
                },
                { headers: this.headers }
            );

            return {
                reference: response.data.data.reference,
                status: response.data.data.status,
            };
        } catch (error: any) {
            console.error('Flutterwave Transfer Error:', error.response?.data || error.message);
            throw new Error('Failed to transfer funds');
        }
    }

    /**
     * Get Nigerian banks
     */
    async getBanks(): Promise<Array<{ code: string; name: string }>> {
        try {
            const response = await axios.get(
                `${FLUTTERWAVE_BASE_URL}/banks/NG`,
                { headers: this.headers }
            );

            return response.data.data.map((bank: any) => ({
                code: bank.code,
                name: bank.name,
            }));
        } catch (error: any) {
            console.error('Flutterwave Get Banks Error:', error.response?.data || error.message);
            throw new Error('Failed to get banks');
        }
    }
}
