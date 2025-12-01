import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/atoms/Button';
import { colors, typography, spacing } from '../../theme/tokens';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Your Go-To\nParcel Solution',
        subtitle: '+5000 Successful delivery',
        image: require('../../../assets/icon.png'), // Placeholder
    },
    {
        id: '2',
        title: 'Deliver\nSmarter, Faster.',
        subtitle: 'Tracked by 2500+ happy customers.',
        image: require('../../../assets/icon.png'), // Placeholder
    },
    {
        id: '3',
        title: 'Fast & Reliable\nDeliveries',
        subtitle: 'Send and receive parcels anytime, anywhere',
        image: require('../../../assets/icon.png'), // Placeholder
    },
];

export const OnboardingScreen = () => {
    const navigation = useNavigation<any>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.replace('Login');
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 3 }}>
                <FlatList
                    data={slides}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <Image source={item.image} style={styles.image} resizeMode="contain" />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.subtitle}>{item.subtitle}</Text>
                            </View>
                        </View>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            <View style={styles.footer}>
                <View style={styles.paginator}>
                    {slides.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 20, 10],
                            extrapolate: 'clamp',
                        });
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                style={[styles.dot, { width: dotWidth, opacity }]}
                                key={i.toString()}
                            />
                        );
                    })}
                </View>

                <Button
                    title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    onPress={scrollTo}
                    style={styles.button}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    slide: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    image: {
        flex: 0.7,
        width: '100%',
        marginBottom: spacing.xl,
    },
    textContainer: {
        flex: 0.3,
        alignItems: 'center',
    },
    title: {
        ...typography.h1,
        color: colors.primary.dark,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.bodyLarge,
        color: colors.secondary.textGray,
        textAlign: 'center',
    },
    footer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxxl,
    },
    paginator: {
        flexDirection: 'row',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary.orange,
        marginHorizontal: 8,
    },
    button: {
        width: '100%',
    },
});
