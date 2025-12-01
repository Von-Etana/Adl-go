import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { useDeliveryStore } from '../../store/deliveryStore';
import { apiService } from '../../services/api';
import { ArrowLeft, Plus, Trash2, Globe, FileText, ChevronDown } from 'lucide-react-native';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

export const InternationalShippingScreen = () => {
    const navigation = useNavigation<any>();
    const store = useDeliveryStore();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Locations/Country, 2: Customs, 3: Review
    const [showCountryModal, setShowCountryModal] = useState(false);

    const [items, setItems] = useState([{ description: '', quantity: '', value: '' }]);

    const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

    const countries = ['United States', 'United Kingdom', 'Canada', 'China', 'Dubai', 'Ghana', 'South Africa'];

    const addItem = () => {
        setItems([...items, { description: '', quantity: '', value: '' }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            const newItems = [...items];
            newItems.splice(index, 1);
            setItems(newItems);
        }
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleNext = () => {
        if (step === 1) {
            if (!store.pickup || !store.destinationCountry) {
                Alert.alert('Error', 'Please select pickup location and destination country');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            const validItems = items.filter(i => i.description && i.quantity && i.value);
            if (validItems.length === 0) {
                Alert.alert('Error', 'Please add at least one valid item for customs declaration');
                return;
            }
            store.setCustomsDeclaration(validItems);
            setStep(3);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);

            // Simple pricing logic for international
            const basePrice = 15000; // Higher base for international
            const estimatedPrice = basePrice + (totalValue * 0.05); // 5% of value

            const response = await apiService.post('/deliveries', {
                pickupAddress: store.pickup?.address,
                pickupLocation: {
                    lat: store.pickup?.latitude,
                    lng: store.pickup?.longitude,
                },
                // Dropoff location is just the country for now, or we could ask for address
                dropoffAddress: store.destinationCountry,
                packageDescription: `International Shipment to ${store.destinationCountry}`,
                vehicleType: 'van',
                customerOfferPrice: estimatedPrice,
                packageValue: totalValue,
                isInternational: true,
                destinationCountry: store.destinationCountry,
                customsDeclaration: items,
            });

            navigation.navigate('FindingDriver', { deliveryId: response.data.id });
        } catch (error) {
            Alert.alert('Error', 'Failed to create international shipment request');
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

            <Text style={styles.label}>Destination Country</Text>
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCountryModal(true)}
            >
                <Text style={store.destinationCountry ? styles.dropdownText : styles.placeholderText}>
                    {store.destinationCountry || 'Select Country'}
                </Text>
                <ChevronDown size={20} color={colors.secondary.textGray} />
            </TouchableOpacity>

            <Modal visible={showCountryModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Country</Text>
                        <ScrollView>
                            {countries.map((country) => (
                                <TouchableOpacity
                                    key={country}
                                    style={styles.countryItem}
                                    onPress={() => {
                                        store.setDestinationCountry(country);
                                        setShowCountryModal(false);
                                    }}
                                >
                                    <Text style={styles.countryText}>{country}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button title="Cancel" onPress={() => setShowCountryModal(false)} variant="outline" style={{ marginTop: spacing.md }} />
                    </View>
                </View>
            </Modal>
        </View>
    );

    const renderCustomsStep = () => (
        <ScrollView style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Customs Declaration</Text>
            <Text style={styles.subtitle}>List all items in your package accurately for customs clearance.</Text>

            {items.map((item, index) => (
                <View key={index} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>Item {index + 1}</Text>
                        {items.length > 1 && (
                            <TouchableOpacity onPress={() => removeItem(index)}>
                                <Trash2 size={20} color={colors.semantic.error} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Input
                        label="Description"
                        value={item.description}
                        onChangeText={(text) => updateItem(index, 'description', text)}
                        placeholder="e.g., Cotton T-Shirt"
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Quantity"
                                value={item.quantity}
                                onChangeText={(text) => updateItem(index, 'quantity', text)}
                                keyboardType="numeric"
                                placeholder="1"
                            />
                        </View>
                        <View style={{ width: spacing.md }} />
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Value (₦)"
                                value={item.value}
                                onChangeText={(text) => updateItem(index, 'value', text)}
                                keyboardType="numeric"
                                placeholder="0.00"
                            />
                        </View>
                    </View>
                </View>
            ))}

            <Button
                title="Add Another Item"
                onPress={addItem}
                variant="outline"
                icon={<Plus size={20} color={colors.primary.dark} />}
                style={{ marginTop: spacing.md }}
            />
        </ScrollView>
    );

    const renderReviewStep = () => {
        const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
        const estimatedPrice = 15000 + (totalValue * 0.05);

        return (
            <ScrollView style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Review Shipment</Text>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Destination</Text>
                        <Text style={styles.summaryValue}>{store.destinationCountry}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Declared Value</Text>
                        <Text style={styles.summaryValue}>₦{totalValue.toLocaleString()}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Estimated Price</Text>
                        <Text style={[styles.summaryValue, { color: colors.primary.orange }]}>
                            ₦{estimatedPrice.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Customs Items</Text>
                {items.map((item, index) => (
                    <View key={index} style={styles.reviewItem}>
                        <FileText size={20} color={colors.secondary.textGray} />
                        <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                            <Text style={styles.reviewItemText}>{item.description}</Text>
                            <Text style={styles.reviewItemSubtext}>
                                Qty: {item.quantity} • ₦{parseFloat(item.value).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                ))}
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
                <Text style={styles.headerTitle}>International Shipping</Text>
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
                {step === 2 && renderCustomsStep()}
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
    subtitle: {
        ...typography.body,
        color: colors.secondary.textGray,
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
    countryItem: {
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.lightGray,
    },
    countryText: {
        ...typography.body,
        color: colors.primary.dark,
    },
    itemCard: {
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    itemTitle: {
        ...typography.h4,
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
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondary.lightGray,
        marginVertical: spacing.xs,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.secondary.textGray,
        marginBottom: spacing.md,
    },
    reviewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
    },
    reviewItemText: {
        ...typography.body,
        fontWeight: '600' as any,
        color: colors.primary.dark,
    },
    reviewItemSubtext: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    footer: {
        padding: spacing.base,
        backgroundColor: colors.secondary.white,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.lightGray,
    },
});
