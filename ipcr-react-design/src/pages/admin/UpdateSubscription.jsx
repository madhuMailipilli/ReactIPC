import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAgency, useUpdateAgency, agencyKeys } from "../../hooks/useAgencies";
import { useSubscriptionPlans, subscriptionKeys } from "../../hooks/useSubscriptions";
import CustomDatePicker from "../../components/CustomDatePicker";

const UpdateSubscription = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: agencyData, isLoading: loading, error } = useAgency(id);
  const { data: plansResponse, isLoading: plansLoading } = useSubscriptionPlans();
  const updateAgencyMutation = useUpdateAgency();
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Robust plan extraction
  const subscriptionPlans = Array.isArray(plansResponse) ? plansResponse : 
                           Array.isArray(plansResponse?.data) ? plansResponse.data :
                           Array.isArray(plansResponse?.plans) ? plansResponse.plans : [];
  
  const [formData, setFormData] = useState({
    agencyName: '',
    currentPlan: 'Professional',
    newPlan: '',
    documentLimit: '',
    term: '',
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agencyData) {
      const data = agencyData.data || agencyData.agency || agencyData;
      
      // Find plan name if subscription data exists
      let planName = 'No Active Plan';
      if (data.subscription_plan_id && subscriptionPlans.length > 0) {
        const plan = subscriptionPlans.find(p => p.id === data.subscription_plan_id);
        if (plan) planName = plan.name;
      }

      setFormData({
        agencyName: data.agency_name || '',
        currentPlan: planName,
        newPlan: data.subscription_plan_id || '',
        documentLimit: data.document_limit || '',
        term: data.term || '365',
        startDate: data.start_date ? data.start_date.split('T')[0] : '',
        endDate: data.end_date ? data.end_date.split('T')[0] : ''
      });
    }
  }, [agencyData, subscriptionPlans]);

  const handleInputChange = (field, value) => {
    if (['documentLimit', 'term'].includes(field)) {
      value = value.replace(/[^0-9]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.newPlan) newErrors.newPlan = 'Please select a new plan';
    if (!formData.documentLimit) newErrors.documentLimit = 'Document limit is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const data = agencyData.data || agencyData.agency || agencyData;
        const normalizedPayload = {
          agency_name: data.agency_name,
          branch_code: data.branch_code,
          email_address: data.email_address || data.email,
          country: data.country,
          phone_number: data.phone_number || data.phone,
          alternate_phone: data.alternate_phone,
          address_line_1: data.address_line_1 || data.address1,
          address_line_2: data.address_line_2 || data.address2,
          postal_code: data.postal_code || data.pincode,
          state: data.state,
          city: data.city,
          document_limit: parseInt(formData.documentLimit),
          start_date: formData.startDate,
          end_date: formData.endDate,
          term: parseInt(formData.term),
          subscription_plan_id: parseInt(formData.newPlan)
        };

        await updateAgencyMutation.mutateAsync({ id, data: normalizedPayload });
        
        // Background invalidation - don't await to keep UI responsive
        queryClient.invalidateQueries({ queryKey: agencyKeys.all });
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.current(id) });
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.history(id) });

        setShowSuccess(true);
        // Instant navigation for snappier feel
        setTimeout(() => {
          navigate(`/admin/agency/view/${id}`);
        }, 300);
      } catch (err) {
        console.error('Failed to update subscription:', err);
        alert('Failed to update subscription: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Subscription...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Sync Failed</h3>
        <p className="text-slate-500 text-sm mb-8">{error.message}</p>
        <button onClick={() => navigate('/admin/agency')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-white/95 backdrop-blur-md text-slate-900 px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center border border-slate-100 min-w-[320px]">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[13px] text-slate-900">Protocol Synchronized</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Subscription updated successfully</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden relative shadow-2xl shadow-slate-200/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="p-10 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 shadow-inner">
                <svg className="w-10 h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tune Subscription</h1>
                <p className="text-slate-500 font-bold text-[11px] mt-1.5 uppercase tracking-[0.2em]">{formData.agencyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all border border-slate-200">
                Cancel
              </button>
              <button 
                type="submit" 
                form="update-subscription-form" 
                disabled={updateAgencyMutation.isPending}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {updateAgencyMutation.isPending ? 'Syncing...' : 'Deploy Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form id="update-subscription-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Plan Selection */}
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900/10 flex items-center justify-center text-slate-900">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Service Architecture</h2>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Current Tier" value={formData.currentPlan} disabled />
              <Select 
                label="Target Tier" 
                required 
                value={formData.newPlan} 
                onChange={(v) => handleInputChange('newPlan', v)} 
                error={errors.newPlan}
                options={subscriptionPlans.map(plan => ({
                  value: plan.id,
                  label: `${plan.name} ($${plan.price})`
                }))}
              />
              <Input 
                label="Document Allocation" 
                required 
                value={formData.documentLimit} 
                onChange={(v) => handleInputChange('documentLimit', v)} 
                error={errors.documentLimit}
                placeholder="0"
              />
              <Input 
                label="Retention Period (Days)" 
                required 
                value={formData.term} 
                onChange={(v) => handleInputChange('term', v)} 
                placeholder="365"
              />
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Operational Timeline</h2>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <CustomDatePicker
                label="Activation Date"
                value={formData.startDate}
                onChange={(v) => handleInputChange('startDate', v)}
              />
              <CustomDatePicker
                label="Expiration Date"
                value={formData.endDate}
                onChange={(v) => handleInputChange('endDate', v)}
                futureOnly={true}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8">
            <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-6">Real-time Utilization</h3>
            <div className="space-y-4">
              <UsageRow label="Operational Status" value="Active" isStatus />
              <UsageRow label="Quota Usage" value="7,420 / 15,000" />
              <UsageRow label="Time To Expiry" value="142 Days" />
            </div>
            
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-slate-900 h-full rounded-full" style={{ width: '49.4%' }}></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
                <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">49.4%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h4 className="text-lg font-bold tracking-tight mb-2 relative z-10">Custom Requirements?</h4>
            <p className="text-slate-300 text-[12px] mb-6 leading-relaxed relative z-10 font-medium">For tailored enterprise limits or complex scalability needs, our architects are ready to assist.</p>
            <button className="w-full py-3.5 bg-white text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg active:scale-95">
              Request Consultancy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const UsageRow = ({ label, value, isStatus }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    {isStatus ? (
      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-emerald-100">{value}</span>
    ) : (
      <span className="text-[13px] font-bold text-slate-900 tracking-tight">{value}</span>
    )}
  </div>
);

const Input = ({ label, value, onChange, placeholder, disabled = false, error, required = false }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
      {label}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-5 py-3.5 ${disabled ? 'bg-slate-50/50 text-slate-400 cursor-not-allowed' : 'bg-slate-50 text-slate-900'} border border-slate-200 rounded-xl text-[13px] font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all ${error ? 'border-rose-400' : ''}`}
    />
    {error && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-1">{error}</p>}
  </div>
);

const Select = ({ label, value, onChange, options, error, required = false }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
      {label}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all ${error ? 'border-rose-400' : ''}`}
      >
        <option value="">Select Option</option>
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {error && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-1">{error}</p>}
  </div>
);

export default UpdateSubscription;
