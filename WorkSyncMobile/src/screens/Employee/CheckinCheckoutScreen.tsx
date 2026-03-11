import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppStack';
import { timeLogService } from '../../services/api/timeLogService';
import { Card } from '../../components/cards/Card';
import { Loading } from '../../components/loaders/Loading';
import { TimeLog } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'CheckinCheckout'>;

export const CheckinCheckoutScreen: React.FC<Props> = () => {
  const [todayStatus, setTodayStatus] = useState<TimeLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const status = await timeLogService.getTodayStatus();
      setTodayStatus(status);
    } catch (error) {
      console.error('Error loading check in/out status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return 'Not recorded';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (type: 'inTime' | 'outTime') => {
    if (type === 'inTime' && todayStatus?.isLateDeparture) return '#ff9800';
    if (type === 'outTime' && todayStatus?.isEarlyLeave) return '#ff9800';
    return '#4CAF50';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Todays Attendance</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {todayStatus ? (
        <View style={styles.content}>
          <Card
            title="Check In Time"
            subtitle={formatTime(todayStatus.checkInTime)}
            badge={
              todayStatus.isLateDeparture
                ? 'Late'
                : todayStatus.checkInTime
                  ? 'On Time'
                  : 'Pending'
            }
            badgeColor={getStatusColor('inTime')}
          />

          <Card
            title="Check Out Time"
            subtitle={formatTime(todayStatus.checkOutTime)}
            badge={
              todayStatus.isEarlyLeave
                ? 'Early'
                : todayStatus.checkOutTime
                  ? 'On Time'
                  : 'Pending'
            }
            badgeColor={getStatusColor('outTime')}
          />

          {todayStatus.lateMinutes && todayStatus.lateMinutes > 0 && (
            <Card
              title="Late Arrival"
              subtitle={`${todayStatus.lateMinutes} minutes late`}
              badge="⚠"
              badgeColor="#ff9800"
            />
          )}

          {todayStatus.earlyMinutes && todayStatus.earlyMinutes > 0 && (
            <Card
              title="Early Departure"
              subtitle={`${todayStatus.earlyMinutes} minutes early`}
              badge="⚠"
              badgeColor="#ff9800"
            />
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Status</Text>
            <Text style={styles.infoValue}>{todayStatus.status}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No check in/out records today</Text>
        </View>
      )}

      <Loading visible={loading} message="Loading attendance..." />
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 16,
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
