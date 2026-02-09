import React from 'react';
import { useCurrentSubscription, useSubscriptionPlan } from '../hooks/useSubscriptions';

const AgencyRowWithSubscription = ({ agency, children }) => {
  const agencyId = agency.id || agency.agency_id;
  const { data: subscriptionData } = useCurrentSubscription(agencyId);
  const subscription = subscriptionData?.data || subscriptionData;
  const planId = subscription?.subscription_plan_id;
  
  const { data: planData } = useSubscriptionPlan(planId);
  const plan = planData?.data || planData;
  
  const currentSubscription = subscription ? {
    ...subscription,
    document_limit: plan?.max_documents,
    term: plan?.validity_days,
    plan_name: plan?.name
  } : null;

  return children({ currentSubscription });
};

export default AgencyRowWithSubscription;
