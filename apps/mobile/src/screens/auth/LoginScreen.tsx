import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { colors, typography, spacing } from '../../theme/tokens';

export const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Navigate to OTP verification (to be implemented)
            // For now, go to Customer Home
            navigation.replace('CustomerHome');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Enter your phone number to continue</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Phone Number"
                            placeholder="+234 800 000 0000"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            autoFocus
                        />
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Continue"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={phoneNumber.length < 10}
                        />
                        <Text style={styles.disclaimer}>
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    inner: {
        flex: 1,
        padding: spacing.xl,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: spacing.xxxl,
    },
    title: {
        ...typography.h1,
        color: colors.primary.dark,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.bodyLarge,
        color: colors.secondary.textGray,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
    },
    footer: {
        marginBottom: spacing.xl,
    },
    disclaimer: {
        ...typography.caption,
        color: colors.secondary.textGray,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});
