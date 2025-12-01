import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { Package, ChevronRight } from 'lucide-react-native';

interface Delivery {
    id: string;
    pickup: string;
    dropoff: string;
    price: number;
    status: string;
}

interface RecentDeliveryCardProps {
    delivery: Delivery;
    onPress: () => void;
}

export const RecentDeliveryCard: React.FC<RecentDeliveryCardProps> = ({
    delivery,
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.iconContainer}>
                <Package size={24} color={colors.primary.orange} />
            </View>

            <View style={styles.content}>
                <Text style={styles.id}>ID: {delivery.id}</Text>
                <View style={styles.row}>
                    <Text style={styles.location} numberOfLines={1}>
                        {delivery.pickup} → {delivery.dropoff}
                    </Text>
                </View>
                <Text style={styles.details}>
                    ₦{delivery.price.toLocaleString()} • {delivery.status}
                </Text>
            </View>

            <ChevronRight size={20} color={colors.secondary.textGray} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.md,
        padding: spacing.base,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: `${colors.primary.orange}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
    },
    id: {
        ...typography.caption,
        color: colors.secondary.textGray,
        marginBottom: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    location: {
        ...typography.body,
        fontWeight: '600' as TextStyle['fontWeight'],
        color: colors.primary.dark,
    },
    details: {
        ...typography.caption,
        color: colors.primary.orange,
        fontWeight: '500' as TextStyle['fontWeight'],
    },
});
