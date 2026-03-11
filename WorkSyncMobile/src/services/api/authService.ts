import axios from './client';
import { LoginDto, RegisterDto, AuthResponse, Employee } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await axios.post('/auth/register', data);
    return response.data.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await axios.post('/auth/login', data);
    const result = response.data.data;
    
    // Store token and user
    await AsyncStorage.setItem('authToken', result.token);
    await AsyncStorage.setItem('user', JSON.stringify(result.employee));
    
    return result;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  getStoredUser: async (): Promise<Employee | null> => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getStoredToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('authToken');
  },
};
