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
import { CustomInput } from '../../components/inputs/CustomInput';
import { CustomButton } from '../../components/buttons/CustomButton';
import { Loading } from '../../components/loaders/Loading';

type Props = NativeStackScreenProps<AppStackParamList, 'ExplanationRequest'>;

export const ExplanationRequestScreen: React.FC<Props> = ({
  navigation,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<'Late' | 'Early'>('Late');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDateChange = (text: string) => {
    // Parse date from text input
    try {
      const newDate = new Date(text);
      if (!isNaN(newDate.getTime())) {
        setDate(newDate);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error('Invalid date format');
    }
  };

  const handleSubmit = async () => {
    if (!date || !type || !explanation.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await explanationService.submitExplanation({
        date: date.toISOString(),
        type,
        explanation,
      });

      Alert.alert('Success', 'Explanation submitted successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to submit explanation'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submit Explanation</Text>

          <View>
            <Text style={styles.label}>Date</Text>
            <CustomInput
              placeholder="YYYY-MM-DD"
              value={date.toISOString().split('T')[0]}
              onChangeText={handleDateChange}
              editable={!loading}
            />
          </View>

          <View style={styles.typeContainer}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.radioGroup}>
              <View style={[styles.radioOption, type === 'Late' && styles.radioSelected]}>
                <Text onPress={() => setType('Late')} style={styles.radioLabel}>Late Arrival</Text>
              </View>
              <View style={[styles.radioOption, type === 'Early' && styles.radioSelected]}>
                <Text onPress={() => setType('Early')} style={styles.radioLabel}>Early Departure</Text>
              </View>
            </View>
          </View>

          <CustomInput
            label="Explanation"
            placeholder="Explain why you were late/left early"
            value={explanation}
            onChangeText={setExplanation}
            multiline
            numberOfLines={4}
            editable={!loading}
            style={{ minHeight: 100 }}
          />

          <View style={styles.info}>
            <Text style={styles.infoText}>
              Please provide a detailed explanation for your late arrival or
              early departure. This will be reviewed by your manager.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Submit"
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

      <Loading visible={loading} message="Submitting explanation..." />
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeContainer: {
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  radioSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  info: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
});
