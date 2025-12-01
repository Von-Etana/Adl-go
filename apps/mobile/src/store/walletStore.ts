import { create } from 'zustand';

interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
}

interface WalletState {
    balance: number;
    transactions: Transaction[];
    addFunds: (amount: number) => void;
    deductFunds: (amount: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
    balance: 12000.00, // Mock balance
    transactions: [
        {
            id: '1',
            type: 'credit',
            amount: 5000,
            description: 'Wallet Funded',
            date: '2025-11-26T10:30:00Z',
        },
        {
            id: '2',
            type: 'debit',
            amount: 1500,
            description: 'Delivery Payment',
            date: '2025-11-26T09:15:00Z',
        },
    ],
    addFunds: (amount) => set((state) => ({ balance: state.balance + amount })),
    deductFunds: (amount) => set((state) => ({ balance: state.balance - amount })),
}));
