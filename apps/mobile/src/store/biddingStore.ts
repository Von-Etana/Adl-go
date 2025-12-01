import { create } from 'zustand';

interface Driver {
    id: string;
    name: string;
    rating: number;
    vehicle: string;
    photoUrl?: string;
    arrivalTime: string;
}

interface Bid {
    id: string;
    driver: Driver;
    amount: number;
    status: 'pending' | 'accepted' | 'rejected';
}

interface BiddingState {
    activeDeliveryId: string | null;
    bids: Bid[];
    status: 'searching' | 'bidding' | 'accepted' | 'completed';

    setActiveDelivery: (id: string) => void;
    addBid: (bid: Bid) => void;
    acceptBid: (bidId: string) => void;
    rejectBid: (bidId: string) => void;
    reset: () => void;
}

export const useBiddingStore = create<BiddingState>((set) => ({
    activeDeliveryId: null,
    bids: [], // Start empty, will be populated by mock data or socket
    status: 'searching',

    setActiveDelivery: (id) => set({ activeDeliveryId: id, status: 'searching' }),

    addBid: (bid) => set((state) => ({
        bids: [...state.bids, bid],
        status: 'bidding'
    })),

    acceptBid: (bidId) => set((state) => ({
        bids: state.bids.map(b => b.id === bidId ? { ...b, status: 'accepted' } : b),
        status: 'accepted'
    })),

    rejectBid: (bidId) => set((state) => ({
        bids: state.bids.filter(b => b.id !== bidId)
    })),

    reset: () => set({ activeDeliveryId: null, bids: [], status: 'searching' }),
}));
