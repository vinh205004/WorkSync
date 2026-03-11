import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/AppStack';
import { useAuth } from '../../context/AuthContext';
import { CustomButton } from '../../components/buttons/CustomButton';
import { Card } from '../../components/cards/Card';
import { Loading } from '../../components/loaders/Loading';

type Props = NativeStackScreenProps<AppStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      {
        text: 'Hủy',
        onPress: () => {},
      },
      {
        text: 'Đăng xuất',
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            Alert.alert('Lỗi', 'Đăng xuất thất bại');
          } finally {
            setLoading(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive notifications for approvals
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81C784' }}
            thumbColor={notificationsEnabled ? '#4CAF50' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <Text style={styles.settingTitle}>Biometric Login</Text>
            <Text style={styles.settingDescription}>
              Use fingerprint or face ID
            </Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: '#767577', true: '#81C784' }}
            thumbColor={biometricEnabled ? '#4CAF50' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>

        <Card
          title="Change Password"
          subtitle="Update your password"
          onPress={() => {
            Alert.alert('Feature', 'Password change coming soon');
          }}
        />

        <Card
          title="Two-Factor Authentication"
          subtitle="Add extra security to your account"
          onPress={() => {
            Alert.alert('Feature', '2FA setup coming soon');
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <Card
          title="App Version"
          subtitle="1.0.0"
        />

        <Card
          title="Terms of Service"
          subtitle="Read our terms"
          onPress={() => {
            Alert.alert('Feature', 'Full terms available on web');
          }}
        />

        <Card
          title="Privacy Policy"
          subtitle="Read our privacy policy"
          onPress={() => {
            Alert.alert('Feature', 'Full policy available on web');
          }}
        />

        <Card
          title="Contact Support"
          subtitle="support@worksync.com"
          onPress={() => {
            Alert.alert('Support', 'Email: support@worksync.com');
          }}
        />
      </View>

      <View style={styles.logoutSection}>
        <CustomButton
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          loading={loading}
          fullWidth
        />
      </View>

      <Loading visible={loading} message="Logging out..." />
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
  section: {
    padding: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingLabel: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#999',
  },
  logoutSection: {
    padding: 16,
    paddingBottom: 30,
  },
});
