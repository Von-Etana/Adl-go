import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { useDeliveryStore } from '../../store/deliveryStore';
import { apiService } from '../../services/api';
import { ArrowLeft, ChevronDown, Package, Truck } from 'lucide-react-native';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

export const InterstateShippingScreen = () => {
    const navigation = useNavigation<any>();
    const store = useDeliveryStore();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Locations, 2: Package Details, 3: Review
    const [showStateModal, setShowStateModal] = useState(false);

    const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

    const states = [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
        'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
        'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
        'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
    ];

    const handleNext = () => {
        if (step === 1) {
            if (!store.pickup || !store.destinationState) {
                Alert.alert('Error', 'Please select pickup location and destination state');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!store.packageDescription || !store.packageWeight || !store.packageValue) {
                Alert.alert('Error', 'Please fill in all package details');
                return;
            }
            setStep(3);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Simple pricing logic for interstate
            const basePrice = 5000;
            const weightPrice = parseFloat(store.packageWeight) * 500;
            const estimatedPrice = basePrice + weightPrice;

            const response = await apiService.post('/deliveries', {
                pickupAddress: store.pickup?.address,
                pickupLocation: {
                    lat: store.pickup?.latitude,
                    lng: store.pickup?.longitude,
                },
                dropoffAddress: store.destinationState,
                packageDescription: store.packageDescription,
                vehicleType: 'van',
                customerOfferPrice: estimatedPrice,
                packageValue: parseFloat(store.packageValue),
                packageWeight: parseFloat(store.packageWeight),
                isInterstate: true,
                destinationState: store.destinationState,
            });

            navigation.navigate('FindingDriver', { deliveryId: response.data.id });
        } catch (error) {
            Alert.alert('Error', 'Failed to create interstate shipment request');
        } finally {
            setLoading(false);
        }
    };

    const renderLocationsStep = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Where are we shipping?</Text>

            <Text style={styles.label}>Pickup Location</Text>
            <View style={styles.autocompleteContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Enter pickup address"
                    onPress={(data, details = null) => {
                        if (details) {
                            store.setPickup({
                                address: data.description,
                                latitude: details.geometry.location.lat,
                                longitude: details.geometry.location.lng,
                            });
                        }
                    }}
                    query={{
                        key: GOOGLE_API_KEY,
                        language: 'en',
                    }}
                    fetchDetails={true}
                    styles={{
                        textInput: styles.textInput,
                        listView: styles.listView,
                    }}
                />
            </View>

            <Text style={styles.label}>Destination State</Text>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowStateModal(true)}
            >
                <Text style={store.destinationState ? styles.dropdownText : styles.placeholderText}>
                    {store.destinationState || 'Select State'}
                </Text>
                <ChevronDown size={20} color={colors.secondary.textGray} />
            </TouchableOpacity>

            <Modal visible={showStateModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select State</Text>
                        <ScrollView>
                            {states.map((state) => (
                                <TouchableOpacity
                                    key={state}
                                    style={styles.stateItem}
                                    onPress={() => {
                                        store.setDestinationState(state);
                                        setShowStateModal(false);
                                    }}
                                >
                                    <Text style={styles.stateText}>{state}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button title="Cancel" onPress={() => setShowStateModal(false)} variant="outline" style={{ marginTop: spacing.md }} />
                    </View>
                </View>
            </Modal>
        </View>
    );

    const renderPackageStep = () => (
        <ScrollView style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Package Details</Text>

            <Input
                label="What are you sending?"
                value={store.packageDescription}
                onChangeText={store.setPackageDescription}
                placeholder="e.g., Box of clothes"
                icon={<Package size={20} color={colors.secondary.textGray} />}
            />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Input
                        label="Weight (kg)"
                        value={store.packageWeight}
                        onChangeText={store.setPackageWeight}
                        keyboardType="numeric"
                        placeholder="0.0"
                    />
                </View>
                <View style={{ width: spacing.md }} />
                <View style={{ flex: 1 }}>
                    <Input
                        label="Value (₦)"
                        value={store.packageValue}
                        onChangeText={store.setPackageValue}
                        keyboardType="numeric"
                        placeholder="0.00"
                    />
                </View>
            </View>
        </ScrollView>
    );

    const renderReviewStep = () => {
        const basePrice = 5000;
        const weightPrice = (parseFloat(store.packageWeight) || 0) * 500;
        const estimatedPrice = basePrice + weightPrice;

        return (
            <ScrollView style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Review Shipment</Text>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Pickup</Text>
                        <Text style={styles.summaryValue} numberOfLines={1}>{store.pickup?.address}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Destination</Text>
                        <Text style={styles.summaryValue}>{store.destinationState}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Package</Text>
                        <Text style={styles.summaryValue}>{store.packageDescription}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Weight</Text>
                        <Text style={styles.summaryValue}>{store.packageWeight} kg</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Estimated Price</Text>
                        <Text style={[styles.summaryValue, { color: colors.primary.orange }]}>
                            ₦{estimatedPrice.toLocaleString()}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (step > 1) setStep(step - 1);
                    else navigation.goBack();
                }} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.primary.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Interstate Shipping</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                {[1, 2, 3].map((s) => (
                    <View key={s} style={[
                        styles.progressStep,
                        step >= s && styles.activeProgressStep
                    ]} />
                ))}
            </View>

            <View style={styles.content}>
                {step === 1 && renderLocationsStep()}
                {step === 2 && renderPackageStep()}
                {step === 3 && renderReviewStep()}
            </View>

            <View style={styles.footer}>
                <Button
                    title={step === 3 ? "Create Request" : "Next"}
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
    progressContainer: {
        flexDirection: 'row',
        padding: spacing.base,
        gap: spacing.sm,
    },
    progressStep: {
        flex: 1,
        height: 4,
        backgroundColor: colors.secondary.mediumGray,
        borderRadius: 2,
    },
    activeProgressStep: {
        backgroundColor: colors.primary.orange,
    },
    content: {
        flex: 1,
    },
    stepContainer: {
        flex: 1,
        padding: spacing.base,
    },
    stepTitle: {
        ...typography.h2,
        color: colors.primary.dark,
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.body,
        fontWeight: '600' as any,
        color: colors.primary.dark,
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    autocompleteContainer: {
        flex: 0,
        marginBottom: spacing.md,
    },
    textInput: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        height: 50,
        fontSize: 16,
        color: colors.primary.dark,
        borderWidth: 1,
        borderColor: colors.secondary.mediumGray,
    },
    listView: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.md,
        marginTop: spacing.xs,
        borderWidth: 1,
        borderColor: colors.secondary.lightGray,
    },
    dropdownButton: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.secondary.mediumGray,
    },
    dropdownText: {
        ...typography.body,
        color: colors.primary.dark,
    },
    placeholderText: {
        ...typography.body,
        color: colors.secondary.textGray,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.secondary.white,
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        padding: spacing.lg,
        maxHeight: '70%',
    },
    modalTitle: {
        ...typography.h3,
        color: colors.primary.dark,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    stateItem: {
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.lightGray,
    },
    stateText: {
        ...typography.body,
        color: colors.primary.dark,
    },
    row: {
        flexDirection: 'row',
        marginTop: spacing.md,
    },
    summaryCard: {
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.xl,
        ...shadows.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    summaryLabel: {
        ...typography.body,
        color: colors.secondary.textGray,
    },
    summaryValue: {
        ...typography.body,
        fontWeight: '600' as any,
        color: colors.primary.dark,
        flex: 1,
        textAlign: 'right',
        marginLeft: spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondary.lightGray,
        marginVertical: spacing.xs,
    },
    footer: {
        padding: spacing.base,
        backgroundColor: colors.secondary.white,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.lightGray,
    },
});
