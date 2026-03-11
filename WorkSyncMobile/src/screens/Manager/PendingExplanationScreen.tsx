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
import { explanationService } from '../../services/api/explanationService';
import { Card } from '../../components/cards/Card';
import { Loading } from '../../components/loaders/Loading';
import { ExplanationRequest } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'PendingExplanation'>;

export const PendingExplanationScreen: React.FC<Props> = ({
  navigation,
}) => {
  const [explanations, setExplanations] = useState<ExplanationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const requests = await explanationService.getPendingExplanationRequests();
      setExplanations(requests);
    } catch (error) {
      console.error('Error loading pending explanations:', error);
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

  const handleViewDetails = (explanationId: string) => {
    navigation.navigate('ExplanationDetail', { id: explanationId });
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'Late' ? '#FF9800' : '#4CAF50';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Explanations</Text>
        <Text style={styles.count}>Total: {explanations.length}</Text>
      </View>

      <View style={styles.content}>
        {explanations.length > 0 ? (
          explanations.map((explanation) => (
            <Card
              key={explanation.id}
              title={explanation.employeeName}
              subtitle={`${explanation.type} - ${explanation.date}\n${explanation.explanation}`}
              badge={explanation.type}
              badgeColor={getTypeBadgeColor(explanation.type)}
              onPress={() => handleViewDetails(explanation.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No pending explanations</Text>
          </View>
        )}
      </View>

      <Loading visible={loading} message="Loading explanations..." />
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
