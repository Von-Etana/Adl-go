import { AppDataSource } from '../config/database';
import { Bid, BidStatus } from '../entities/Bid';
import { Delivery, DeliveryStatus } from '../entities/Delivery';
import { User } from '../entities/User';
import { SocketGateway } from '../gateways/socket.gateway';

export class BiddingService {
    private bidRepository = AppDataSource.getRepository(Bid);
    private deliveryRepository = AppDataSource.getRepository(Delivery);

    async placeBid(driver: User, deliveryId: string, amount: number) {
        const delivery = await this.deliveryRepository.findOne({ where: { id: deliveryId }, relations: ['customer'] });
        if (!delivery) throw new Error('Delivery not found');
        if (delivery.status !== DeliveryStatus.PENDING && delivery.status !== DeliveryStatus.BIDDING) {
            throw new Error('Delivery is not open for bidding');
        }

        // Update delivery status to BIDDING if it was PENDING
        if (delivery.status === DeliveryStatus.PENDING) {
            delivery.status = DeliveryStatus.BIDDING;
            await this.deliveryRepository.save(delivery);
        }

        const bid = this.bidRepository.create({
            driver,
            delivery,
            amount,
            status: BidStatus.PENDING,
        });

        const savedBid = await this.bidRepository.save(bid);

        // Notify the customer room about the new bid
        // Assuming customer is in a room named after their user ID or the delivery ID
        const io = SocketGateway.getInstance().getIO();
        io.to(delivery.customer.id).emit('new_bid', {
            ...savedBid,
            driver: {
                id: driver.id,
                name: driver.fullName,
                rating: 4.8, // Placeholder, should come from driver stats
                vehicle: 'Vehicle Info Placeholder', // Should come from driver profile
            }
        });

        // Also emit to the delivery room if we are using that
        io.to(deliveryId).emit('new_bid', savedBid);

        return savedBid;
    }

    async getBidsForDelivery(deliveryId: string) {
        return await this.bidRepository.find({
            where: { delivery: { id: deliveryId } },
            relations: ['driver'],
            order: { amount: 'ASC' },
        });
    }

    async acceptBid(bidId: string, customerId: string) {
        const bid = await this.bidRepository.findOne({
            where: { id: bidId },
            relations: ['delivery', 'delivery.customer', 'driver'],
        });

        if (!bid) throw new Error('Bid not found');
        if (bid.delivery.customer.id !== customerId) {
            throw new Error('Unauthorized to accept this bid');
        }
        if (bid.delivery.status !== DeliveryStatus.BIDDING && bid.delivery.status !== DeliveryStatus.PENDING) {
            throw new Error('Delivery is no longer available');
        }

        // Update Bid Status
        bid.status = BidStatus.ACCEPTED;
        await this.bidRepository.save(bid);

        // Update Delivery Status and assign Driver
        bid.delivery.status = DeliveryStatus.ACCEPTED;
        bid.delivery.driver = bid.driver;
        await this.deliveryRepository.save(bid.delivery);

        // Reject other bids
        await this.bidRepository
            .createQueryBuilder()
            .update(Bid)
            .set({ status: BidStatus.REJECTED })
            .where('deliveryId = :deliveryId', { deliveryId: bid.delivery.id })
            .andWhere('id != :bidId', { bidId: bid.id })
            .execute();

        // Notify the driver that their bid was accepted
        const io = SocketGateway.getInstance().getIO();
        io.to(bid.driver.id).emit('bid_accepted', {
            deliveryId: bid.delivery.id,
            pickup: bid.delivery.pickupAddress,
            dropoff: bid.delivery.dropoffAddress,
            customer: {
                name: bid.delivery.customer.fullName,
                phone: bid.delivery.customer.phoneNumber,
            }
        });

        return bid;
    }
}
