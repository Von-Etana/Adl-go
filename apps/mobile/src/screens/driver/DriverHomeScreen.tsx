import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Menu, Bell, DollarSign, Navigation } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { useDriverStore } from '../../store/driverStore';
import { useAuthStore } from '../../store/authStore';
import { socketService } from '../../services/socket';

export const DriverHomeScreen = () => {
    const navigation = useNavigation<any>();
    const { isOnline, toggleOnline, earnings } = useDriverStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (isOnline) {
            socketService.connect();

            socketService.on('new_delivery_request', (data) => {
                console.log('New delivery request received:', data);
                navigation.navigate('OrderRequest', { delivery: data });
            });
        } else {
            socketService.off('new_delivery_request');
            socketService.disconnect();
        }

        return () => {
            socketService.off('new_delivery_request');
        };
    }, [isOnline, navigation]);

    return (
        <View style={styles.container}>
            {/* Map Background Placeholder */}
            <View style={styles.mapBackground}>
                <Text style={styles.mapText}>Map View</Text>
                {isOnline && (
                    <View style={styles.radar}>
                        <ActivityIndicator size="large" color={colors.secondary.white} />
                        <Text style={styles.radarText}>Finding orders...</Text>
                    </View>
                )}
            </View>

            {/* Header Overlay */}
            <SafeAreaView style={styles.headerContainer} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Menu size={24} color={colors.primary.dark} />
                    </TouchableOpacity>

                    <View style={styles.statusContainer}>
                        <Text style={[styles.statusText, isOnline ? styles.onlineText : styles.offlineText]}>
                            {isOnline ? 'You are Online' : 'You are Offline'}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.iconButton}>
                        <Bell size={24} color={colors.primary.dark} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Bottom Panel */}
            <View style={styles.bottomPanel}>
                <View style={styles.onlineToggle}>
                    <Text style={styles.toggleLabel}>{isOnline ? 'Go Offline' : 'Go Online'}</Text>
                    <Switch
                        value={isOnline}
                        onValueChange={toggleOnline}
                        trackColor={{ false: colors.secondary.mediumGray, true: colors.semantic.success }}
                        thumbColor={colors.secondary.white}
                    />
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <DollarSign size={20} color={colors.semantic.success} />
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Today's Earnings</Text>
                            <Text style={styles.statValue}>₦{earnings.today.toLocaleString()}</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: `${colors.primary.orange}20` }]}>
                            <Navigation size={20} color={colors.primary.orange} />
                        </View>
                        <View>
                            <Text style={styles.statLabel}>Trips</Text>
                            <Text style={styles.statValue}>12</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    mapBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapText: {
        ...typography.h3,
        color: colors.secondary.textGray,
        opacity: 0.5,
    },
    radar: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
    },
    radarText: {
        ...typography.body,
        color: colors.secondary.white,
        marginTop: spacing.md,
    },
    headerContainer: {
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    statusContainer: {
        backgroundColor: colors.secondary.white,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        ...shadows.sm,
    },
    statusText: {
        ...typography.bodySmall,
        fontWeight: '600' as TextStyle['fontWeight'],
    },
    onlineText: {
        color: colors.semantic.success,
    },
    offlineText: {
        color: colors.secondary.textGray,
    },
    bottomPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.secondary.white,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.base,
        paddingBottom: spacing.xxl,
        ...shadows.lg,
    },
    onlineToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
        backgroundColor: colors.secondary.lightGray,
        padding: spacing.md,
        borderRadius: borderRadius.md,
    },
    toggleLabel: {
        ...typography.h4,
        color: colors.primary.dark,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    statCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.secondary.lightGray,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${colors.semantic.success}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    statLabel: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    statValue: {
        ...typography.h4,
        color: colors.primary.dark,
    },
});
