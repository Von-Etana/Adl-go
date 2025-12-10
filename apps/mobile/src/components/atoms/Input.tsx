import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme/tokens';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    style,
    icon,
    ...props
}) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputContainer}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        icon ? styles.inputWithIcon : undefined,
                        isFocused && styles.focused,
                        error && styles.errorInput,
                        style,
                    ]}
                    placeholderTextColor={colors.secondary.textGray}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.base,
    },
    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        position: 'absolute',
        left: spacing.base,
        zIndex: 1,
    },
    label: {
        ...typography.bodySmall,
        color: colors.primary.dark,
        marginBottom: spacing.xs,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.secondary.lightGray,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.base,
        paddingHorizontal: spacing.base,
        flex: 1,
        fontSize: 16,
        color: colors.primary.dark,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputWithIcon: {
        paddingLeft: spacing.xl * 1.5,
    },
    focused: {
        backgroundColor: colors.secondary.white,
        borderColor: colors.primary.dark,
    },
    errorInput: {
        backgroundColor: '#FFF5F5',
        borderColor: colors.semantic.error,
    },
    errorText: {
        ...typography.caption,
        color: colors.semantic.error,
        marginTop: spacing.xs,
    },
});
