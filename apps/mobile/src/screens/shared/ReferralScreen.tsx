import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { apiService } from '../../services/api';
import { ArrowLeft, Copy, Share2, Users, Gift } from 'lucide-react-native';
import { Button } from '../../components/atoms/Button';

interface ReferralStats {
    code: string;
    totalReferrals: number;
    totalEarned: number;
    history: any[];
}

export const ReferralScreen = () => {
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ReferralStats | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await apiService.get('/referrals/stats');
            setStats(response.data);
            if (!response.data.code) {
                generateCode();
            }
        } catch (error) {
            console.error('Failed to fetch referral stats', error);
        } finally {
            setLoading(false);
        }
    };

    const generateCode = async () => {
        try {
            const response = await apiService.post('/referrals/generate', {});
            setStats(prev => prev ? { ...prev, code: response.data.code } : null);
        } catch (error) {
            console.error('Failed to generate code', error);
        }
    };

    const handleShare = async () => {
        if (!stats?.code) return;
        try {
            await Share.share({
                message: `Use my referral code ${stats.code} to get a discount on your first delivery with ADLgo!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary.orange} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.primary.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Refer & Earn</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Hero Section */}
                <View style={styles.hero}>
                    <Gift size={48} color={colors.primary.orange} />
                    <Text style={styles.heroTitle}>Invite Friends, Get Rewards</Text>
                    <Text style={styles.heroSubtitle}>
                        Share your code and earn ₦500 for every friend who completes their first delivery.
                    </Text>
                </View>

                {/* Code Section */}
                <View style={styles.codeCard}>
                    <Text style={styles.codeLabel}>Your Referral Code</Text>
                    <View style={styles.codeContainer}>
                        <Text style={styles.code}>{stats?.code || 'Generating...'}</Text>
                        <TouchableOpacity onPress={() => { /* Copy logic */ }}>
                            <Copy size={20} color={colors.primary.orange} />
                        </TouchableOpacity>
                    </View>
                    <Button
                        title="Share Code"
                        onPress={handleShare}
                        icon={<Share2 size={20} color={colors.secondary.white} />}
                        style={{ marginTop: spacing.md }}
                    />
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Users size={24} color={colors.primary.blue} />
                        <Text style={styles.statValue}>{stats?.totalReferrals || 0}</Text>
                        <Text style={styles.statLabel}>Friends Invited</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Gift size={24} color={colors.primary.green} />
                        <Text style={styles.statValue}>₦{stats?.totalEarned?.toLocaleString() || '0'}</Text>
                        <Text style={styles.statLabel}>Total Earned</Text>
                    </View>
                </View>

                {/* History Section */}
                <Text style={styles.sectionTitle}>Referral History</Text>
                {stats?.history && stats.history.length > 0 ? (
                    stats.history.map((item, index) => (
                        <View key={index} style={styles.historyItem}>
                            <View>
                                <Text style={styles.historyName}>Friend Joined</Text>
                                <Text style={styles.historyDate}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                            <Text style={[
                                styles.historyStatus,
                                { color: item.status === 'completed' ? colors.primary.green : colors.primary.orange }
                            ]}>
                                {item.status.toUpperCase()}
                            </Text>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No referrals yet. Start sharing!</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.lightGray,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.lightGray,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.primary.dark,
    },
    content: {
        padding: spacing.base,
    },
    hero: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    heroTitle: {
        ...typography.h2,
        color: colors.primary.dark,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    heroSubtitle: {
        ...typography.body,
        color: colors.secondary.textGray,
        textAlign: 'center',
        marginTop: spacing.sm,
        paddingHorizontal: spacing.xl,
    },
    codeCard: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.md,
        marginBottom: spacing.xl,
    },
    codeLabel: {
        ...typography.caption,
        color: colors.secondary.textGray,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary.lightGray,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    code: {
        ...typography.h2,
        color: colors.primary.dark,
        letterSpacing: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    statValue: {
        ...typography.h3,
        color: colors.primary.dark,
        marginTop: spacing.sm,
    },
    statLabel: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.primary.dark,
        marginBottom: spacing.md,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
    },
    historyName: {
        ...typography.body,
        fontWeight: '600',
        color: colors.primary.dark,
    },
    historyDate: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    historyStatus: {
        ...typography.caption,
        fontWeight: '600',
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
