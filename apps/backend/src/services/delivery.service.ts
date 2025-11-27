import { AppDataSource } from '../config/database';
import { Delivery, DeliveryStatus } from '../entities/Delivery';
import { User } from '../entities/User';
import { SocketGateway } from '../gateways/socket.gateway';

export class DeliveryService {
    private deliveryRepository = AppDataSource.getRepository(Delivery);

    async createDelivery(
        customer: User,
        data: {
            pickupAddress: string;
            pickupLocation: { lat: number; lng: number };
            dropoffAddress: string;
            dropoffLocation: { lat: number; lng: number };
            packageDescription: string;
            vehicleType: string;
            customerOfferPrice: number;
            packageValue?: number;
            insuranceRequested?: boolean;
        }
    ) {
        const insuranceFee = data.insuranceRequested && data.packageValue
            ? Math.max(100, data.packageValue * 0.02)
            : 0;

        const delivery = this.deliveryRepository.create({
            ...data,
            insuranceFee,
            customer,
            status: DeliveryStatus.PENDING,
        });
        const savedDelivery = await this.deliveryRepository.save(delivery);

        // Notify drivers about the new delivery request
        const io = SocketGateway.getInstance().getIO();
        io.to('drivers').emit('new_delivery_request', {
            id: savedDelivery.id,
            pickup: {
                address: savedDelivery.pickupAddress,
                location: savedDelivery.pickupLocation,
            },
            dropoff: {
                address: savedDelivery.dropoffAddress,
                location: savedDelivery.dropoffLocation,
            },
            offerPrice: savedDelivery.customerOfferPrice,
            distance: '5 km', // Placeholder, calculate actual distance
        });

        return savedDelivery;
    }

    async getDeliveryById(id: string) {
        return await this.deliveryRepository.findOne({
            where: { id },
            relations: ['customer', 'driver', 'bids', 'bids.driver'],
        });
    }

    async getAvailableDeliveries() {
        return await this.deliveryRepository.find({
            where: { status: DeliveryStatus.PENDING },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }

    async getCustomerDeliveries(customerId: string) {
        return await this.deliveryRepository.find({
            where: { customer: { id: customerId } },
            order: { createdAt: 'DESC' },
        });
    }
}
