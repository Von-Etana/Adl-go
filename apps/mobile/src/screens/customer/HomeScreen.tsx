import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { ServiceCard } from '../../components/molecules/ServiceCard';
import { RecentDeliveryCard } from '../../components/molecules/RecentDeliveryCard';
import { Package, Smartphone, Lightbulb, Tv, Menu, Bell, History, Layers, Globe, Truck } from 'lucide-react-native';

export const CustomerHomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user } = useAuthStore();
    const { balance } = useWalletStore();

    const recentDeliveries = [
        {
            id: 'H314315796',
            pickup: 'Wuse 2',
            dropoff: 'Gwarinpa',
            price: 1500,
            status: 'In Transit',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Menu size={24} color={colors.primary.dark} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.notificationButton}>
                            <Bell size={24} color={colors.primary.dark} />
                            <View style={styles.badge} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.welcomeSection}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.name}>{user?.fullName}</Text>
                    </View>
                    <View style={styles.walletCard}>
                        <Text style={styles.walletLabel}>Wallet Balance</Text>
                        <Text style={styles.walletAmount}>₦{balance.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Main Service */}
                <View style={styles.section}>
                    <ServiceCard
                        title="Send Package"
                        subtitle="Quick & Reliable"
                        icon={Package}
                        variant="large"
                        onPress={() => navigation.navigate('CreateDelivery')}
                        style={styles.mainCard}
                    />
                </View>

                {/* Shipping Services Grid */}
                <View style={styles.gridContainer}>
                    <ServiceCard
                        title="Consolidation"
                        subtitle="Combine items"
                        icon={Layers}
                        onPress={() => navigation.navigate('Consolidation')}
                        color="#9C27B0"
                        style={styles.gridItem}
                    />
                    <View style={{ width: spacing.md }} />
                    <ServiceCard
                        title="International"
                        subtitle="Global shipping"
                        icon={Globe}
                        onPress={() => navigation.navigate('InternationalShipping')}
                        color="#2196F3"
                        style={styles.gridItem}
                    />
                </View>

                <View style={[styles.gridContainer, { marginTop: -spacing.lg }]}>
                    <ServiceCard
                        title="Interstate"
                        subtitle="Nationwide"
                        onPress={() => navigation.navigate('InterstateShipping')}
                        color="#FF9800"
                        style={styles.gridItem}
                    />
                    <View style={{ width: spacing.md }} />
                    <ServiceCard
                        title="Pay Bills"
                        subtitle="Airtime & more"
                        icon={Smartphone}
                        onPress={() => { }}
                        color="#4CAF50"
                        style={styles.gridItem}
                    />
                </View>

                {/* Recent Deliveries */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Deliveries</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {recentDeliveries.map((delivery) => (
                    <RecentDeliveryCard
                        key={delivery.id}
                        delivery={delivery}
                        onPress={() => { }}
                    />
                ))}
            </View>

            {/* Bill Payment Providers */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bill Payment Providers</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providerScroll}>
                    {['MTN', 'Airtel', 'DSTV', 'GOTV', 'Ikeja'].map((provider, index) => (
                        <TouchableOpacity key={index} style={styles.providerCard}>
                            <Text style={styles.providerText}>{provider}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.lightGray,
    },
    scrollContent: {
        padding: spacing.base,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    menuButton: {
        padding: spacing.xs,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationButton: {
        padding: spacing.xs,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.semantic.error,
    },
    welcomeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    greeting: {
        ...typography.body,
        color: colors.secondary.textGray,
    },
    name: {
        ...typography.h2,
        color: colors.primary.dark,
    },
    walletCard: {
        backgroundColor: colors.primary.dark,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'flex-end',
    },
    walletLabel: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    walletAmount: {
        ...typography.h4,
        color: colors.secondary.white,
    },
    section: {
        marginBottom: spacing.xl,
    },
    mainCard: {
        marginBottom: spacing.md,
    },
    gridContainer: {
        flexDirection: 'row',
        marginBottom: spacing.xl,
    },
    gridItem: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.primary.dark,
    },
    seeAll: {
        ...typography.bodySmall,
        color: colors.primary.orange,
    },
    providerScroll: {
        marginTop: spacing.sm,
    },
    providerCard: {
        backgroundColor: colors.secondary.white,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        marginRight: spacing.md,
        ...shadows.sm,
    },
    providerText: {
        ...typography.body,
        fontWeight: '600',
        color: colors.primary.dark,
    },
});
