import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import {
  EmployeeDashboardScreen,
  CheckinCheckoutScreen,
  LeaveRequestScreen,
  LeaveHistoryScreen,
  ExplanationRequestScreen,
  ManagerDashboardScreen,
  PendingLeaveScreen,
  PendingExplanationScreen,
  LeaveDetailScreen,
  ExplanationDetailScreen,
  ProfileScreen,
  ReportScreen,
  SettingsScreen,
} from '../screens';

export type AppStackParamList = {
  EmployeeTab: undefined;
  ManagerTab: undefined;
  CommonTab: undefined;
  CheckinCheckout: undefined;
  LeaveRequest: undefined;
  LeaveHistory: undefined;
  ExplanationRequest: undefined;
  PendingLeave: undefined;
  PendingExplanation: undefined;
  LeaveDetail: { id: string };
  ExplanationDetail: { id: string };
  Report: { employeeId?: string };
  Profile: undefined;
  Settings: undefined;
};

const EmployeeStack = createNativeStackNavigator<AppStackParamList>();
const ManagerStack = createNativeStackNavigator<AppStackParamList>();
const CommonStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator();

// Employee Tab Stack
const EmployeeTabStack = () => (
  <EmployeeStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: 'white',
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <EmployeeStack.Screen
      name="EmployeeTab"
      component={EmployeeDashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <EmployeeStack.Screen
      name="CheckinCheckout"
      component={CheckinCheckoutScreen}
      options={{ title: 'Check In / Out' }}
    />
    <EmployeeStack.Screen
      name="LeaveRequest"
      component={LeaveRequestScreen}
      options={{ title: 'Request Leave' }}
    />
    <EmployeeStack.Screen
      name="LeaveHistory"
      component={LeaveHistoryScreen}
      options={{ title: 'Leave History' }}
    />
    <EmployeeStack.Screen
      name="ExplanationRequest"
      component={ExplanationRequestScreen}
      options={{ title: 'Submit Explanation' }}
    />
  </EmployeeStack.Navigator>
);

// Manager Tab Stack
const ManagerTabStack = () => (
  <ManagerStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#2196F3' },
      headerTintColor: 'white',
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <ManagerStack.Screen
      name="ManagerTab"
      component={ManagerDashboardScreen}
      options={{ title: 'Team Management' }}
    />
    <ManagerStack.Screen
      name="PendingLeave"
      component={PendingLeaveScreen}
      options={{ title: 'Leave Requests' }}
    />
    <ManagerStack.Screen
      name="PendingExplanation"
      component={PendingExplanationScreen}
      options={{ title: 'Explanations' }}
    />
    <ManagerStack.Screen
      name="LeaveDetail"
      component={LeaveDetailScreen}
      options={{ title: 'Leave Details' }}
    />
    <ManagerStack.Screen
      name="ExplanationDetail"
      component={ExplanationDetailScreen}
      options={{ title: 'Explanation Details' }}
    />
  </ManagerStack.Navigator>
);

// Common Tab Stack
const CommonTabStack = () => (
  <CommonStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#FF9800' },
      headerTintColor: 'white',
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <CommonStack.Screen
      name="Report"
      component={ReportScreen}
      options={{ title: 'Monthly Reports' }}
    />
    <CommonStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
    <CommonStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </CommonStack.Navigator>
);

export const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'EmployeeTab') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'ManagerTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'CommonTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen
        name="EmployeeTab"
        component={EmployeeTabStack}
        options={{ title: 'Work' }}
      />
      <Tab.Screen
        name="ManagerTab"
        component={ManagerTabStack}
        options={{ title: 'Team' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Only show for managers
          },
        })}
      />
      <Tab.Screen
        name="CommonTab"
        component={CommonTabStack}
        options={{ title: 'More' }}
      />
    </Tab.Navigator>
  );
};
