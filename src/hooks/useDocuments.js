import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '../api/apiService';
import documentService from '../api/documentService';

export const documentKeys = {
  all: ['documents'],
  byAgency: (agencyId) => [...documentKeys.all, 'agency', agencyId],
  usage: (agencyId) => [...documentKeys.all, 'usage', agencyId],
};

export const useUploadDocuments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await apiService.post('/documents', formData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      const agencyId = variables.get('agency_id');
      if (agencyId) {
        queryClient.invalidateQueries({ queryKey: documentKeys.byAgency(agencyId) });
        queryClient.invalidateQueries({ queryKey: documentKeys.usage(agencyId) });
      }
      queryClient.invalidateQueries({ queryKey: ['subscriptionUsage'] });
    },
  });
};

export const useDocumentsByAgency = (agencyId) => {
  return useQuery({
    queryKey: documentKeys.byAgency(agencyId),
    queryFn: async () => {
      const response = await apiService.get(`/documents/agency/${agencyId}/documents`);
      return response.data;
    },
    enabled: !!agencyId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useAgencyUsage = (agencyId) => {
  return useQuery({
    queryKey: documentKeys.usage(agencyId),
    queryFn: () => documentService.getAgencyUsage(agencyId),
    enabled: !!agencyId,
    staleTime: 30000,
  });
};

export const useSubscriptionUsage = () => {
  return useQuery({
    queryKey: ['subscriptionUsage'],
    queryFn: async () => {
      const response = await apiService.get('/subscriptions/usage?limit=20');
      return response.data;
    },
    staleTime: 30000,
  });
};
