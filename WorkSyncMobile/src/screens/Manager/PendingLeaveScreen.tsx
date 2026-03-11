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

type Props = NativeStackScreenProps<AppStackParamList, 'PendingLeave'>;

export const PendingLeaveScreen: React.FC<Props> = ({ navigation }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const requests = await leaveService.getPendingLeaveRequests();
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error loading pending leaves:', error);
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

  const handleViewDetails = (leaveId: string) => {
    navigation.navigate('LeaveDetail', { id: leaveId });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Leave Requests</Text>
        <Text style={styles.count}>Total: {leaveRequests.length}</Text>
      </View>

      <View style={styles.content}>
        {leaveRequests.length > 0 ? (
          leaveRequests.map((leave) => (
            <Card
              key={leave.id}
              title={leave.employeeName}
              subtitle={`${leave.startDate} - ${leave.endDate}\n${leave.reason}`}
              badge={`${leave.leaveHours}h`}
              onPress={() => handleViewDetails(leave.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No pending leave requests</Text>
          </View>
        )}
      </View>

      <Loading visible={loading} message="Loading pending leaves..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
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
