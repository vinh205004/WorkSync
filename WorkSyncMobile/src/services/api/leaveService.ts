import axios from './client';
import {
  LeaveRequest,
  SubmitLeaveRequestDto,
  ReviewLeaveRequestDto,
} from '../../types';

export const leaveService = {
  submitLeaveRequest: async (data: SubmitLeaveRequestDto): Promise<void> => {
    await axios.post('/leave/submit', data);
  },

  getMyLeaveRequests: async (): Promise<LeaveRequest[]> => {
    const response = await axios.get('/leave/my-requests');
    return response.data.data || [];
  },

  getPendingLeaveRequests: async (): Promise<LeaveRequest[]> => {
    const response = await axios.get('/leave/pending');
    return response.data.data || [];
  },

  reviewLeaveRequest: async (
    id: string,
    data: ReviewLeaveRequestDto
  ): Promise<void> => {
    await axios.put(`/leave/${id}/review`, data);
  },

  getLeaveHistory: async (
    employeeId: string
  ): Promise<LeaveRequest[]> => {
    const response = await axios.get(`/leave/history/${employeeId}`);
    return response.data.data || [];
  },
};
