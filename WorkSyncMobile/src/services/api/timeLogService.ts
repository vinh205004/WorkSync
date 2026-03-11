import axios from './client';
import { TimeLog, CheckinCheckoutRequest } from '../../types';

export const timeLogService = {
  checkin: async (data?: CheckinCheckoutRequest): Promise<TimeLog> => {
    const response = await axios.post('/timekeeping/checkin', data || {});
    return response.data.data;
  },

  checkout: async (data?: CheckinCheckoutRequest): Promise<TimeLog> => {
    const response = await axios.post('/timekeeping/checkout', data || {});
    return response.data.data;
  },

  getTodayStatus: async (): Promise<TimeLog> => {
    const response = await axios.get('/timekeeping/today');
    return response.data.data;
  },
};
