import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppStack';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/cards/Card';

type Props = NativeStackScreenProps<AppStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Refresh user data
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.role}>{user.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <Card title="Email" subtitle={user.email} />
        <Card title="Mã nhân viên" subtitle={user.code} />
        <Card title="Vai trò" subtitle={user.role} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leave Information</Text>
        <Card
          title="Remaining Leave Hours"
          subtitle={`${user.remainingLeaveHours} hours`}
          badge={Math.ceil(user.remainingLeaveHours / 8).toString()}
          badgeColor="#4CAF50"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <Card
          title="Member Since"
          subtitle={new Date(user.createdAt).toLocaleDateString()}
        />
        <Card
          title="Account Status"
          subtitle="Active"
          badge="✓"
          badgeColor="#4CAF50"
        />
      </View>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF9800',
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    padding: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
});
