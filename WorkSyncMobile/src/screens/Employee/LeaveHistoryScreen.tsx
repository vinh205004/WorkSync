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
import { leaveService } from '../../services/api/leaveService';
import { Card } from '../../components/cards/Card';
import { Loading } from '../../components/loaders/Loading';
import { LeaveRequest } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'LeaveHistory'>;

export const LeaveHistoryScreen: React.FC<Props> = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const requests = await leaveService.getMyLeaveRequests();
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error loading leave requests:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#4CAF50';
      case 'Rejected':
        return '#f44336';
      default:
        return '#FF9800';
    }
  };

  const renderLeaveCard = (leave: LeaveRequest) => (
    <Card
      key={leave.id}
      title={`${leave.startDate} to ${leave.endDate}`}
      subtitle={`${leave.leaveHours} hours • ${leave.reason}`}
      badge={leave.status}
      badgeColor={getStatusColor(leave.status)}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Leave History</Text>
        <Text style={styles.count}>Total: {leaveRequests.length} requests</Text>
      </View>

      <View style={styles.content}>
        {leaveRequests.length > 0 ? (
          leaveRequests.map(renderLeaveCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No leave requests yet</Text>
          </View>
        )}
      </View>

      <Loading visible={loading} message="Loading leave history..." />
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
  count: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 16,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
