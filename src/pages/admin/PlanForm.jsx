import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreatePlan, useUpdatePlan, useSubscriptionPlan } from '../../hooks/useSubscriptions';

const PlanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const { data: planData, isLoading: loadingPlan } = useSubscriptionPlan(id);
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    max_documents: '',
    validity_days: '',
    price: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && planData) {
      const data = planData.data?.data || planData.data || planData;
      setFormData({
        code: data.code || '',
        name: data.name || '',
        max_documents: data.max_documents?.toString() || '',
        validity_days: data.validity_days?.toString() || '',
        price: data.price?.toString() || ''
      });
    }
  }, [isEdit, planData]);

  const handleInputChange = (field, value) => {
    if (['max_documents', 'validity_days'].includes(field)) {
      value = value.replace(/[^0-9]/g, '');
    }
    if (field === 'price') {
      value = value.replace(/[^0-9.]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.code) newErrors.code = 'Plan code is required';
    if (!formData.name) newErrors.name = 'Plan name is required';
    if (!formData.max_documents) newErrors.max_documents = 'Document limit is required';
    if (!formData.validity_days) newErrors.validity_days = 'Validity period is required';
    if (!formData.price) newErrors.price = 'Price is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const payload = {
          ...formData,
          max_documents: parseInt(formData.max_documents),
          validity_days: parseInt(formData.validity_days),
          price: parseFloat(formData.price)
        };

        if (isEdit) {
          await updatePlanMutation.mutateAsync({ id, data: payload });
        } else {
          await createPlanMutation.mutateAsync(payload);
        }
        
        setShowSuccess(true);
        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            navigate('/admin/subscription/plans');
          }, 300);
        }, 1500);
      } catch (err) {
        alert(`Failed to ${isEdit ? 'update' : 'create'} plan: ` + err.message);
      }
    }
  };

  if (isEdit && loadingPlan && !planData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto space-y-6 pb-12 relative transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in duration-500'}`}>
      <style>
        {`
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #f8fafc inset !important;
            -webkit-text-fill-color: #0f172a !important;
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-6 z-[60] animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center border border-slate-100 min-w-[320px]">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-normal text-sm text-slate-900">Plan successfully {isEdit ? 'updated' : 'created'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => navigate('/admin/subscription/plans')}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-all active:scale-90 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {isEdit ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">Define your service plan parameters and pricing</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/admin/subscription/plans')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all border border-slate-200"
              >
                Cancel
              </button>

              <button 
                type="submit"
                form="plan-form"
                disabled={createPlanMutation.isPending || updatePlanMutation.isPending}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-black transition-all shadow-sm disabled:opacity-70 flex items-center gap-2.5"
              >
                {createPlanMutation.isPending || updatePlanMutation.isPending ? (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : null}
                {isEdit ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form id="plan-form" onSubmit={handleSubmit} className="mt-2">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-md">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2.5">
            <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-base font-bold text-slate-900">Plan Configuration</h2>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <Input 
              label="Plan Code" 
              required
              disabled={isEdit}
              value={formData.code}
              onChange={(value) => handleInputChange('code', value.toUpperCase())}
              error={errors.code}
              placeholder="e.g., PREMIUM_GOLD"
            />
            <Input 
              label="Plan Name" 
              required
              value={formData.name}
              onChange={(value) => handleInputChange('name', value)}
              error={errors.name}
              placeholder="e.g., Gold Enterprise"
            />
            <Input 
              label="Document Limit" 
              required
              value={formData.max_documents}
              onChange={(value) => handleInputChange('max_documents', value)}
              error={errors.max_documents}
              placeholder="0"
            />
            <Input 
              label="Validity Period (Days)" 
              required
              value={formData.validity_days}
              onChange={(value) => handleInputChange('validity_days', value)}
              error={errors.validity_days}
              placeholder="365"
            />
            <div className="md:col-span-2 max-w-sm">
              <Input 
                label="Tier Price ($)" 
                required
                value={formData.price}
                onChange={(value) => handleInputChange('price', value)}
                error={errors.price}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text", error, required = false, disabled = false }) => (
  <div className="space-y-2 group">
    <label className="text-sm font-medium text-slate-700 ml-1">
      {label}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-0 focus:border-slate-900 transition-all ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : 'hover:border-slate-300 focus:bg-white'} ${error ? "border-rose-400 focus:border-rose-500" : ""}`}
      />
      {error && (
        <p className="text-[9px] font-medium text-rose-500 flex items-center ml-1 uppercase tracking-widest">
          <span className="w-1 h-1 bg-rose-500 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  </div>
);


export default PlanForm;