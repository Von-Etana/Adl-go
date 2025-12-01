import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DriverHomeScreen } from '../screens/driver/DriverHomeScreen';
import { OrderRequestScreen } from '../screens/driver/OrderRequestScreen';

const Stack = createStackNavigator();

export const DriverNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
            <Stack.Screen
                name="OrderRequest"
                component={OrderRequestScreen}
                options={{ presentation: 'modal' }}
            />
        </Stack.Navigator>
    );
};
