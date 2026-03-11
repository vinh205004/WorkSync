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
import { explanationService } from '../../services/api/explanationService';
import { CustomButton } from '../../components/buttons/CustomButton';
import { CustomInput } from '../../components/inputs/CustomInput';

type Props = NativeStackScreenProps<AppStackParamList, 'ExplanationDetail'>;

export const ExplanationDetailScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { id } = route.params;
  const [rejectionReason, setRejectionReason] = useState('');
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handleApprove = async () => {
    Alert.alert(
      'Approve Explanation?',
      'Are you sure you want to approve this explanation?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Approve',
          onPress: async () => {
            setApproving(true);
            try {
              await explanationService.reviewExplanationRequest(id, {
                approved: true,
              });
              Alert.alert('Success', 'Explanation approved', [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]);
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to approve'
              );
            } finally {
              setApproving(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a rejection reason');
      return;
    }

    Alert.alert(
      'Reject Explanation?',
      'Are you sure you want to reject this explanation?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Reject',
          onPress: async () => {
            setRejecting(true);
            try {
              await explanationService.reviewExplanationRequest(id, {
                approved: false,
                rejectionReason,
              });
              Alert.alert('Success', 'Explanation rejected', [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]);
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to reject'
              );
            } finally {
              setRejecting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Explanation Details</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Employee Name</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Jane Smith</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>2026-03-10</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Late Arrival</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Explanation</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Traffic jam on the way to office</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.infoBox}>
            <Text style={[styles.infoText, { color: '#FF9800' }]}>
              Pending
            </Text>
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
    lineHeight: 20,
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
