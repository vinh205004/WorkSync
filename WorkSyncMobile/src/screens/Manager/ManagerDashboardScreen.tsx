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
import { explanationService } from '../../services/api/explanationService';
import { reportService } from '../../services/api/reportService';
// import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/buttons/CustomButton';
import { Card } from '../../components/cards/Card';
import { Loading } from '../../components/loaders/Loading';
import { LeaveRequest, ExplanationRequest, MonthlyReportDto } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'ManagerTab'>;

export const ManagerDashboardScreen: React.FC<Props> = ({ navigation }) => {
  // Auth context already initialized in root
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [pendingExplanations, setPendingExplanations] = useState<
    ExplanationRequest[]
  >([]);
  const [report, setReport] = useState<MonthlyReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const [leaves, explanations, monthReport] = await Promise.all([
        leaveService.getPendingLeaveRequests().catch(() => []),
        explanationService.getPendingExplanationRequests().catch(() => []),
        reportService
          .getMonthlyReport(now.getMonth() + 1, now.getFullYear())
          .catch(() => null),
      ]);

      setPendingLeaves(leaves);
      setPendingExplanations(explanations);
      setReport(monthReport);
    } catch (error) {
      console.error('Error loading manager dashboard:', error);
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Manager Panel</Text>
        <Text style={styles.subtitle}>Overview & approvals</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{pendingLeaves.length}</Text>
          <Text style={styles.statLabel}>Pending Leaves</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{pendingExplanations.length}</Text>
          <Text style={styles.statLabel}>Pending Explanations</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Leave Requests</Text>
          <CustomButton
            title="View All"
            onPress={() => navigation.navigate('PendingLeave')}
            size="small"
            variant="secondary"
          />
        </View>

        {pendingLeaves.length > 0 ? (
          pendingLeaves.slice(0, 3).map((leave) => (
            <Card
              key={leave.id}
              title={leave.employeeName}
              subtitle={`${leave.startDate} - ${leave.endDate}`}
              badge={`${leave.leaveHours}h`}
              onPress={() =>
                navigation.navigate('LeaveDetail', { id: leave.id })
              }
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No pending leave requests</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Explanations</Text>
          <CustomButton
            title="View All"
            onPress={() => navigation.navigate('PendingExplanation')}
            size="small"
            variant="secondary"
          />
        </View>

        {pendingExplanations.length > 0 ? (
          pendingExplanations.slice(0, 3).map((explanation) => (
            <Card
              key={explanation.id}
              title={explanation.employeeName}
              subtitle={`${explanation.type} - ${explanation.date}`}
              badge={explanation.type}
              onPress={() =>
                navigation.navigate('ExplanationDetail', { id: explanation.id })
              }
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No pending explanations</Text>
        )}
      </View>

      {report && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month Summary</Text>
          <View style={styles.reportGrid}>
            <View style={styles.reportItem}>
              <Text style={styles.reportValue}>{report.workDays}</Text>
              <Text style={styles.reportLabel}>Work Days</Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={styles.reportValue}>{report.lateCount}</Text>
              <Text style={styles.reportLabel}>Late Days</Text>
            </View>
            <View style={styles.reportItem}>
              <Text style={styles.reportValue}>{report.earlyCount}</Text>
              <Text style={styles.reportLabel}>Early Days</Text>
            </View>
          </View>
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
    backgroundColor: '#2196F3',
    padding: 20,
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
  },
  reportGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reportItem: {
    alignItems: 'center',
  },
  reportValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 4,
  },
  reportLabel: {
    fontSize: 12,
    color: '#666',
  },
});
