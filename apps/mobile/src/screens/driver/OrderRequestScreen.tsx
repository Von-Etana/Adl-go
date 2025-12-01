import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { MapPin, Clock, DollarSign, X } from 'lucide-react-native';

export const OrderRequestScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { delivery } = route.params || {};

    const [timeLeft, setTimeLeft] = useState(30);
    const [bidAmount, setBidAmount] = useState(delivery?.offerPrice?.toString() || '1500');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigation.goBack();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAccept = () => {
        console.log('Accepted order at:', bidAmount);
        navigation.goBack();
    };

    const handleDecline = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleDecline} style={styles.closeButton}>
                    <X size={24} color={colors.primary.dark} />
                </TouchableOpacity>
                <Text style={styles.timer}>{timeLeft}s</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>New Delivery Request</Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <Clock size={20} color={colors.primary.orange} />
                        </View>
                        <View>
                            <Text style={styles.label}>Pickup Time</Text>
                            <Text style={styles.value}>Now (5 mins away)</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <MapPin size={20} color={colors.primary.dark} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Pickup</Text>
                            <Text style={styles.value}>{delivery?.pickup?.address || 'Pickup Location'}</Text>
                        </View>
                    </View>

                    <View style={styles.connector} />

                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <MapPin size={20} color={colors.semantic.success} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Dropoff</Text>
                            <Text style={styles.value}>{delivery?.dropoff?.address || 'Dropoff Location'}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <DollarSign size={20} color={colors.semantic.success} />
                        </View>
                        <View>
                            <Text style={styles.label}>Customer Offer</Text>
                            <Text style={styles.price}>₦{parseInt(delivery?.offerPrice || '0').toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bidSection}>
                    <Text style={styles.bidLabel}>Your Bid (₦)</Text>
                    <View style={styles.bidInputContainer}>
                        <TouchableOpacity
                            style={styles.bidButton}
                            onPress={() => setBidAmount((prev: string) => (parseInt(prev) - 100).toString())}
                        >
                            <Text style={styles.bidButtonText}>-</Text>
                        </TouchableOpacity>

                        <Input
                            value={bidAmount}
                            onChangeText={setBidAmount}
                            keyboardType="numeric"
                            containerStyle={styles.inputContainer}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            style={styles.bidButton}
                            onPress={() => setBidAmount((prev: string) => (parseInt(prev) + 100).toString())}
                        >
                            <Text style={styles.bidButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    title={`Bid ₦${parseInt(bidAmount).toLocaleString()}`}
                    onPress={handleAccept}
                />
                <TouchableOpacity style={styles.declineLink} onPress={handleDecline}>
                    <Text style={styles.declineLinkText}>Decline Request</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.lightGray,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.base,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        ...typography.h3,
        color: colors.primary.orange,
    },
    content: {
        flex: 1,
        padding: spacing.base,
    },
    title: {
        ...typography.h2,
        color: colors.primary.dark,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    card: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.md,
        marginBottom: spacing.xl,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    label: {
        ...typography.caption,
        color: colors.secondary.textGray,
        marginBottom: 2,
    },
    value: {
        ...typography.bodyLarge,
        color: colors.primary.dark,
        fontWeight: '500' as TextStyle['fontWeight'],
    },
    price: {
        ...typography.h3,
        color: colors.primary.dark,
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondary.lightGray,
        marginVertical: spacing.md,
    },
    connector: {
        width: 2,
        height: 20,
        backgroundColor: colors.secondary.mediumGray,
        marginLeft: 19,
        marginVertical: 4,
    },
    bidSection: {
        alignItems: 'center',
    },
    bidLabel: {
        ...typography.body,
        color: colors.secondary.textGray,
        marginBottom: spacing.sm,
    },
    bidInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    bidButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.secondary.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    bidButtonText: {
        fontSize: 24,
        color: colors.primary.dark,
    },
    inputContainer: {
        width: 120,
        marginBottom: 0,
    },
    input: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600' as TextStyle['fontWeight'],
    },
    footer: {
        padding: spacing.base,
        backgroundColor: colors.secondary.white,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        ...shadows.lg,
    },
    declineLink: {
        alignItems: 'center',
        marginTop: spacing.md,
    },
    declineLinkText: {
        ...typography.body,
        color: colors.secondary.textGray,
    },
});
