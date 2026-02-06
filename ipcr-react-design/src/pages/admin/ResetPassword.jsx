import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
    forceChange: true,
    notifyUser: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (!formData.otp) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setOtpVerified(true);
    }, 1000);
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
    if (!otpVerified) {
      handleVerifyOtp();
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(`/admin/user/view/${username}`);
      }, 2000);
    }, 1000);
  };

  return (
    <div className={`max-w-xl mx-auto space-y-6 pb-12 relative transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in duration-500'}`}>
      
      {showSuccess && (
        <div className={`fixed top-6 right-6 z-[60] ${isClosing ? 'opacity-0 scale-95 transition-all duration-300' : 'animate-fadeIn'}`}>
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center border border-slate-100 min-w-[320px]">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-slate-900">Credential Synchronization Complete</p>
              <p className="text-xs text-slate-500 font-medium">Password has been reset successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden relative text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="p-8 relative">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-all active:scale-90 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div className="inline-flex p-4 bg-[#1B3C53]/5 rounded-2xl mb-4 text-[#1B3C53]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-slate-900 tracking-tight">Reset User Password</h1>
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] mt-2">Security Protocol for <span className="text-[#1B3C53]">{username}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-6">
            {/* OTP Section */}
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isVerifying}
                    className="text-[9px] font-medium text-[#1B3C53] hover:text-[#1B3C53]/80 uppercase tracking-widest"
                  >
                    {isVerifying ? 'Sending...' : 'Send OTP'}
                  </button>
                ) : (
                  <span className="text-[9px] font-medium text-emerald-600 uppercase tracking-widest flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    Code Relayed
                  </span>
                )}
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  name="otp"
                  required
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit verification code"
                  className="w-full pl-11 pr-24 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying || formData.otp.length < 6 || otpVerified}
                    className={`px-4 py-1.5 rounded-lg font-medium text-[10px] uppercase tracking-widest transition-all ${
                      otpVerified 
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#1B3C53] text-white hover:scale-105 active:scale-95 disabled:opacity-30'
                    }`}
                  >
                    {otpVerified ? 'Verified' : 'Verify'}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className={`space-y-4 transition-all duration-500 ${otpVerified ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none'}`}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">New System Password</label>
                <div className="relative group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new strong password"
                    className="w-full pl-11 pr-12 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#1B3C53] transition-colors"
                  >
                    {showNewPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.017 10.017 0 012.49-3.511m12.158 1.108A10.062 10.062 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7-1.447 0-2.813-.379-4-1.037m0 0L4.636 19.364m2.828-2.828l1.414-1.414m0 0L8 12a4 4 0 014-4h.828m2.828 2.828l1.414-1.414m-1.414 1.414L19.364 4.636" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">Confirm System Password</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Verify new password"
                    className="w-full pl-11 pr-12 py-3 bg-white border border-slate-100 rounded-xl text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A9 9 0 1121 12c0-.47-.033-.933-.098-1.388a3.376 3.376 0 00-3.897-2.617z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <label className="flex items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 cursor-pointer hover:border-[#1B3C53]/20 transition-all group">
              <input
                type="checkbox"
                name="forceChange"
                checked={formData.forceChange}
                onChange={handleChange}
                className="w-4 h-4 text-[#1B3C53] border-slate-300 rounded focus:ring-[#1B3C53]"
              />
              <div className="ml-4">
                <p className="text-[11px] font-medium text-slate-700 uppercase tracking-wider">Force Sequential Update</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mt-0.5">Mandatory password rotation on next entry</p>
              </div>
            </label>

            <label className="flex items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 cursor-pointer hover:border-[#1B3C53]/20 transition-all group">
              <input
                type="checkbox"
                name="notifyUser"
                checked={formData.notifyUser}
                onChange={handleChange}
                className="w-4 h-4 text-[#1B3C53] border-slate-300 rounded focus:ring-[#1B3C53]"
              />
              <div className="ml-4">
                <p className="text-[11px] font-medium text-slate-700 uppercase tracking-wider">Dispatch Relay Notification</p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mt-0.5">Notify user of credential reconfiguration</p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving || !otpVerified}
            className="w-full px-6 py-4 bg-[#1B3C53] text-white rounded-xl font-medium text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Synchronizing...
              </>
            ) : 'Commit Credential Change'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
