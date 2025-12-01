import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { Button } from '../atoms/Button';
import { Star } from 'lucide-react-native';

interface BidCardProps {
    driverName: string;
    rating: number;
    vehicle: string;
    price: number;
    arrivalTime: string;
    onAccept: () => void;
    onDecline: () => void;
}

export const BidCard: React.FC<BidCardProps> = ({
    driverName,
    rating,
    vehicle,
    price,
    arrivalTime,
    onAccept,
    onDecline,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.driverInfo}>
                    <View style={styles.avatarPlaceholder} />
                    <View style={styles.infoText}>
                        <Text style={styles.name}>{driverName}</Text>
                        <View style={styles.ratingContainer}>
                            <Star size={14} color={colors.semantic.warning} fill={colors.semantic.warning} />
                            <Text style={styles.rating}>{rating}</Text>
                            <Text style={styles.vehicle}>• {vehicle}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>₦{price.toLocaleString()}</Text>
                    <Text style={styles.time}>{arrivalTime}</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
                    <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <Button
                    title="Accept"
                    onPress={onAccept}
                    style={styles.acceptButton}
                    textStyle={{ fontSize: 14 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.secondary.mediumGray,
        marginRight: spacing.md,
    },
    infoText: {
        justifyContent: 'center',
    },
    name: {
        ...typography.body,
        fontWeight: '600' as TextStyle['fontWeight'],
        color: colors.primary.dark,
        marginBottom: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        ...typography.caption,
        color: colors.primary.dark,
        marginLeft: 4,
        marginRight: 4,
        fontWeight: '600' as TextStyle['fontWeight'],
    },
    vehicle: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        ...typography.h4,
        color: colors.primary.dark,
    },
    time: {
        ...typography.caption,
        color: colors.semantic.success,
        fontWeight: '500' as TextStyle['fontWeight'],
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.md,
    },
    declineButton: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: colors.secondary.lightGray,
    },
    declineText: {
        ...typography.button,
        color: colors.primary.dark,
        fontSize: 14,
    },
    acceptButton: {
        flex: 1,
        height: 44,
    },
});
