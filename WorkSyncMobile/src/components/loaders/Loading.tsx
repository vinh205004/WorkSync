import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Modal,
} from 'react-native';

interface LoadingProps {
  visible: boolean;
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  visible,
  message = 'Loading...',
}) => {
  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <View style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4CAF50" />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    minWidth: 150,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
