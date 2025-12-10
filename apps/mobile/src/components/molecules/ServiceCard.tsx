import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../theme/tokens';
import { AnimatedIcon } from '../atoms/AnimatedIcon';

interface ServiceCardProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    onPress: () => void;
    color?: string;
    style?: ViewStyle;
    variant?: 'large' | 'small';
    animated?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
    title,
    subtitle,
    icon: Icon,
    onPress,
    color = colors.primary.orange,
    style,
    variant = 'small',
    animated = true,
}) => {
    const isLarge = variant === 'large';
    const [focused, setFocused] = React.useState(false);

    const handlePressIn = () => setFocused(true);
    const handlePressOut = () => setFocused(false);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isLarge ? styles.largeContainer : styles.smallContainer,
                style,
            ]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                {animated ? (
                    <AnimatedIcon
                        icon={Icon}
                        size={isLarge ? 32 : 24}
                        color={color}
                        focused={focused}
                        animationType="scale"
                    />
                ) : (
                    <Icon size={isLarge ? 32 : 24} color={color} />
                )}
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, isLarge && styles.largeTitle]}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.lg,
        padding: spacing.base,
        ...shadows.sm,
        justifyContent: 'space-between',
    },
    largeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        height: 100,
    },
    smallContainer: {
        flex: 1,
        aspectRatio: 1,
        alignItems: 'flex-start',
    },
    iconContainer: {
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: spacing.sm,
    },
    title: {
        ...typography.bodyLarge,
        fontWeight: '600' as TextStyle['fontWeight'],
        color: colors.primary.dark,
    },
    largeTitle: {
        ...typography.h3,
    },
    subtitle: {
        ...typography.caption,
        color: colors.secondary.textGray,
        marginTop: 2,
    },
});
