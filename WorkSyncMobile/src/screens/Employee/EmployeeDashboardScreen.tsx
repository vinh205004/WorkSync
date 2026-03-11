import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppStack';
import { useAuth } from '../../context/AuthContext';
import { timeLogService } from '../../services/api/timeLogService';
import { leaveService } from '../../services/api/leaveService';
import { CustomButton } from '../../components/buttons/CustomButton';
import { Card } from '../../components/cards/Card';
import { Loading } from '../../components/loaders/Loading';
import { TimeLog, LeaveRequest } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'EmployeeTab'>;

export const EmployeeDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [todayStatus, setTodayStatus] = useState<TimeLog | null>(null);
  const [upcomingLeave, setUpcomingLeave] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [status, leaves] = await Promise.all([
        timeLogService.getTodayStatus().catch(() => null),
        leaveService.getMyLeaveRequests().catch(() => []),
      ]);

      setTodayStatus(status);
      setUpcomingLeave(
        leaves.filter((l) => l.status === 'Pending').slice(0, 3)
      );
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCheckin = async () => {
    try {
      await timeLogService.checkin();
      Alert.alert('Success', 'Check in recorded');
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Check in failed');
    }
  };

  const handleCheckout = async () => {
    try {
      await timeLogService.checkout();
      Alert.alert('Success', 'Check out recorded');
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Check out failed');
    }
  };

  const getStatusBadge = () => {
    if (!todayStatus) return 'Not Checked In';
    if (todayStatus.checkInTime && !todayStatus.checkOutTime)
      return 'Working';
    if (todayStatus.checkInTime && todayStatus.checkOutTime)
      return 'Completed';
    return 'Unknown';
  };

  const getStatusColor = () => {
    const status = getStatusBadge();
    if (status === 'Working') return '#FF9800';
    if (status === 'Completed') return '#4CAF50';
    return '#999';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome, {user?.fullName.split(' ')[0]}!
        </Text>
        <Text style={styles.subtitle}>
          Remaining Leave: {user?.remainingLeaveHours} hours
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todays Check In/Out</Text>
        <Card
          title={getStatusBadge()}
          badge={getStatusBadge()}
          badgeColor={getStatusColor()}
        />

        {todayStatus?.checkInTime && (
          <Text style={styles.infoText}>
            Checked in at:{' '}
            {new Date(todayStatus.checkInTime).toLocaleTimeString()}
          </Text>
        )}

        <View style={styles.buttonGroup}>
          <CustomButton
            title="Check In"
            onPress={handleCheckin}
            variant="primary"
            fullWidth
          />
          <CustomButton
            title="Check Out"
            onPress={handleCheckout}
            variant="secondary"
            fullWidth
          />
        </View>

        <CustomButton
          title="View Details"
          onPress={() => navigation.navigate('CheckinCheckout')}
          variant="secondary"
          fullWidth
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <CustomButton
          title="Request Leave"
          onPress={() => navigation.navigate('LeaveRequest')}
          fullWidth
        />
        <CustomButton
          title="Submit Explanation"
          onPress={() => navigation.navigate('ExplanationRequest')}
          variant="secondary"
          fullWidth
        />
        <CustomButton
          title="View History"
          onPress={() => navigation.navigate('LeaveHistory')}
          variant="secondary"
          fullWidth
        />
      </View>

      {upcomingLeave.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Leave Requests</Text>
          {upcomingLeave.map((leave) => (
            <Card
              key={leave.id}
              title={`${leave.startDate} - ${leave.endDate}`}
              subtitle={leave.reason}
              badge={leave.status}
              badgeColor="#FF9800"
            />
          ))}
        </View>
      )}

      <Loading visible={loading} message="Loading dashboard..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
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
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
});
