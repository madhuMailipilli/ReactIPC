import React, { useEffect } from "react";
import { useNavigate, useParams, Link, useSearchParams } from "react-router-dom";
import { useAgency } from "../../hooks/useAgencies";
import { useCurrentSubscription, useSubscriptionHistory, useSubscriptionPlans } from "../../hooks/useSubscriptions";
import logo from "../../assets/logo.png";

const AgencyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get('returnPage') || '1';
  const search = searchParams.get('search') || '';
  const { data: agencyData, isLoading: agencyLoading, error } = useAgency(id, true);
  const { data: currentSubscription, isLoading: subLoading } = useCurrentSubscription(id);
  const { data: subscriptionHistory, isLoading: historyLoading } = useSubscriptionHistory(id);
  const { data: plansResponse, isLoading: plansLoading } = useSubscriptionPlans();
  
  // Robust data extraction
  const subscriptionPlans = Array.isArray(plansResponse) ? plansResponse : 
                           Array.isArray(plansResponse?.data) ? plansResponse.data :
                           Array.isArray(plansResponse?.plans) ? plansResponse.plans : [];

  const currentSubData = currentSubscription?.data || currentSubscription;
  const historyData = subscriptionHistory?.data || subscriptionHistory || [];

  const isDataLoading = agencyLoading || subLoading || historyLoading || plansLoading;
  const hasData = agencyData && (currentSubscription !== undefined);

  useEffect(() => {
    if (!isDataLoading && (error || !agencyData)) {
      navigate('/admin/agency');
    }
  }, [error, agencyData, isDataLoading, navigate]);

  if (isDataLoading && !hasData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <img src={logo} alt="IPC Logo" className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            <svg className="w-16 h-16 animate-spin" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1B3C53" strokeWidth="8" strokeDasharray="220" strokeDashoffset="60" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] animate-pulse">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !agencyData) {
    return null;
  }

  // Process agency data
  const data = agencyData.data || agencyData.agency || agencyData;
  const formData = {
    agencyName: data.agency_name || '',
    branchCode: data.branch_code || '',
    email: data.email_address || data.email || '',
    country: data.country || '',
    phone: data.phone_number || data.phone || '',
    alternatePhone: data.alternate_phone || '',
    address1: data.address_line_1 || data.address1 || '',
    address2: data.address_line_2 || data.address2 || '',
    pincode: data.postal_code || data.pincode || '',
    state: data.state || '',
    city: data.city || '',
    documentLimit: data.document_limit || '',
    startDate: data.start_date ? data.start_date.split('T')[0] : '',
    endDate: data.end_date ? data.end_date.split('T')[0] : '',
    active: data.active ?? data.is_active ?? true
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#1B3C53] rounded-2xl p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v8" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">Agency Profile</h1>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-blue-100 font-medium text-[11px] uppercase tracking-widest">{formData.agencyName}</p>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border shadow-sm ${
                  formData.active 
                    ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-100 border-rose-500/30'
                }`}>
                  {formData.active ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const params = new URLSearchParams({ page: returnPage });
                if (search) params.set('search', search);
                navigate(`/admin/agency?${params.toString()}`);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all flex items-center text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg"
            >
              Back
            </button>

            <Link 
              to={`/admin/agency/edit/${id}?returnPage=${returnPage}${search ? `&search=${search}` : ''}`}
              className="px-4 py-2 bg-white text-[#1B3C53] rounded-xl font-bold text-[10px] transition-all shadow-xl flex items-center uppercase tracking-widest hover:bg-blue-50"
            >
              Edit Agency
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Row 1: Agency Identity & Current Plan Session */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <svg className="w-4 h-4 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v8" />
                </svg>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Agency Identity</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <DetailItem label="Agency Name" value={formData.agencyName} />
                <DetailItem label="Branch Code" value={formData.branchCode} />
                <DetailItem label="Email Address" value={formData.email} />
                <DetailItem label="Country" value={formData.country} />
                <DetailItem label="Phone Number" value={formData.phone} />
                <DetailItem label="Alternate Phone Number" value={formData.alternatePhone} />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md">
              <div className="px-6 py-4 border-b border-slate-50 bg-gradient-to-r from-slate-50/80 to-transparent flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Current Plan Session</h2>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                {currentSubData && currentSubData.subscription_plan_id ? (
                  <div className="space-y-5 flex-1 flex flex-col justify-center">
                    <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
                      <p className="text-sm font-medium text-slate-700 mb-1.5">Active Plan</p>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></div>
                        <span className="text-[13px] font-bold text-[#1B3C53] tracking-tight">
                          {subscriptionPlans.find(p => p.id === currentSubData.subscription_plan_id)?.name || `Plan ${currentSubData.subscription_plan_id}`}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-slate-700">Start Date</span>
                        </div>
                        <span className="text-[13px] font-medium text-slate-700">
                          {new Date(currentSubData.start_date || currentSubData.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-slate-700">End Date</span>
                        </div>
                        <span className="text-[13px] font-medium text-slate-700">
                          {new Date(currentSubData.end_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No Active Session</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Location Details & History */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Location Details</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                <div className="md:col-span-3">
                  <DetailItem label="Address Line 1" value={formData.address1} />
                </div>
                <div className="md:col-span-3">
                  <DetailItem label="Address Line 2" value={formData.address2} />
                </div>
                <DetailItem label="City" value={formData.city} />
                <DetailItem label="State" value={formData.state} />
                <DetailItem label="Postal Code" value={formData.pincode} />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">History</h2>
              </div>
              <div className="divide-y divide-slate-50 flex-1 overflow-y-auto max-h-[320px]">
                {historyData && historyData.length > 0 ? (
                  historyData.map((sub, index) => (
                    <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-[#1B3C53]">
                          {sub.plan_name || 'Unknown Plan'}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                          sub.is_active 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {sub.status || (sub.is_active ? 'Active' : 'Expired')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {sub.start_date && `${new Date(sub.start_date).toLocaleDateString(undefined, { dateStyle: 'medium' })} - ${new Date(sub.end_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}`}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No History</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="space-y-1.5 group">
    <label className="text-sm font-medium text-slate-700 ml-1">
      {label}
    </label>
    <div className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] font-medium text-slate-700 shadow-sm transition-all duration-200 group-hover:border-blue-300 group-hover:shadow-md">
      {value || <span className="text-slate-400">Not provided</span>}
    </div>
  </div>
);

export default AgencyDetails;
