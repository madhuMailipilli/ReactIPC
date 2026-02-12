import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../api/apiService';
import { useAuth } from '../components/AuthContext';

// Query Keys
export const userKeys = {
  all: ['users'],
  lists: (userRole) => [...userKeys.all, 'list', userRole],
  list: (filters, userRole) => [...userKeys.lists(userRole), { filters }],
  details: (userRole) => [...userKeys.all, 'detail', userRole],
  detail: (id, userRole) => [...userKeys.details(userRole), id],
};

// Queries
export const useUsers = (page = 1, limit = 10, search = '', paginated = false) => {
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useQuery({
    queryKey: userKeys.list({ page, limit, search, paginated }, userRole),
    queryFn: async () => {
      // If not paginated, we use a very large limit to get all users for management
      const effectiveLimit = paginated ? limit : 1000;
      const params = { 
        page: paginated ? page : 1, 
        limit: effectiveLimit, 
        search 
      };
      
      const response = await apiService.get('/auth/get-all-users', { params });
      
      let items = [];
      let total = null;
      let totalPages = null;

      // Handle different response structures
      const resData = response.data;
      if (resData?.data?.users && Array.isArray(resData.data.users)) {
        items = resData.data.users;
        total = resData.data.total;
        totalPages = resData.data.totalPages;
      } else if (resData?.data && Array.isArray(resData.data)) {
        items = resData.data;
        total = resData.total || resData.data.total;
        totalPages = resData.totalPages || resData.data.totalPages;
      } else if (resData?.users && Array.isArray(resData.users)) {
        items = resData.users;
        total = resData.total || resData.users_total || resData.total_users;
        totalPages = resData.totalPages || resData.total_pages || resData.pages;
      } else if (Array.isArray(resData)) {
        items = resData;
      }

      // Deep search for total if still null
      if (total === null && resData) {
        total = resData.total ?? resData.totalCount ?? resData.count ?? resData.total_count ?? resData.users_total ?? resData.pagination?.total ?? resData.meta?.total;
      }
      if (totalPages === null && resData) {
        totalPages = resData.totalPages ?? resData.total_pages ?? resData.pages ?? resData.pagination?.totalPages ?? resData.meta?.totalPages ?? resData.pagination?.total_pages;
      }

      if (paginated) {
        const pageSize = parseInt(limit);
        const totalCount = total !== null ? parseInt(total) : items.length;
        let calculatedTotalPages = totalPages !== null ? parseInt(totalPages) : Math.ceil(totalCount / pageSize);
        
        // If the API returns exactly the page size, but we don't have total info, 
        // assume there might be more pages.
        if (total === null && totalPages === null && items.length === pageSize) {
          calculatedTotalPages = Math.max(calculatedTotalPages, page + 1);
        }

        let paginatedItems = items;
        if (items.length > pageSize) {
          const startIndex = (page - 1) * pageSize;
          paginatedItems = items.slice(startIndex, startIndex + pageSize);
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
    },
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData,
    staleTime: 0,
  });
};

export const useUser = (id) => {
  const { user, isAuthenticated } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useQuery({
    queryKey: userKeys.detail(id, userRole),
    queryFn: () => apiService.get(`/auth/${id}`).then(res => res.data.data),
    enabled: !!id && isAuthenticated,
  });
};

// Mutations
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useMutation({
    mutationFn: (userData) => apiService.post('/auth/register', userData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists(userRole) });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useMutation({
    mutationFn: ({ id, data }) => apiService.put(`/auth/${id}`, data).then(res => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists(userRole) });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id, userRole) });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useMutation({
    mutationFn: (id) => apiService.delete(`/auth/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists(userRole) });
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role_id || user?.role;
  
  return useMutation({
    mutationFn: ({ userId, newPassword }) => 
      apiService.put(`/auth/reset-password/${userId}`, { password: newPassword }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists(userRole) });
    },
  });
};