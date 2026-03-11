import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppStack';
import { reportService } from '../../services/api/reportService';
import { MonthlyReportDto } from '../../types';
import { Card } from '../../components/cards/Card';
import { Loading } from '../../components/loaders/Loading';

type Props = NativeStackScreenProps<AppStackParamList, 'Report'>;

export const ReportScreen: React.FC<Props> = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState<MonthlyReportDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getMonthlyReport(month, year);
      setReport(data);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  const years = Array.from({ length: 5 }, (_, i) =>
    now.getFullYear() - 2 + i
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Report</Text>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.pickerGroup}>
          <Text style={styles.label}>Month</Text>
          <ScrollView horizontal style={styles.monthScroll}>
            {months.map((m) => (
              <Text
                key={m.value}
                onPress={() => setMonth(m.value)}
                style={[styles.monthButton, month === m.value && styles.monthButtonActive]}
              >
                {m.label}
              </Text>
            ))}
          </ScrollView>
        </View>

        <View style={styles.pickerGroup}>
          <Text style={styles.label}>Year</Text>
          <ScrollView horizontal style={styles.yearScroll}>
            {years.map((y) => (
              <Text
                key={y}
                onPress={() => setYear(y)}
                style={[styles.yearButton, year === y && styles.yearButtonActive]}
              >
                {y}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>

      {report && (
        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{report.workDays}</Text>
              <Text style={styles.statLabel}>Work Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{report.workHours}</Text>
              <Text style={styles.statLabel}>Work Hours</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#FF9800' }]}>
                {report.lateCount}
              </Text>
              <Text style={styles.statLabel}>Late Days</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#f44336' }]}>
                {report.earlyCount}
              </Text>
              <Text style={styles.statLabel}>Early Days</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Metrics</Text>

            <Card
              title="Late Minutes"
              subtitle={`${report.lateMinutes} minutes in total`}
            />
            <Card
              title="Early Departure Minutes"
              subtitle={`${report.earlyMinutes} minutes in total`}
            />
            <Card
              title="Leave Hours"
              subtitle={`${report.leaveHours} hours taken`}
            />
            <Card
              title="Total Hours"
              subtitle={`${report.totalHours} hours total`}
            />
          </View>
        </View>
      )}

      <Loading visible={loading} message="Loading report..." />
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  filterSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  pickerGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  monthScroll: {
    marginBottom: 12,
  },
  yearScroll: {
    marginBottom: 12,
  },
  monthButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  monthButtonActive: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  yearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  yearButtonActive: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  content: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
});
