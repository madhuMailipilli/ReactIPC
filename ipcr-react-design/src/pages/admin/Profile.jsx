import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    country: "",
    address: "",
    role: ""
  });

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || nameParts[0] || "",
        lastName: user.lastName || nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        username: user.username || user.email?.split('@')[0] || "",
        phone: user.phone || "",
        role: user.user_role || user.role || "User",
        address: user.address || "",
        country: user.country || ""
      }));
    }
  }, [user]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseToast = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsClosing(false);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        if (!showSuccess) return;
        handleCloseToast();
      }, 3000);
    }, 1000);
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-6 pb-6 relative transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in duration-500'}`}>
      
      {showSuccess && (
        <div className={`fixed top-6 right-6 z-[60] ${isClosing ? 'opacity-0 scale-95 transition-all duration-300' : 'animate-fadeIn'}`}>
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center border border-slate-100 min-w-[320px]">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-normal text-sm text-slate-900">Profile Updated Successfully</p>
              <p className="text-xs text-slate-500 font-normal">Changes have been synchronized.</p>
            </div>
            <button 
              onClick={handleCloseToast}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Profile Header */}
      <div className="bg-gradient-to-br from-[#1B3C53] to-[#2d5573] rounded-2xl shadow-[0_20px_50px_rgba(27,60,83,0.15)] border border-[#1B3C53]/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="p-8 relative">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center text-[#1B3C53] text-2xl font-bold shadow-lg ring-4 ring-white/20 group-hover:ring-white/40 transition-all">
                  {formData.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/10 pointer-events-none"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium uppercase tracking-wider rounded-lg border border-white/20">
                    {formData.role}
                  </span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-xs text-white/80 font-medium">Active</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
                  {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-white/70 text-sm">@{formData.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:ml-auto">
              <button 
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-xs font-medium rounded-xl transition-all uppercase tracking-widest border border-white/20"
              >
                Back
              </button>
              <button 
                type="submit"
                form="profile-form"
                disabled={isSaving}
                className="px-6 py-2.5 bg-white text-[#1B3C53] text-xs font-medium rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2 uppercase tracking-widest"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form id="profile-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <Input 
                label="First Name" 
                value={formData.firstName}
                onChange={(val) => handleInputChange('firstName', val)}
                placeholder="Enter first name"
              />
              <Input 
                label="Last Name" 
                value={formData.lastName}
                onChange={(val) => handleInputChange('lastName', val)}
                placeholder="Enter last name"
              />
              <Input 
                label="Username" 
                value={formData.username}
                onChange={(val) => handleInputChange('username', val)}
                placeholder="Enter username"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-base font-bold text-slate-900">Contact Details</h2>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <div className="md:col-span-2">
                <Input 
                  label="Email Address" 
                  type="email"
                  value={formData.email}
                  onChange={(val) => handleInputChange('email', val)}
                  placeholder="your.email@example.com"
                />
              </div>
              <Input 
                label="Phone Number" 
                value={formData.phone}
                onChange={(val) => handleInputChange('phone', val)}
                placeholder="+1 (555) 000-0000"
              />
              <Input 
                label="Country" 
                value={formData.country}
                onChange={(val) => handleInputChange('country', val)}
                placeholder="Enter country"
              />
            </div>
          </div>

          {/* Address & Location */}
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-base font-bold text-slate-900">Address & Location</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-slate-700 ml-1">Address</label>
                <textarea 
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows="3"
                  placeholder="Street address, city, state, and zip code"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-slate-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-base font-bold text-slate-900">Profile Summary</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Full Name</p>
                    <p className="text-sm font-semibold text-slate-900">{formData.firstName} {formData.lastName || '...'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email</p>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">{formData.email || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Role</p>
                    <p className="text-sm font-semibold text-slate-900">{formData.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-slate-900">{formData.phone || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2 group">
    <label className="text-sm font-medium text-slate-700 ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-slate-400"
    />
  </div>
);

export default Profile;
