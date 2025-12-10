import { create } from 'zustand';

interface Location {
    address: string;
    latitude: number;
    longitude: number;
}

interface DeliveryState {
    pickup: Location | null;
    dropoff: Location | null;
    packageType: string;
    description: string;
    packageValue: string;
    packageWeight: string;
    packageDescription: string;
    insuranceRequested: boolean;
    offerPrice: string;
    vehicleType: 'bike' | 'car' | 'van' | 'truck';
    category: 'express' | 'standard' | 'same_day';

    setPickup: (location: Location) => void;
    setDropoff: (location: Location) => void;
    setPackageDetails: (type: string, description: string) => void;
    setPackageWeight: (weight: string) => void;
    setPackageDescription: (description: string) => void;
    setOfferPrice: (price: string) => void;
    setVehicleType: (type: 'bike' | 'car' | 'van' | 'truck') => void;
    setCategory: (category: 'express' | 'standard' | 'same_day') => void;
    setPackageValue: (value: string) => void;
    setInsuranceRequested: (requested: boolean) => void;
    consolidationItems: { description: string; weight: string; value: string }[];
    setConsolidationItems: (items: { description: string; weight: string; value: string }[]) => void;
    destinationCountry: string;
    setDestinationCountry: (country: string) => void;
    customsDeclaration: { description: string; quantity: string; value: string }[];
    setCustomsDeclaration: (items: { description: string; quantity: string; value: string }[]) => void;
    destinationState: string;
    setDestinationState: (state: string) => void;
    reset: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
    pickup: null,
    dropoff: null,
    packageType: '',
    description: '',
    offerPrice: '',
    vehicleType: 'bike',
    category: 'standard',
    packageValue: '',
    packageWeight: '',
    packageDescription: '',
    insuranceRequested: false,
    consolidationItems: [],
    destinationCountry: '',
    customsDeclaration: [],
    destinationState: '',

    setPickup: (pickup) => set({ pickup }),
    setDropoff: (dropoff) => set({ dropoff }),
    setPackageDetails: (packageType, description) => set({ packageType, description }),
    setOfferPrice: (offerPrice) => set({ offerPrice }),
    setVehicleType: (vehicleType) => set({ vehicleType }),
    setCategory: (category) => set({ category }),
    setPackageValue: (packageValue) => set({ packageValue }),
    setPackageWeight: (packageWeight) => set({ packageWeight }),
    setPackageDescription: (packageDescription) => set({ packageDescription }),
    setInsuranceRequested: (insuranceRequested) => set({ insuranceRequested }),
    setConsolidationItems: (consolidationItems) => set({ consolidationItems }),
    setDestinationCountry: (destinationCountry) => set({ destinationCountry }),
    setCustomsDeclaration: (customsDeclaration) => set({ customsDeclaration }),
    setDestinationState: (destinationState) => set({ destinationState }),
    reset: () => set({
        pickup: null,
        dropoff: null,
        packageType: '',
        description: '',
        offerPrice: '',
        vehicleType: 'bike',
        category: 'standard',
        packageValue: '',
        packageWeight: '',
        packageDescription: '',
        insuranceRequested: false,
        consolidationItems: [],
        destinationCountry: '',
        customsDeclaration: [],
        destinationState: '',
    }),
}));
