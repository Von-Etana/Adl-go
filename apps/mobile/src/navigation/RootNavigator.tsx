import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { CustomerHomeScreen } from '../screens/customer/HomeScreen';
import { CreateDeliveryScreen } from '../screens/customer/CreateDeliveryScreen';
import { FindingDriverScreen } from '../screens/customer/FindingDriverScreen';
import { ChatScreen } from '../screens/shared/ChatScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { EditProfileScreen } from '../screens/shared/EditProfileScreen';
import { ReferralScreen } from '../screens/shared/ReferralScreen';
import { ConsolidationScreen } from '../screens/customer/ConsolidationScreen';
import { InternationalShippingScreen } from '../screens/customer/InternationalShippingScreen';
import { InterstateShippingScreen } from '../screens/customer/InterstateShippingScreen';
import { DriverNavigator } from './DriverNavigator';
import { useAuthStore } from '../store/authStore';

const Stack = createStackNavigator();

export const RootNavigator = () => {
    const { isAuthenticated, user } = useAuthStore();
    const isDriverMode = user?.role === 'driver';

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                {!isAuthenticated ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : isDriverMode ? (
                    <Stack.Screen name="DriverApp" component={DriverNavigator} />
                ) : (
                    <>
                        <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
                        <Stack.Screen name="CreateDelivery" component={CreateDeliveryScreen} />
                        <Stack.Screen name="FindingDriver" component={FindingDriverScreen} />
                        <Stack.Screen name="Chat" component={ChatScreen} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                        <Stack.Screen name="Referral" component={ReferralScreen} />
                        <Stack.Screen name="Consolidation" component={ConsolidationScreen} />
                        <Stack.Screen name="InternationalShipping" component={InternationalShippingScreen} />
                        <Stack.Screen name="InterstateShipping" component={InterstateShippingScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
