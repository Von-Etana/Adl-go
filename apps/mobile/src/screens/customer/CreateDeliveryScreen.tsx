import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { useDeliveryStore } from '../../store/deliveryStore';
import { useBiddingStore } from '../../store/biddingStore';
import { apiService } from '../../services/api';
import { ArrowLeft, MapPin, Package, DollarSign, Truck, Shield } from 'lucide-react-native';

const STEPS = ['Locations', 'Details', 'Vehicle', 'Review'];

export const CreateDeliveryScreen = () => {
    const navigation = useNavigation<any>();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const store = useDeliveryStore();
    const { setActiveDelivery } = useBiddingStore();

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit delivery to backend
            setLoading(true);
            try {
                const response = await apiService.post('/deliveries', {
                    pickupAddress: store.pickup?.address,
                    pickupLocation: {
                        lat: store.pickup?.latitude || 0,
                        lng: store.pickup?.longitude || 0,
                    },
                    dropoffAddress: store.dropoff?.address,
                    dropoffLocation: {
                        lat: store.dropoff?.latitude || 0,
                        lng: store.dropoff?.longitude || 0,
                    },
                    packageDescription: `${store.packageType} - ${store.description}`,
                    vehicleType: store.vehicleType,
                    customerOfferPrice: parseFloat(store.offerPrice),
                    packageValue: store.packageValue ? parseFloat(store.packageValue) : undefined,
                    insuranceRequested: store.insuranceRequested,
                });

                // Set active delivery ID for bidding
                setActiveDelivery(response.data.id);

                // Navigate to Finding Driver screen
                navigation.navigate('FindingDriver');
            } catch (error: any) {
                Alert.alert('Error', error.response?.data?.message || 'Failed to create delivery');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            navigation.goBack();
        }
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            {STEPS.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                    <View
                        style={[
                            styles.stepDot,
                            index <= currentStep && styles.activeStepDot,
                        ]}
                    />
                    <Text
                        style={[
                            styles.stepText,
                            index <= currentStep && styles.activeStepText,
                        ]}
                    >
                        {step}
                    </Text>
                </View>
            ))}
        </View>
    );

    const renderLocationsStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Where are we going?</Text>

            <View style={styles.locationInputContainer}>
                <MapPin size={20} color={colors.primary.orange} style={styles.inputIcon} />
                <Input
                    placeholder="Pickup Location"
                    value={store.pickup?.address}
                    onChangeText={(text) => store.setPickup({ address: text, latitude: 0, longitude: 0 })}
                    containerStyle={styles.inputWrapper}
                />
            </View>

            <View style={styles.connectorLine} />

            <View style={styles.locationInputContainer}>
                <MapPin size={20} color={colors.semantic.success} style={styles.inputIcon} />
                <Input
                    placeholder="Dropoff Location"
                    value={store.dropoff?.address}
                    onChangeText={(text) => store.setDropoff({ address: text, latitude: 0, longitude: 0 })}
                    containerStyle={styles.inputWrapper}
                />
            </View>

            {/* Map Preview Placeholder */}
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapPlaceholderText}>Map Preview</Text>
            </View>
        </View>
    );

    const renderDetailsStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What are you sending?</Text>

            <Text style={styles.label}>Package Type</Text>
            <View style={styles.chipContainer}>
                {['Documents', 'Electronics', 'Food', 'Clothing', 'Other'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.chip,
                            store.packageType === type && styles.activeChip,
                        ]}
                        onPress={() => store.setPackageDetails(type, store.description)}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                store.packageType === type && styles.activeChipText,
                            ]}
                        >
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Input
                label="Description (Optional)"
                placeholder="e.g., Fragile, Handle with care"
                value={store.description}
                onChangeText={(text) => store.setPackageDetails(store.packageType, text)}
                multiline
                numberOfLines={3}
                style={{ height: 80, textAlignVertical: 'top' }}
            />

            <Text style={[styles.stepTitle, { marginTop: spacing.xl }]}>Value & Insurance</Text>
            <Input
                label="Package Value (₦)"
                placeholder="0.00"
                value={store.packageValue}
                onChangeText={store.setPackageValue}
                keyboardType="numeric"
            />

            <TouchableOpacity
                style={[
                    styles.insuranceCard,
                    store.insuranceRequested && styles.activeInsuranceCard,
                ]}
                onPress={() => store.setInsuranceRequested(!store.insuranceRequested)}
            >
                <View style={styles.insuranceHeader}>
                    <View style={styles.insuranceTitleRow}>
                        <Shield
                            size={20}
                            color={store.insuranceRequested ? colors.primary.orange : colors.secondary.textGray}
                        />
                        <Text style={styles.insuranceTitle}>Protect your package</Text>
                    </View>
                    <View style={[
                        styles.checkbox,
                        store.insuranceRequested && styles.activeCheckbox
                    ]} />
                </View>
                <Text style={styles.insuranceDescription}>
                    Get coverage for loss or damage. Fee is 2% of package value.
                </Text>
                {store.insuranceRequested && store.packageValue ? (
                    <Text style={styles.insuranceFee}>
                        Insurance Fee: ₦{Math.max(100, parseFloat(store.packageValue) * 0.02).toLocaleString()}
                    </Text>
                ) : null}
            </TouchableOpacity>

            <Text style={[styles.stepTitle, { marginTop: spacing.xl }]}>Offer your price</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.currencySymbol}>₦</Text>
                <Input
                    placeholder="0.00"
                    value={store.offerPrice}
                    onChangeText={store.setOfferPrice}
                    keyboardType="numeric"
                    containerStyle={{ flex: 1 }}
                    style={{ fontSize: 24, fontWeight: '600' }}
                />
            </View>
            <Text style={styles.helperText}>Suggested price: ₦1,500 - ₦1,800</Text>
        </View>
    );

    const renderVehicleStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Vehicle</Text>

            {['bike', 'car', 'van', 'truck'].map((type) => (
                <TouchableOpacity
                    key={type}
                    style={[
                        styles.vehicleCard,
                        store.vehicleType === type && styles.activeVehicleCard,
                    ]}
                    onPress={() => store.setVehicleType(type as any)}
                >
                    <View style={styles.vehicleIcon}>
                        <Truck size={32} color={store.vehicleType === type ? colors.primary.orange : colors.secondary.textGray} />
                    </View>
                    <View style={styles.vehicleInfo}>
                        <Text style={styles.vehicleTitle}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                        <Text style={styles.vehicleSubtitle}>Fits {type === 'bike' ? 'small' : 'large'} items</Text>
                    </View>
                    <Text style={styles.vehiclePrice}>
                        {type === 'bike' ? '₦1,200' : type === 'car' ? '₦2,500' : '₦4,000'}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderReviewStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review Order</Text>

            <View style={styles.reviewCard}>
                <View style={styles.reviewRow}>
                    <MapPin size={16} color={colors.primary.orange} />
                    <Text style={styles.reviewText}>{store.pickup?.address || 'Pickup Location'}</Text>
                </View>
                <View style={styles.reviewRow}>
                    <MapPin size={16} color={colors.semantic.success} />
                    <Text style={styles.reviewText}>{store.dropoff?.address || 'Dropoff Location'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.reviewRow}>
                    <Package size={16} color={colors.primary.dark} />
                    <Text style={styles.reviewText}>{store.packageType || 'Package Type'}</Text>
                </View>
                <View style={styles.reviewRow}>
                    <Truck size={16} color={colors.primary.dark} />
                    <Text style={styles.reviewText}>{store.vehicleType.toUpperCase()}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.reviewRow}>
                    <DollarSign size={16} color={colors.primary.dark} />
                    <Text style={[styles.reviewText, { fontWeight: '700', fontSize: 18 }]}>
                        ₦{store.offerPrice || '0.00'}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.primary.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Delivery</Text>
                <View style={{ width: 24 }} />
            </View>

            {renderStepIndicator()}

            <ScrollView contentContainerStyle={styles.content}>
                {currentStep === 0 && renderLocationsStep()}
                {currentStep === 1 && renderDetailsStep()}
                {currentStep === 2 && renderVehicleStep()}
                {currentStep === 3 && renderReviewStep()}
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title={currentStep === STEPS.length - 1 ? 'Find Driver' : 'Next'}
                    onPress={handleNext}
                    loading={loading}
                />
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
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
    },
    stepItem: {
        alignItems: 'center',
    },
    stepDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.secondary.mediumGray,
        marginBottom: 4,
    },
    activeStepDot: {
        backgroundColor: colors.primary.orange,
        width: 12,
        height: 12,
    },
    stepText: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    activeStepText: {
        color: colors.primary.orange,
        fontWeight: '600',
    },
    content: {
        padding: spacing.base,
    },
    stepContainer: {
        flex: 1,
    },
    stepTitle: {
        ...typography.h2,
        color: colors.primary.dark,
        marginBottom: spacing.lg,
    },
    locationInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    inputIcon: {
        marginTop: 16,
        marginRight: spacing.sm,
    },
    inputWrapper: {
        flex: 1,
    },
    connectorLine: {
        width: 2,
        height: 20,
        backgroundColor: colors.secondary.mediumGray,
        marginLeft: 9,
        marginBottom: spacing.sm,
    },
    mapPlaceholder: {
        height: 200,
        backgroundColor: colors.secondary.lightGray,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    mapPlaceholderText: {
        color: colors.secondary.textGray,
    },
    label: {
        ...typography.body,
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.lg,
    },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.secondary.lightGray,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
    },
    activeChip: {
        backgroundColor: colors.primary.dark,
    },
    chipText: {
        ...typography.bodySmall,
        color: colors.primary.dark,
    },
    activeChipText: {
        color: colors.secondary.white,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: '600',
        marginRight: spacing.sm,
        color: colors.primary.dark,
    },
    helperText: {
        ...typography.caption,
        color: colors.secondary.textGray,
        marginTop: spacing.xs,
    },
    vehicleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.secondary.mediumGray,
        marginBottom: spacing.md,
    },
    activeVehicleCard: {
        borderColor: colors.primary.orange,
        backgroundColor: `${colors.primary.orange}10`,
    },
    vehicleIcon: {
        marginRight: spacing.md,
    },
    vehicleInfo: {
        flex: 1,
    },
    vehicleTitle: {
        ...typography.h4,
        color: colors.primary.dark,
    },
    vehicleSubtitle: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    vehiclePrice: {
        ...typography.h4,
        color: colors.primary.dark,
    },
    reviewCard: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        ...shadows.sm,
    },
    reviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    reviewText: {
        ...typography.body,
        marginLeft: spacing.md,
        color: colors.primary.dark,
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondary.lightGray,
        marginVertical: spacing.md,
    },
    insuranceCard: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.secondary.mediumGray,
        marginTop: spacing.md,
    },
    activeInsuranceCard: {
        borderColor: colors.primary.orange,
        backgroundColor: `${colors.primary.orange}05`,
    },
    insuranceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    insuranceTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    insuranceTitle: {
        ...typography.body,
        fontWeight: '600',
        color: colors.primary.dark,
        marginLeft: spacing.sm,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.secondary.textGray,
    },
    activeCheckbox: {
        borderColor: colors.primary.orange,
        backgroundColor: colors.primary.orange,
    },
    insuranceDescription: {
        ...typography.caption,
        color: colors.secondary.textGray,
        marginLeft: 28, // Align with title text
    },
    insuranceFee: {
        ...typography.bodySmall,
        color: colors.primary.orange,
        fontWeight: '600',
        marginLeft: 28,
        marginTop: spacing.xs,
    },
    footer: {
        padding: spacing.base,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.lightGray,
    },
});
