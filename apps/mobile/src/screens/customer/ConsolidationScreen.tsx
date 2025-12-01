import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { useDeliveryStore } from '../../store/deliveryStore';
import { apiService } from '../../services/api';
import { ArrowLeft, Plus, Trash2, Package, Layers } from 'lucide-react-native';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';

export const ConsolidationScreen = () => {
    const navigation = useNavigation<any>();
    const store = useDeliveryStore();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Locations, 2: Items, 3: Review

    const [items, setItems] = useState([{ description: '', weight: '', value: '' }]);

    const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

    const addItem = () => {
        setItems([...items, { description: '', weight: '', value: '' }]);
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
            if (!store.pickup || !store.dropoff) {
                Alert.alert('Error', 'Please select pickup and dropoff locations');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            const validItems = items.filter(i => i.description && i.weight && i.value);
            if (validItems.length === 0) {
                Alert.alert('Error', 'Please add at least one valid item');
                return;
            }
            store.setConsolidationItems(validItems);
            setStep(3);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const totalValue = items.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
            const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);

            // Simple pricing logic for consolidation
            const basePrice = 2000;
            const weightPrice = totalWeight * 100; // 100 per kg
            const estimatedPrice = basePrice + weightPrice;

            const response = await apiService.post('/deliveries', {
                pickupAddress: store.pickup?.address,
                pickupLocation: {
                    lat: store.pickup?.latitude,
                    lng: store.pickup?.longitude,
                },
                dropoffAddress: store.dropoff?.address,
                dropoffLocation: {
                    lat: store.dropoff?.latitude,
                    lng: store.dropoff?.longitude,
                },
                packageDescription: `Consolidated Shipment (${items.length} items)`,
                vehicleType: 'van', // Default for consolidation
                customerOfferPrice: estimatedPrice,
                packageValue: totalValue,
                isConsolidated: true,
                consolidationItems: items,
            });

            // Navigate to finding driver or success
            navigation.navigate('FindingDriver', { deliveryId: response.data.id });
        } catch (error) {
            Alert.alert('Error', 'Failed to create consolidation request');
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

            <Text style={styles.label}>Dropoff Location</Text>
            <View style={[styles.autocompleteContainer, { zIndex: -1 }]}>
                <GooglePlacesAutocomplete
                    placeholder="Enter dropoff address"
                    onPress={(data, details = null) => {
                        if (details) {
                            store.setDropoff({
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
        </View>
    );

    const renderItemsStep = () => (
        <ScrollView style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What are we consolidating?</Text>

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
                        placeholder="e.g., Electronics, Clothes"
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="Weight (kg)"
                                value={item.weight}
                                onChangeText={(text) => updateItem(index, 'weight', text)}
                                keyboardType="numeric"
                                placeholder="0.0"
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
        const totalWeight = items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);
        const estimatedPrice = 2000 + (totalWeight * 100);

        return (
            <ScrollView style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Review Consolidation</Text>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Items</Text>
                        <Text style={styles.summaryValue}>{items.length}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Weight</Text>
                        <Text style={styles.summaryValue}>{totalWeight.toFixed(1)} kg</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Value</Text>
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

                <Text style={styles.sectionTitle}>Items</Text>
                {items.map((item, index) => (
                    <View key={index} style={styles.reviewItem}>
                        <Package size={20} color={colors.secondary.textGray} />
                        <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                            <Text style={styles.reviewItemText}>{item.description}</Text>
                            <Text style={styles.reviewItemSubtext}>
                                {item.weight}kg • ₦{parseFloat(item.value).toLocaleString()}
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
                <Text style={styles.headerTitle}>Consolidation</Text>
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
                {step === 2 && renderItemsStep()}
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
