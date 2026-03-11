import axios from './client';
import {
  ExplanationRequest,
  SubmitExplanationDto,
  ReviewExplanationDto,
} from '../../types';

export const explanationService = {
  submitExplanation: async (data: SubmitExplanationDto): Promise<void> => {
    await axios.post('/explanation/submit', data);
  },

  getMyExplanationRequests: async (): Promise<ExplanationRequest[]> => {
    const response = await axios.get('/explanation/my-requests');
    return response.data.data || [];
  },

  getPendingExplanationRequests: async (): Promise<ExplanationRequest[]> => {
    const response = await axios.get('/explanation/pending');
    return response.data.data || [];
  },

  reviewExplanationRequest: async (
    id: string,
    data: ReviewExplanationDto
  ): Promise<void> => {
    await axios.put(`/explanation/${id}/review`, data);
  },

  getExplanationHistory: async (
    employeeId?: string
  ): Promise<ExplanationRequest[]> => {
    const endpoint = employeeId
      ? `/explanation/history/${employeeId}`
      : '/explanation/my-requests';
    const response = await axios.get(endpoint);
    return response.data.data || [];
  },
};
