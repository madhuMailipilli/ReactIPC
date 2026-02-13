import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '../api/apiService';
import { useAuth } from '../components/AuthContext';
import { agencyKeys } from './useAgencies';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ipc-black.vercel.app';

export const subscriptionKeys = {
  all: ['subscriptions'],
  plans: () => [...subscriptionKeys.all, 'plans'],
  plan: (planId) => [...subscriptionKeys.plans(), planId],
  agency: (agencyId) => [...subscriptionKeys.all, 'agency', agencyId],
  current: (agencyId) => [...subscriptionKeys.agency(agencyId), 'current'],
  history: (agencyId) => [...subscriptionKeys.agency(agencyId), 'history'],
  usage: (agencyId) => [...subscriptionKeys.agency(agencyId), 'usage'],
};

// Get all subscription plans
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: async () => {
      const response = await apiService.get('/subscriptions/plans');
      return response.data;
    },
  });
};

// Get single subscription plan
export const useSubscriptionPlan = (planId) => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: subscriptionKeys.plan(planId),
    queryFn: async () => {
      const response = await apiService.get(`/subscriptions/plans/${planId}`);
      return response.data;
    },
    enabled: !!planId,
    initialData: () => {
      if (!planId) return undefined;
      const cachedPlans = queryClient.getQueryData(subscriptionKeys.plans());
      if (!cachedPlans) return undefined;
      
      const plans = cachedPlans?.data || cachedPlans;
      if (!Array.isArray(plans)) return undefined;
      
      const normalizedId = String(planId);
      return plans.find((plan) => {
        const id = plan?.id ?? plan?.plan_id ?? plan?.subscription_plan_id;
        return id !== undefined && String(id) === normalizedId;
      });
    },
  });
};

// Create subscription plan
export const useCreatePlan = () => {
  return useMutation({
    mutationFn: async (planData) => {
      const response = await apiService.post('/subscriptions/plans', planData);
      return response.data;
    }
  });
};

// Update subscription plan
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const planId = payload?.planId ?? payload?.id;
      const planData = payload?.planData ?? payload?.data;
      if (!planId) {
        throw new Error('Plan ID is required to update a subscription plan.');
      }
      const response = await apiService.put(`/subscriptions/plans/${planId}`, planData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.plans() });
    }
  });
};

// Delete subscription plan
export const useDeletePlan = () => {
  return useMutation({
    mutationFn: async (planId) => {
      const response = await apiService.delete(`/subscriptions/plans/${planId}`);
      return response.data;
    }
  });
};

// Assign subscription to agency
export const useAssignSubscription = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userRole = user?.role_id || user?.role;

  return useMutation({
    mutationFn: async ({ agencyId, subscriptionData }) => {
      const response = await apiService.post(`/agencies/${agencyId}/subscriptions`, {
        subscription_plan_id: subscriptionData.planId
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      const { agencyId, subscriptionData } = variables;
      const payload = data?.data ?? data?.subscription ?? data;
      const nextCurrent = payload && typeof payload === 'object'
        ? { ...payload, subscription_plan_id: payload.subscription_plan_id ?? subscriptionData.planId }
        : { subscription_plan_id: subscriptionData.planId };

      queryClient.setQueryData(subscriptionKeys.current(agencyId), nextCurrent);

      queryClient.setQueryData(subscriptionKeys.history(agencyId), (old) => {
        const existing = old?.data || old;
        if (Array.isArray(existing)) {
          const deduped = nextCurrent?.id
            ? existing.filter((item) => item?.id !== nextCurrent.id)
            : existing;
          const updated = [nextCurrent, ...deduped];
          return old?.data ? { ...old, data: updated } : updated;
        }
        if (!old) {
          return [nextCurrent];
        }
        return old;
      });

      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current(agencyId) });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.history(agencyId) });

      if (userRole) {
        queryClient.invalidateQueries({ queryKey: agencyKeys.detail(agencyId, userRole) });
      } else {
        queryClient.invalidateQueries({ queryKey: agencyKeys.all });
      }
    }
  });
};

// Get current subscription
export const useCurrentSubscription = (agencyId) => {
  return useQuery({
    queryKey: subscriptionKeys.current(agencyId),
    queryFn: async () => {
      const response = await apiService.get(`/agencies/${agencyId}/subscriptions/current`);
      return response.data;
    },
    enabled: !!agencyId,
  });
};

// Get subscription history
export const useSubscriptionHistory = (agencyId) => {
  return useQuery({
    queryKey: subscriptionKeys.history(agencyId),
    queryFn: async () => {
      const response = await apiService.get(`/agencies/${agencyId}/subscriptions/history`);
      return response.data;
    },
    enabled: !!agencyId,
  });
};

// Get usage data
export const useUsage = (agencyId) => {
  return useQuery({
    queryKey: subscriptionKeys.usage(agencyId),
    queryFn: async () => {
      const response = await apiService.get(`/subscriptions/usage/${agencyId}`);
      return response.data;
    },
    enabled: !!agencyId,
  });
};

// Combined hook for subscription management
export const useSubscriptions = () => {
  const assignMutation = useAssignSubscription();

  return {
    assignSubscription: async (agencyId, subscriptionData) => {
      return assignMutation.mutateAsync({ agencyId, subscriptionData });
    },
    getCurrentSubscription: async (agencyId) => {
      const response = await apiService.get(`/agencies/${agencyId}/subscriptions/current`);
      return response.data;
    },
    getSubscriptionHistory: async (agencyId) => {
      const response = await apiService.get(`/agencies/${agencyId}/subscriptions/history`);
      return response.data;
    },
    getUsage: async (agencyId) => {
      const response = await apiService.get(`/agencies/${agencyId}/usage`);
      return response.data;
    }
  };
};
