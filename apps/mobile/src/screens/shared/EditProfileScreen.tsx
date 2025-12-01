import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../services/api';
import { ArrowLeft, Camera, Save } from 'lucide-react-native';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';

export const EditProfileScreen = () => {
    const navigation = useNavigation<any>();
    const { user, updateUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        address: user?.address || '',
        emergencyContactName: user?.emergencyContactName || '',
        emergencyContactPhone: user?.emergencyContactPhone || '',
        profilePhotoUrl: user?.profilePhotoUrl || '',
    });

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('bucket', 'profile-photos');

            const filename = uri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('file', {
                uri,
                name: filename,
                type,
            } as any);

            const response = await apiService.post('/storage/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormData(prev => ({ ...prev, profilePhotoUrl: response.data.url }));
        } catch (error) {
            Alert.alert('Error', 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await apiService.put('/auth/profile', formData);
            updateUser(response.data.data);
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.primary.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Photo Upload */}
                <View style={styles.photoSection}>
                    <TouchableOpacity onPress={handlePickImage} style={styles.photoContainer}>
                        {formData.profilePhotoUrl ? (
                            <Image source={{ uri: formData.profilePhotoUrl }} style={styles.photo} />
                        ) : (
                            <View style={styles.photoPlaceholder} />
                        )}
                        <View style={styles.cameraButton}>
                            {uploading ? (
                                <ActivityIndicator size="small" color={colors.secondary.white} />
                            ) : (
                                <Camera size={20} color={colors.secondary.white} />
                            )}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.photoHint}>Tap to change photo</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        value={formData.fullName}
                        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                    />
                    <Input
                        label="Email"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        keyboardType="email-address"
                    />
                    <Input
                        label="Address"
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                        multiline
                    />

                    <Text style={styles.sectionTitle}>Emergency Contact</Text>
                    <Input
                        label="Contact Name"
                        value={formData.emergencyContactName}
                        onChangeText={(text) => setFormData({ ...formData, emergencyContactName: text })}
                    />
                    <Input
                        label="Contact Phone"
                        value={formData.emergencyContactPhone}
                        onChangeText={(text) => setFormData({ ...formData, emergencyContactPhone: text })}
                        keyboardType="phone-pad"
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Save Changes"
                    onPress={handleSave}
                    loading={loading}
                    icon={<Save size={20} color={colors.secondary.white} />}
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
    content: {
        padding: spacing.base,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    photoContainer: {
        position: 'relative',
        marginBottom: spacing.sm,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    photoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.secondary.mediumGray,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary.orange,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.secondary.lightGray,
    },
    photoHint: {
        ...typography.caption,
        color: colors.secondary.textGray,
    },
    form: {
        gap: spacing.md,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.primary.dark,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    footer: {
        padding: spacing.base,
        backgroundColor: colors.secondary.white,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.lightGray,
    },
});
