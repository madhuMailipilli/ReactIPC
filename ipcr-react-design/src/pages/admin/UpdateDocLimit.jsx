import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAgency, useUpdateAgency } from "../../hooks/useAgencies";

const UpdateDocLimit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: agencyData, isLoading: loading, error } = useAgency(id);
  const updateAgencyMutation = useUpdateAgency();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    agencyName: '',
    currentLimit: '',
    newLimit: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agencyData) {
      const data = agencyData.data || agencyData.agency || agencyData;
      setFormData({
        agencyName: data.agency_name || '',
        currentLimit: data.document_limit || '0',
        newLimit: '',
        reason: ''
      });
    }
  }, [agencyData]);

  const handleInputChange = (field, value) => {
    if (field === 'newLimit') {
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
    
    if (!formData.newLimit) {
      newErrors.newLimit = 'New document limit is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      try {
        const data = agencyData.data || agencyData.agency || agencyData;
        const payload = {
          ...data,
          document_limit: formData.newLimit
        };
        
        const normalizedPayload = {
          agency_name: payload.agency_name,
          branch_code: payload.branch_code,
          email_address: payload.email_address || payload.email,
          country: payload.country,
          phone_number: payload.phone_number || payload.phone,
          alternate_phone: payload.alternate_phone,
          address_line_1: payload.address_line_1 || payload.address1,
          address_line_2: payload.address_line_2 || payload.address2,
          postal_code: payload.postal_code || payload.pincode,
          state: payload.state,
          city: payload.city,
          document_limit: formData.newLimit,
          start_date: payload.start_date ? payload.start_date.split('T')[0] : '',
          end_date: payload.end_date ? payload.end_date.split('T')[0] : ''
        };

        await updateAgencyMutation.mutateAsync({ id, data: normalizedPayload });
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin/agency');
        }, 1500);
      } catch (err) {
        console.error('Failed to update limit:', err);
        alert('Failed to update limit: ' + err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-slate-50 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] animate-pulse">Synchronizing Limit...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-rose-50/50 border border-rose-100 rounded-2xl p-10 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-600 shadow-xl shadow-rose-900/10">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-medium text-rose-900 uppercase tracking-tight">Synchronization Failed</h3>
          <p className="text-rose-700/70 font-medium text-xs mt-2 uppercase tracking-widest">{error.message}</p>
        </div>
        <button 
          onClick={() => navigate('/admin/agency')} 
          className="w-full py-4 bg-rose-600 text-white rounded-2xl font-medium text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-900/20 hover:bg-rose-700 transition-all hover:scale-105 active:scale-95"
        >
          Return to Management
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12 relative">
      {showSuccess && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center border border-slate-100 min-w-[320px]">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm text-slate-900">Limit Updated</p>
              <p className="text-[10px] text-slate-500 font-medium">Document upload limit has been updated.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Update Document Limit</h1>
                <p className="text-slate-500 font-bold text-[10px] mt-1.5 uppercase tracking-[0.2em]">{formData.agencyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all flex items-center text-[10px] font-bold uppercase tracking-widest border border-slate-200 shadow-sm hover:scale-105 active:scale-95"
              >
                Cancel
              </button>

              <button 
                type="submit"
                form="update-limit-form"
                disabled={updateAgencyMutation.isPending}
                className={`px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] transition-all shadow-xl flex items-center uppercase tracking-widest hover:bg-black hover:-translate-y-0.5 active:translate-y-0 hover:scale-105 active:scale-95 ${
                  updateAgencyMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {updateAgencyMutation.isPending ? 'Processing...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form id="update-limit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-md">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h2 className="text-[11px] font-medium text-slate-800 uppercase tracking-[0.2em]">Limit Configuration</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input 
                label="Agency Name" 
                value={formData.agencyName}
                onChange={() => {}}
                disabled
              />
              <Input 
                label="Current Limit" 
                value={formData.currentLimit}
                onChange={() => {}}
                disabled
              />
              <Input 
                label="New Document Limit" 
                required
                value={formData.newLimit}
                onChange={(value) => handleInputChange('newLimit', value)}
                error={errors.newLimit}
                placeholder="Enter new limit"
              />
              <div className="md:col-span-2 space-y-1.5 group">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-slate-900 transition-colors">Reason for Update</label>
                <textarea 
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100/50 focus:border-slate-900 transition-all hover:border-slate-300 resize-none"
                  placeholder="Describe why the limit is being increased..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 space-y-6">
            <h3 className="text-[11px] font-medium text-slate-800 uppercase tracking-[0.2em] mb-4">Usage Insight</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Total Volume</span>
                <span className="text-[13px] font-medium text-slate-900">7,420</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Utilization</span>
                <span className="text-[13px] font-medium text-emerald-600">49.5%</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">Avg Growth</span>
                <span className="text-[13px] font-medium text-slate-900">1,240 / mo</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all duration-500"></div>
            <h3 className="text-[11px] font-medium mb-3 relative z-10 uppercase tracking-[0.2em]">Policy Note</h3>
            <p className="text-slate-400 text-[11px] leading-relaxed relative z-10 font-medium">
              Increasing the document limit may affect the monthly billing cycle. Changes will take effect immediately upon synchronization.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text", error, required = false, disabled = false }) => (
  <div className="space-y-1.5 group">
    <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-slate-900 transition-colors">
      {label}
      {required && <span className="text-slate-900 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2.5 ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-50' : 'bg-white text-slate-700 border-slate-100'} border rounded-xl text-[13px] font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-100/50 focus:border-slate-900 transition-all hover:border-slate-300 ${error ? "border-rose-200 ring-4 ring-rose-50" : ""}`}
    />
    {error && (
      <p className="text-[9px] font-medium text-rose-500 uppercase tracking-widest flex items-center mt-1.5 ml-1">
        <span className="w-1 h-1 bg-rose-500 rounded-full mr-2"></span>
        {error}
      </p>
    )}
  </div>
);

export default UpdateDocLimit;
