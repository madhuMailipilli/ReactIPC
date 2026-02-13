import apiService from './apiService';

export const subscriptionService = {
  // Subscription Plans
  createPlan: (planData) => apiService.post('/subscriptions/plans', planData),
  getPlans: (params = {}) => apiService.get('/subscriptions/plans', { params }),
  getPlanById: (id) => apiService.get(`/subscriptions/plans/${id}`),
  updatePlan: (id, planData) => apiService.put(`/subscriptions/plans/${id}`, planData),
  deletePlan: (id) => apiService.delete(`/subscriptions/plans/${id}`),

  // Subscription Management
  assignSubscription: (subscriptionData) => apiService.post('/subscriptions/assign', subscriptionData),
  getActiveSubscription: (agencyId) => apiService.get(`/agencies/${agencyId}/subscriptions/current`),
  getSubscriptionHistory: (agencyId, params = {}) => apiService.get(`/agencies/${agencyId}/subscriptions/history`, { params }),
  getUsage: (agencyId) => apiService.get(`/subscriptions/usage/${agencyId}`),
};

export default subscriptionService;