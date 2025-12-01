import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}) => {
    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryButton;
            case 'secondary':
                return styles.secondaryButton;
            case 'outline':
                return styles.outlineButton;
            default:
                return styles.primaryButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
                return styles.primaryText;
            case 'secondary':
                return styles.secondaryText;
            case 'outline':
                return styles.outlineText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.9}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? colors.secondary.white : colors.primary.dark} />
            ) : (
                <React.Fragment>
                    {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
                    <Text style={[styles.text, getTextStyle(), textStyle]}>
                        {title}
                    </Text>
                </React.Fragment>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        flexDirection: 'row',
    },
    primaryButton: {
        backgroundColor: colors.primary.dark,
        ...shadows.md,
    },
    secondaryButton: {
        backgroundColor: colors.secondary.lightGray,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.secondary.mediumGray,
    },
    disabled: {
        opacity: 0.4,
    },
    text: {
        ...typography.button,
    },
    primaryText: {
        color: colors.secondary.white,
    },
    secondaryText: {
        color: colors.primary.dark,
    },
    outlineText: {
        color: colors.primary.dark,
    },
});
