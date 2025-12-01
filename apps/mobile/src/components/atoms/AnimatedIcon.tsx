import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '../../theme/tokens';

interface AnimatedIconProps {
    icon: LucideIcon;
    size?: number;
    color?: string;
    style?: ViewStyle;
    animationType?: 'scale' | 'rotate' | 'bounce' | 'pulse';
    delay?: number;
    focused?: boolean;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
    icon: Icon,
    size = 24,
    color = colors.primary.dark,
    style,
    animationType = 'scale',
    delay = 0,
    focused = false,
}) => {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        // Initial entrance animation
        opacity.value = withDelay(
            delay,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
        );

        if (animationType === 'scale') {
            scale.value = withDelay(
                delay,
                withSpring(1, { damping: 12, stiffness: 100 })
            );
        }
    }, []);

    useEffect(() => {
        if (focused) {
            switch (animationType) {
                case 'scale':
                    scale.value = withSequence(
                        withTiming(1.2, { duration: 100 }),
                        withSpring(1)
                    );
                    break;
                case 'rotate':
                    rotation.value = withSequence(
                        withTiming(15, { duration: 100 }),
                        withTiming(-15, { duration: 100 }),
                        withSpring(0)
                    );
                    break;
                case 'bounce':
                    scale.value = withSequence(
                        withTiming(0.8, { duration: 100 }),
                        withSpring(1.2, { damping: 10 }),
                        withSpring(1)
                    );
                    break;
                case 'pulse':
                    scale.value = withSequence(
                        withTiming(1.1, { duration: 200 }),
                        withTiming(1, { duration: 200 })
                    );
                    break;
            }
        }
    }, [focused, animationType]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { scale: scale.value },
                { rotate: `${rotation.value}deg` },
            ],
        };
    });

    return (
        <Animated.View style={[style, animatedStyle]}>
            <Icon size={size} color={color} />
        </Animated.View>
    );
};
