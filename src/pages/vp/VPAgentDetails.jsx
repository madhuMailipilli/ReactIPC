import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../../hooks/useUsers";

const VPAgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get('returnPage') || '1';
  const search = searchParams.get('search') || '';
  const { data: userData, isLoading: loading, error } = useUser(id);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Process user data
  let user = null;
  
  if (userData?.data) {
    const userInfo = userData.data;
    let roleNames = 'Agent';
    if (userInfo.roles && userInfo.roles.length > 0) {
      roleNames = userInfo.roles.map(role => role.code).join(', ');
    }
    
    const primaryPhone = userInfo.phones && userInfo.phones.length > 0 ? userInfo.phones[0].phone_number : '';
    const primaryAddress = userInfo.addresses && userInfo.addresses.length > 0 ? userInfo.addresses[0] : {};
    const primaryAgency = userInfo.agencies && userInfo.agencies.length > 0 ? userInfo.agencies[0] : {};

    user = {
      username: userInfo.username,
      email: userInfo.email,
      firstName: userInfo.first_name || '',
      lastName: userInfo.last_name || '',
      middleName: userInfo.middle_name || '',
      phone: primaryPhone,
      country: primaryAddress.country || '',
      address: primaryAddress.address || '',
      agency: primaryAgency.agency_name || '',
      branchCode: primaryAgency.branch_code || '',
      role: roleNames,
      active: userInfo.is_active,
      createdDate: userInfo.created_at
        ? new Date(userInfo.created_at).toLocaleDateString()
        : 'N/A',
      lastLogin: userInfo.last_login_at
        ? new Date(userInfo.last_login_at).toLocaleDateString()
        : 'Never'
    };
  } else if (userData) {
    // Fallback: check if data is directly in userData
    let roleNames = 'Agent';
    if (userData.roles && userData.roles.length > 0) {
      roleNames = userData.roles.map(role => role.code).join(', ');
    }
    
    const primaryPhone = userData.phones && userData.phones.length > 0 ? userData.phones[0].phone_number : '';
    const primaryAddress = userData.addresses && userData.addresses.length > 0 ? userData.addresses[0] : {};
    const primaryAgency = userData.agencies && userData.agencies.length > 0 ? userData.agencies[0] : {};

    user = {
      username: userData.username,
      email: userData.email,
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      middleName: userData.middle_name || '',
      phone: primaryPhone,
      country: primaryAddress.country || '',
      address: primaryAddress.address || '',
      agency: primaryAgency.agency_name || '',
      branchCode: primaryAgency.branch_code || '',
      role: roleNames,
      active: userData.is_active,
      createdDate: userData.created_at
        ? new Date(userData.created_at).toLocaleDateString()
        : 'N/A',
      lastLogin: userData.last_login_at
        ? new Date(userData.last_login_at).toLocaleDateString()
        : 'Never'
    };
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest animate-pulse">
          Accessing Agent Record...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-4 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-medium uppercase tracking-widest">
            {error.message}
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
          Agent Not Found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700 pb-12">
      <style>
        {`
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-zoomIn { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}
      </style>
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden relative">
        <div className="p-6 bg-[#1B3C53] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-medium text-white tracking-tight">Agent Details</h1>
                <div className="flex items-center gap-3 mt-1.5">
                  <p className="text-blue-100 font-medium text-[10px] uppercase tracking-[0.2em]">{user.firstName} {user.lastName}</p>
                  <span className={`px-2 py-0.5 text-[9px] font-medium rounded-full border shadow-sm ${
                    user.active 
                      ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-100 border-rose-500/30'
                  }`}>
                    {user.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  const params = new URLSearchParams({ page: returnPage });
                  if (search) params.set('search', search);
                  navigate(`/vp/agent?${params.toString()}`);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all flex items-center text-[10px] font-medium uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 active:scale-95"
              >
                Back to List
              </button>

              <button 
                onClick={() => {
                  const params = new URLSearchParams({ returnPage });
                  if (search) params.set('search', search);
                  navigate(`/vp/agent/edit/${id}?${params.toString()}`);
                }}
                className="px-4 py-2 bg-white text-[#1B3C53] rounded-xl font-medium text-[10px] transition-all shadow-xl flex items-center uppercase tracking-widest hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0 hover:scale-105 active:scale-95"
              >
                Edit Agent
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-[#1B3C53]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h2 className="text-base font-bold text-slate-900">
                  Personal Information
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem
                  label="Full Name"
                  value={`${user.firstName} ${user.middleName} ${user.lastName}`.trim()}
                />
                <DetailItem label="Email" value={user.email} />
                <DetailItem label="Username" value={user.username} />
                <DetailItem label="Role" value={user.role} />
                <DetailItem label="Agency" value={user.agency || "-"} />
                <DetailItem label="Branch Code" value={user.branchCode || "-"} />
              </div>
              
              {/* Phone Numbers Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-700 ml-1">Phone Numbers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(userData?.data || userData)?.phones && (userData?.data || userData).phones.length > 0 ? (
                    (userData?.data || userData).phones.map((phone, index) => (
                      <DetailItem 
                        key={index} 
                        label={index === 0 ? "Phone Number" : "Alternative Number"} 
                        value={phone.phone_number} 
                      />
                    ))
                  ) : (
                    <DetailItem label="Phone Number" value="-" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address & Location */}
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h2 className="text-base font-bold text-slate-900">
                  Address & Location
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* All Addresses Section */}
              <div className="space-y-4">
                {(userData?.data || userData)?.addresses && (userData?.data || userData).addresses.length > 0 ? (
                  (userData?.data || userData).addresses.map((address, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-700 ml-1">
                        {address.addressType || 'Address'} Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem label="Country" value={address.country || '-'} />
                        <DetailItem label="Address Type" value={address.addressType || '-'} />
                        <div className="md:col-span-2">
                          <DetailItem label="Address" value={address.address || '-'} />
                        </div>
                      </div>
                      {index < (userData?.data || userData).addresses.length - 1 && (
                        <div className="mt-6 h-px bg-slate-100"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailItem label="Country" value="-" />
                    <DetailItem label="Address Type" value="-" />
                    <div className="md:col-span-2">
                      <DetailItem label="Address" value="-" />
                    </div>
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
  <div className="space-y-1 group transition-all">
    <label className="text-sm font-medium text-slate-700 ml-1">{label}</label>
    <div className="text-[13px] font-medium text-slate-900 bg-white border border-slate-300 px-4 py-2.5 rounded-xl group-hover:text-[#1B3C53] group-hover:border-slate-400 transition-all break-words">
      {value || <span className="text-slate-200">Not Disclosed</span>}
    </div>
  </div>
);

export default VPAgentDetails;
