import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import { ArrowLeft, Edit2, User, Phone, Mail, MapPin, Shield, LogOut, Gift } from 'lucide-react-native';
import { AnimatedIcon } from '../../components/atoms/AnimatedIcon';

export const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        // Navigation will automatically handle reset due to auth state change
    };

    const renderInfoItem = (icon: any, label: string, value?: string) => (
        <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
                <AnimatedIcon icon={icon} size={20} color={colors.primary.orange} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || 'Not set'}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.primary.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('EditProfile')}
                    style={styles.editButton}
                >
                    <Edit2 size={20} color={colors.primary.orange} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        {user?.profilePhotoUrl ? (
                            <Image source={{ uri: user.profilePhotoUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <User size={40} color={colors.secondary.textGray} />
                            </View>
                        )}
                    </View>
                    <Text style={styles.name}>{user?.fullName}</Text>
                    <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>
                </View>

                {/* Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.card}>
                        {renderInfoItem(Phone, 'Phone Number', user?.phoneNumber)}
                        <View style={styles.divider} />
                        {renderInfoItem(Mail, 'Email', user?.email)}
                        <View style={styles.divider} />
                        {renderInfoItem(MapPin, 'Address', user?.address)}
                    </View>
                </View>

                {/* Emergency Contact */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Emergency Contact</Text>
                    <View style={styles.card}>
                        {renderInfoItem(Shield, 'Name', user?.emergencyContactName)}
                        <View style={styles.divider} />
                        {renderInfoItem(Phone, 'Phone', user?.emergencyContactPhone)}
                    </View>
                </View>

                {/* Refer & Earn */}
                <TouchableOpacity
                    style={styles.referralButton}
                    onPress={() => navigation.navigate('Referral')}
                >
                    <Gift size={24} color={colors.secondary.white} />
                    <View style={styles.referralContent}>
                        <Text style={styles.referralTitle}>Refer & Earn</Text>
                        <Text style={styles.referralSubtitle}>Get ₦500 for every friend</Text>
                    </View>
                    <ArrowLeft size={20} color={colors.secondary.white} style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LogOut size={20} color={colors.semantic.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
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
    editButton: {
        padding: spacing.xs,
    },
    content: {
        padding: spacing.base,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        marginBottom: spacing.md,
        ...shadows.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: colors.secondary.white,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.secondary.mediumGray,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.secondary.white,
    },
    name: {
        ...typography.h2,
        color: colors.primary.dark,
        marginBottom: 4,
    },
    role: {
        ...typography.caption,
        color: colors.secondary.textGray,
        fontWeight: '600' as any,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.secondary.textGray,
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    card: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...shadows.sm,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${colors.primary.orange}10`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        ...typography.caption,
        fontSize: 10,
        color: colors.secondary.textGray,
        marginBottom: 2,
    },
    infoValue: {
        ...typography.body,
        color: colors.primary.dark,
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondary.lightGray,
        marginVertical: spacing.xs,
    },
    referralButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.orange,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.lg,
        ...shadows.md,
    },
    referralContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    referralTitle: {
        ...typography.h4,
        color: colors.secondary.white,
    },
    referralSubtitle: {
        ...typography.caption,
        color: colors.secondary.white,
        opacity: 0.9,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${colors.semantic.error}10`,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.lg,
    },
    logoutText: {
        ...typography.body,
        color: colors.semantic.error,
        fontWeight: '600' as any,
        marginLeft: spacing.sm,
    },
});
