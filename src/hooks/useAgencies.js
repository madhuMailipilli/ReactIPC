import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../api/apiService';
import { useAuth } from '../components/AuthContext';

// Query Keys
export const agencyKeys = {
  all: ['agencies'],
  lists: (userRole) => [...agencyKeys.all, 'list', userRole],
  list: (filters, userRole) => [...agencyKeys.lists(userRole), { filters }],
  details: (userRole) => [...agencyKeys.all, 'detail', userRole],
  detail: (id, userRole) => [...agencyKeys.details(userRole), id],
};

// Queries
export const useAgencies = (includeInactive = false, page = 1, limit = 10, search = '', paginated = false) => {
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useQuery({
    queryKey: agencyKeys.list({ includeInactive, page, limit, search, paginated }, userRole),
    queryFn: async () => {
      try {
        // If not paginated, we use a very large limit to get all agencies for dropdowns
        const effectiveLimit = paginated ? limit : 1000;
        const params = { 
          includeInactive, 
          page: paginated ? page : 1, 
          limit: effectiveLimit, 
          search 
        };
        
        const response = await apiService.get('/agencies/get-all', { params });
        
        let items = [];
        let total = null;
        let totalPages = null;

        const resData = response.data;

        // Handle different response structures from API
        if (resData?.data?.data && Array.isArray(resData.data.data)) {
          // Structure: { data: { data: [], total: 50, totalPages: 5 } }
          items = resData.data.data;
          total = resData.data.total ?? resData.data.totalCount ?? resData.data.count;
          totalPages = resData.data.totalPages || resData.data.total_pages || resData.data.pages;
        } else if (resData?.data && Array.isArray(resData.data)) {
          // Structure: { data: [], total: 50, totalPages: 5 }
          items = resData.data;
          total = resData.total || resData.data_total || resData.totalCount || resData.count || resData.total_count;
          totalPages = resData.totalPages || resData.total_pages || resData.pages || resData.total_pages_count;
        } else if (resData?.agencies && Array.isArray(resData.agencies)) {
          // Structure: { agencies: [], total: 50 }
          items = resData.agencies;
          total = resData.total || resData.agencies_total || resData.totalCount || resData.count;
          totalPages = resData.totalPages || resData.total_pages || resData.pages;
        } else if (Array.isArray(resData)) {
          // Structure: [ ... ]
          items = resData;
        }

        // Deep search for total if still null
        if (total === null && resData) {
          total = resData.total ?? resData.totalCount ?? resData.count ?? resData.total_count ?? resData.agencies_total ?? resData.pagination?.total ?? resData.meta?.total;
        }
        if (totalPages === null && resData) {
          totalPages = resData.totalPages ?? resData.total_pages ?? resData.pages ?? resData.pagination?.totalPages ?? resData.meta?.totalPages ?? resData.pagination?.total_pages;
        }

        if (paginated) {
          const pageSize = parseInt(limit);
          const totalCount = total !== null ? parseInt(total) : items.length;
          let calculatedTotalPages = totalPages !== null ? parseInt(totalPages) : Math.ceil(totalCount / pageSize);
          
          // If the API returns exactly the page size, but we don't have total info, 
          // assume there might be more pages (Infinite scroll style hint).
          if (total === null && totalPages === null && items.length === pageSize) {
            calculatedTotalPages = Math.max(calculatedTotalPages, page + 1);
          }
          
          // If the user is on a page that would be empty based on totalCount, 
          // but we actually have items, adjust calculatedTotalPages
          if (items.length > 0 && page > calculatedTotalPages) {
            calculatedTotalPages = page;
          }

          // Important: If items.length is greater than limit, it means the API 
          // returned more than one page (likely all items).
          let paginatedItems = items;
          if (items.length > pageSize) {
            const startIndex = (page - 1) * pageSize;
            paginatedItems = items.slice(startIndex, startIndex + pageSize);
            // If we sliced, ensure totalPages is correct based on all items we got
            if (total === null && totalPages === null) {
              calculatedTotalPages = Math.ceil(items.length / pageSize);
            }
          }

          return {
            items: paginatedItems,
            total: totalCount,
            totalPages: Math.max(calculatedTotalPages, 1),
            currentPage: page,
          };
        }
        
        return items;
      } catch (error) {
        console.error('Error fetching agencies:', error);
        return paginated ? { items: [], total: 0, totalPages: 1, currentPage: page } : [];
      }
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useAgency = (id, includeInactive = false) => {
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.role_id || user?.role;
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: agencyKeys.detail(id, userRole),
    queryFn: async () => {
      const response = await apiService.get(`/agencies/agency/${id}`, { params: { includeInactive } });
      // Response structure: { status: "success", message: "Success", data: { agency_id: "...", agency_name: "...", ... } }
      return response.data?.data || response.data?.agency || response.data;
    },
    enabled: !!id && isAuthenticated,
    initialData: () => {
      if (!id) return undefined;
      const cachedLists = queryClient.getQueriesData({ queryKey: agencyKeys.lists(userRole) });
      const normalizedId = String(id);

      for (const [, data] of cachedLists) {
        if (!data) continue;
        const items = Array.isArray(data) ? data : data.items;
        if (!Array.isArray(items)) continue;
        const match = items.find((agency) => {
          const agencyId = agency?.id ?? agency?.agency_id;
          return agencyId !== undefined && String(agencyId) === normalizedId;
        });
        if (match) return match;
      }

      return undefined;
    },
  });
};

// Mutations
export const useCreateAgency = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useMutation({
    mutationFn: (payload) => apiService.post('/agencies/agency', payload).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.lists(userRole) });
    },
  });
};

