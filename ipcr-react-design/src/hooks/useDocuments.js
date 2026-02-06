import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '../api/apiService';

export const documentKeys = {
  all: ['documents'],
  byAgency: (agencyId) => [...documentKeys.all, 'agency', agencyId],
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
      }
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
