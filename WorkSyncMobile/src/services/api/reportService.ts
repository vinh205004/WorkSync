import axios from './client';
import { MonthlyReportDto } from '../../types';

export const reportService = {
  getMonthlyReport: async (
    month: number,
    year: number
  ): Promise<MonthlyReportDto> => {
    const response = await axios.get('/report/monthly', {
      params: { month, year },
    });
    return response.data.data;
  },

  getEmployeeMonthlyReport: async (
    employeeId: string,
    month: number,
    year: number
  ): Promise<MonthlyReportDto> => {
    const response = await axios.get(`/report/employee/${employeeId}`, {
      params: { month, year },
    });
    return response.data.data;
  },

  getTeamReport: async (
    month: number,
    year: number
  ): Promise<MonthlyReportDto[]> => {
    const response = await axios.get('/report/monthly', {
      params: { month, year },
    });
    return response.data.data || [];
  },
};