export const useUpdateAgency = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useMutation({
    mutationFn: ({ id, data }) => apiService.put(`/agencies/agency/${id}`, data).then(res => res.data),
    onMutate: async ({ id, data }) => {
      if (!id) return {};

      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: agencyKeys.all });

      const normalizedId = String(id);
      const previousQueries = queryClient.getQueriesData({ queryKey: agencyKeys.all });

      const mergeAgency = (agency) => {
        const agencyId = agency?.id ?? agency?.agency_id;
        if (agencyId === undefined || String(agencyId) !== normalizedId) return agency;
        return { ...agency, ...data };
      };

      // Optimistically update detail cache
      const detailKey = agencyKeys.detail(id, userRole);
      const previousDetail = queryClient.getQueryData(detailKey);
      if (previousDetail) {
        queryClient.setQueryData(detailKey, { ...previousDetail, ...data });
      }

      // Optimistically update list caches (array or paginated items)
      queryClient.setQueriesData({ queryKey: agencyKeys.lists(userRole) }, (oldData) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.map(mergeAgency);
        }
        if (Array.isArray(oldData.items)) {
          return { ...oldData, items: oldData.items.map(mergeAgency) };
        }
        return oldData;
      });

      return { previousQueries, detailKey, previousDetail };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      if (context.previousQueries) {
        context.previousQueries.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context.detailKey) {
        queryClient.setQueryData(context.detailKey, context.previousDetail);
      }
    },
    onSuccess: (response, { id, data }) => {
      // Prefer server response if it contains updated agency data
      const updated = response?.data || response?.agency || response;
      if (updated && id) {
        const detailKey = agencyKeys.detail(id, userRole);
        queryClient.setQueryData(detailKey, (old) => ({ ...(old || {}), ...updated }));

        queryClient.setQueriesData({ queryKey: agencyKeys.lists(userRole) }, (oldData) => {
          if (!oldData) return oldData;
          const normalizedId = String(id);
          const mergeAgency = (agency) => {
            const agencyId = agency?.id ?? agency?.agency_id;
            if (agencyId === undefined || String(agencyId) !== normalizedId) return agency;
            return { ...agency, ...updated, ...data };
          };

          if (Array.isArray(oldData)) {
            return oldData.map(mergeAgency);
          }
          if (Array.isArray(oldData.items)) {
            return { ...oldData, items: oldData.items.map(mergeAgency) };
          }
          return oldData;
        });
      }

      // Invalidate all agency-related queries to ensure fresh data in lists and details
      queryClient.invalidateQueries({ queryKey: agencyKeys.all });
      // Also invalidate user queries since users display agency information
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteAgency = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useMutation({
    mutationFn: (id) => apiService.delete(`/agencies/agency/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.lists(userRole) });
    },
  });
};
