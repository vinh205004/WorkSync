import React, { useEffect, useState } from 'react';
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
import { CustomButton } from '../../components/buttons/CustomButton';
import { CustomInput } from '../../components/inputs/CustomInput';
import { Loading } from '../../components/loaders/Loading';
import { LeaveRequest } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'LeaveDetail'>;

export const LeaveDetailScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { id } = route.params;
  const [leave] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch this specific leave by ID
    // For now, this is a simplified version
    setLoading(false);
  }, [id]);

  const handleApprove = async () => {
    if (!leave) return;

    Alert.alert('Approve Leave?', 'Are you sure you want to approve this leave request?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Approve',
        onPress: async () => {
          setApproving(true);
          try {
            await leaveService.reviewLeaveRequest(leave.id, {
              approved: true,
            });
            Alert.alert('Success', 'Leave request approved', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to approve');
          } finally {
            setApproving(false);
          }
        },
      },
    ]);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a rejection reason');
      return;
    }

    if (!leave) return;

    Alert.alert('Reject Leave?', 'Are you sure you want to reject this leave request?', [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Reject',
        onPress: async () => {
          setRejecting(true);
          try {
            await leaveService.reviewLeaveRequest(leave.id, {
              approved: false,
              rejectionReason,
            });
            Alert.alert('Success', 'Leave request rejected', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to reject');
          } finally {
            setRejecting(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Leave Request Details</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Employee Name</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>John Doe</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Period</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>2026-03-15 - 2026-03-20</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>40 hours (5 days)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Reason</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Annual vacation</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.infoBox}>
            <Text style={[styles.infoText, { color: '#FF9800' }]}>Pending</Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <Text style={styles.label}>Decision</Text>

          <CustomButton
            title="Approve"
            onPress={handleApprove}
            loading={approving}
            fullWidth
            disabled={rejecting}
          />

          <View style={styles.rejectSection}>
            <CustomInput
              label="Rejection Reason (if rejecting)"
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChangeText={setRejectionReason}
              multiline
              numberOfLines={3}
              editable={!rejecting && !approving}
              style={{ minHeight: 80 }}
            />

            <CustomButton
              title="Reject"
              onPress={handleReject}
              variant="danger"
              loading={rejecting}
              fullWidth
              disabled={approving}
            />
          </View>
        </View>
      </View>

      <Loading visible={loading} message="Loading details..." />
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  actionSection: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  rejectSection: {
    marginTop: 12,
  },
});
