import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppStack';
import { leaveService } from '../../services/api/leaveService';
import { useAuth } from '../../context/AuthContext';
import { CustomInput } from '../../components/inputs/CustomInput';
import { CustomButton } from '../../components/buttons/CustomButton';
import { Loading } from '../../components/loaders/Loading';

type Props = NativeStackScreenProps<AppStackParamList, 'LeaveRequest'>;

export const LeaveRequestScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const parseDate = (dateString: string): Date => {
    return new Date(dateString + 'T00:00:00');
  };

  const calculateLeaveHours = () => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (diffDays + 1) * 8; // Assuming 8 hours per day
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const start = parseDate(startDate);
      const end = parseDate(endDate);

      if (end < start) {
        Alert.alert('Error', 'End date must be after start date');
        return;
      }

      const leaveHours = calculateLeaveHours();
      if (leaveHours > (user?.remainingLeaveHours || 0)) {
        Alert.alert(
          'Insufficient Leave',
          `You need ${leaveHours} hours but only have ${user?.remainingLeaveHours} hours available`
        );
        return;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      Alert.alert('Error', 'Invalid date format. Use YYYY-MM-DD');
      return;
    }

    setLoading(true);
    try {
      await leaveService.submitLeaveRequest({
        startDate: parseDate(startDate).toISOString(),
        endDate: parseDate(endDate).toISOString(),
        reason,
      });

      Alert.alert('Success', 'Leave request submitted successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to submit leave request'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Leave Balance</Text>
          <View style={styles.balanceBox}>
            <Text style={styles.balanceValue}>
              {user?.remainingLeaveHours} hours
            </Text>
            <Text style={styles.balanceLabel}>Available</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leave Details</Text>

          <CustomInput
            label="Start Date (YYYY-MM-DD)"
            placeholder="2026-03-15"
            value={startDate}
            onChangeText={setStartDate}
            editable={!loading}
          />

          <CustomInput
            label="End Date (YYYY-MM-DD)"
            placeholder="2026-03-20"
            value={endDate}
            onChangeText={setEndDate}
            editable={!loading}
          />

          <View style={styles.leaveDaysInfo}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.durationText}>
              {calculateLeaveHours()} hours ({Math.ceil(calculateLeaveHours() / 8)} days)
            </Text>
          </View>

          <CustomInput
            label="Reason"
            placeholder="Why do you need leave?"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            editable={!loading}
            style={{ minHeight: 100 }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Submit Request"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
          />
          <CustomButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="secondary"
            fullWidth
            disabled={loading}
          />
        </View>
      </View>

      <Loading visible={loading} message="Submitting request..." />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  balanceBox: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  leaveDaysInfo: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  durationText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
});
