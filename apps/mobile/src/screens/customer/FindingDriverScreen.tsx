import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { useBiddingStore } from '../../store/biddingStore';
import { useDeliveryStore } from '../../store/deliveryStore';
import { BidCard } from '../../components/molecules/BidCard';
import { socketService } from '../../services/socket';
import { apiService } from '../../services/api';
import { X, MapPin } from 'lucide-react-native';

export const FindingDriverScreen = () => {
    const navigation = useNavigation<any>();
    const { bids, activeDeliveryId, addBid, acceptBid, reset } = useBiddingStore();
    const { pickup, dropoff, offerPrice } = useDeliveryStore();

    useEffect(() => {
        // Connect to socket and listen for bids
        socketService.connect();

        if (activeDeliveryId) {
            // Join the delivery room
            socketService.emit('join_delivery', activeDeliveryId);

            // Listen for new bids
            socketService.on('new_bid', (data) => {
                console.log('New bid received:', data);
                addBid({
                    id: data.bidId,
                    driver: {
                        id: data.driver.id,
                        name: data.driver.name,
                        rating: data.driver.rating || 4.5,
                        vehicle: data.driver.vehicle || 'Vehicle',
                        arrivalTime: data.driver.arrivalTime || '5 mins',
                    },
                    amount: data.amount,
                    status: 'pending',
                });
            });
        }

        return () => {
            if (activeDeliveryId) {
                socketService.emit('leave_delivery', activeDeliveryId);
                socketService.off('new_bid');
            }
        };
    }, [activeDeliveryId]);

    const handleCancel = () => {
        reset();
        navigation.navigate('CustomerHome');
    };

    const handleAccept = async (bidId: string) => {
        try {
            // Accept bid via API
            await apiService.post(`/deliveries/${activeDeliveryId}/bids/${bidId}/accept`);

            // Update local state
            acceptBid(bidId);

            // Navigate to Active Delivery (to be implemented)
            console.log('Accepted bid:', bidId);
            // navigation.navigate('ActiveDelivery', { deliveryId: activeDeliveryId });
        } catch (error: any) {
            console.error('Failed to accept bid:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                    <X size={24} color={colors.primary.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Finding Driver</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.mapArea}>
                {/* Placeholder for Map with Radar Animation */}
                <View style={styles.radarContainer}>
                    <ActivityIndicator size="large" color={colors.primary.orange} />
                    <Text style={styles.radarText}>Searching for nearby drivers...</Text>
                </View>
            </View>

            <View style={styles.bottomSheet}>
                <View style={styles.tripSummary}>
                    <View style={styles.tripRow}>
                        <MapPin size={16} color={colors.primary.orange} />
                        <Text style={styles.tripText} numberOfLines={1}>{pickup?.address || 'Pickup'}</Text>
                    </View>
                    <View style={styles.tripRow}>
                        <MapPin size={16} color={colors.semantic.success} />
                        <Text style={styles.tripText} numberOfLines={1}>{dropoff?.address || 'Dropoff'}</Text>
                    </View>
                    <Text style={styles.offerText}>Your Offer: ₦{offerPrice}</Text>
                </View>

                <Text style={styles.bidsTitle}>
                    {bids.length > 0 ? `Drivers Found (${bids.length})` : 'Waiting for bids...'}
                </Text>

                <ScrollView style={styles.bidsList} showsVerticalScrollIndicator={false}>
                    {bids.map((bid) => (
                        <BidCard
                            key={bid.id}
                            driverName={bid.driver.name}
                            rating={bid.driver.rating}
                            vehicle={bid.driver.vehicle}
                            price={bid.amount}
                            arrivalTime={bid.driver.arrivalTime}
                            onAccept={() => handleAccept(bid.id)}
                            onDecline={() => { }}
                        />
                    ))}
                    {bids.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Notifying drivers in your area...</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    closeButton: {
        padding: spacing.xs,
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.full,
        ...shadows.sm,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.primary.dark,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    mapArea: {
        flex: 1,
        backgroundColor: '#E5E5E5', // Map placeholder color
        justifyContent: 'center',
        alignItems: 'center',
    },
    radarContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
    },
    radarText: {
        ...typography.body,
        color: colors.secondary.textGray,
        marginTop: spacing.md,
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: colors.secondary.lightGray,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.base,
        ...shadows.lg,
        marginTop: -20,
    },
    tripSummary: {
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
    },
    tripRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    tripText: {
        ...typography.bodySmall,
        color: colors.secondary.textGray,
        marginLeft: spacing.sm,
        flex: 1,
    },
    offerText: {
        ...typography.body,
        fontWeight: '600' as TextStyle['fontWeight'],
        color: colors.primary.dark,
        marginTop: spacing.sm,
        textAlign: 'right',
    },
    bidsTitle: {
        ...typography.h4,
        color: colors.primary.dark,
        marginBottom: spacing.md,
    },
    bidsList: {
        flex: 1,
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.secondary.textGray,
    },
});
