import React from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from '../src/navigation/RootNavigator';

export default function RootLayout() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
