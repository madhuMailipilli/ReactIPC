import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useUser, useUpdateUser } from "../../hooks/useUsers";
import logo from "../../assets/logo.png";

const VPEditAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get('returnPage') || '1';
  const search = searchParams.get('search') || '';
  const { data: userData, isLoading: loading, error: fetchError } = useUser(id);
  const updateUserMutation = useUpdateUser();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phones: [""],
    addresses: [
      { address: "", country: "", addressType: "Permanent" },
      { address: "", country: "", addressType: "Communication" }
    ],
    role: "",
    agency: "",
    branchCode: "",
    username: "",
    active: true
  });

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      let roleNames = 'Agent';
      if (user.roles && user.roles.length > 0) {
        roleNames = user.roles.map(role => role.code).join(', ');
      }
      
      const primaryAgency = user.agencies && user.agencies.length > 0 ? user.agencies[0] : {};
      
      setFormData({
        firstName: user.first_name || '',
        middleName: user.middle_name || '',
        lastName: user.last_name || '',
        email: user.email,
        phones: user.phones && user.phones.length > 0 
          ? user.phones.map(p => p.phone_number) 
          : [""],
        addresses: user.addresses && user.addresses.length > 0
          ? user.addresses
          : [{ address: "", country: "", addressType: "Permanent" }, { address: "", country: "", addressType: "Communication" }],
        role: roleNames,
        agency: primaryAgency.agency_name || '',
        branchCode: primaryAgency.branch_code || '',
        username: user.username,
        active: user.is_active
      });
    } else if (userData) {
      // Fallback: check if data is directly in userData
      let roleNames = 'Agent';
      if (userData.roles && userData.roles.length > 0) {
        roleNames = userData.roles.map(role => role.code).join(', ');
      }
      
      const primaryAgency = userData.agencies && userData.agencies.length > 0 ? userData.agencies[0] : {};
      
      setFormData({
        firstName: userData.first_name || '',
        middleName: userData.middle_name || '',
        lastName: userData.last_name || '',
        email: userData.email,
        phones: userData.phones && userData.phones.length > 0 
          ? userData.phones.map(p => p.phone_number) 
          : [""],
        addresses: userData.addresses && userData.addresses.length > 0
          ? userData.addresses
          : [{ address: "", country: "", addressType: "Permanent" }, { address: "", country: "", addressType: "Communication" }],
        role: roleNames,
        agency: primaryAgency.agency_name || '',
        branchCode: primaryAgency.branch_code || '',
        username: userData.username,
        active: userData.is_active
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handlePhoneChange = (index, value) => {
    if (value.length > 16) return;
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => i === index ? value : phone)
    }));
  };

  const addPhone = () => {
    setFormData(prev => ({ ...prev, phones: [...prev.phones, ""] }));
  };

  const removePhone = (index) => {
    if (formData.phones.length > 1) {
      setFormData(prev => ({
        ...prev,
        phones: prev.phones.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAddressChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) =>
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const copyPermanentToComm = () => {
    const permanentAddr = formData.addresses.find(addr => addr.addressType === "Permanent");
    if (permanentAddr) {
      const commIndex = formData.addresses.findIndex(addr => addr.addressType === "Communication");
      if (commIndex !== -1) {
        setFormData(prev => ({
          ...prev,
          addresses: prev.addresses.map((addr, i) =>
            i === commIndex ? { ...permanentAddr, addressType: "Communication" } : addr
          )
        }));
      }
    }
  };

  const handleCloseToast = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowError(false);
      setIsClosing(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      email: formData.email,
      username: formData.username,
      is_active: Boolean(formData.active),
      profile: {}
    };
    
    // Only include profile fields that have values
    if (formData.firstName) updateData.profile.first_name = formData.firstName;
    if (formData.middleName) updateData.profile.middle_name = formData.middleName;
    if (formData.lastName) updateData.profile.last_name = formData.lastName;
    
    // Handle phones update
    if (formData.phones && formData.phones.length > 0) {
      const currentUserData = userData?.data || userData;
      updateData.phones = formData.phones
        .filter(phone => phone.trim())
        .map((phone, index) => {
          const existingPhone = currentUserData?.phones?.[index];
          return {
            ...(existingPhone?.id && { id: existingPhone.id }),
            phone_number: phone
          };
        });
    }
    
    // Handle addresses update
    if (formData.addresses && formData.addresses.length > 0) {
      const currentUserData = userData?.data || userData;
      updateData.addresses = formData.addresses
        .filter(addr => addr.address || addr.country)
        .map((addr, index) => {
          const existingAddr = currentUserData?.addresses?.[index];
          return {
            ...(existingAddr?.id && { id: existingAddr.id }),
            address: addr.address || '',
            country: addr.country || '',
            addressType: addr.addressType || 'Permanent'
          };
        });
    }

    updateUserMutation.mutate(
      { id, data: updateData },
      {
        onSuccess: (response) => {
          setShowSuccess(true);
          setTimeout(() => {
            const params = new URLSearchParams({ page: returnPage });
            if (search) params.set('search', search);
            navigate(`/vp/agent?${params.toString()}`);
          }, 2000);
        },
        onError: (error) => {
          console.error("Error updating agent:", error);
          const backendMessage = error.response?.data?.message || error.message || 'Failed to update agent. Please try again.';
          setErrorMessage(backendMessage);
          setShowError(true);
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative w-16 h-16">
          <img src={logo} alt="IPC Logo" className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <svg className="w-16 h-16 animate-spin" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1B3C53" strokeWidth="8" strokeDasharray="220" strokeDashoffset="60" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
          
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px white inset !important;
            -webkit-text-fill-color: #0f172a !important;
          }
        `}
      </style>

      {/* Success Notification */}
      {showSuccess && (
        <div
          className={`fixed top-6 right-6 z-[60] ${
            isClosing
              ? "opacity-0 scale-95 transition-all duration-300"
              : "animate-fadeIn"
          }`}
        >
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center border border-slate-100 min-w-[320px]">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-normal text-sm text-slate-900">
                Profile Updated
              </p>
              <p className="text-xs text-slate-500 font-normal">
                Agent changes saved successfully.
              </p>
            </div>
            <button
              onClick={handleCloseToast}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {showError && (
        <div className={`fixed top-4 right-6 z-[60] ${isClosing ? 'opacity-0 scale-95 transition-all duration-300' : 'animate-fadeIn'}`}>
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-start border border-rose-100 min-w-[320px] max-w-md">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-normal text-sm text-slate-900">Error Updating Agent</p>
              <p className="text-xs text-slate-500 font-normal leading-relaxed break-words">{errorMessage}</p>
            </div>
            <button 
              onClick={handleCloseToast}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 ml-2 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-all active:scale-90 group"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Edit Agent Profile
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-xl transition-all uppercase tracking-widest border border-slate-200 hover:border-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-agent-form"
                disabled={updateUserMutation.isPending}
                className="px-6 py-2.5 bg-[#1B3C53] text-white text-[11px] font-medium rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2.5 uppercase tracking-widest"
              >
                {updateUserMutation.isPending ? (
                  <>
                    <svg
                      className="animate-spin h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form
        id="edit-agent-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                />
                <Input
                  label="Middle Name"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Middle name"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@enterprise.com"
                  />
                </div>
                <Input
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h2 className="text-base font-bold text-slate-900">Phone Numbers</h2>
              </div>
              <button
                type="button"
                onClick={addPhone}
                className="px-3 py-1.5 bg-[#1B3C53]/5 text-[#1B3C53] text-[9px] font-medium uppercase tracking-widest rounded-lg hover:bg-[#1B3C53]/10 transition-all"
              >
                + Add Phone
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.phones.map((phone, index) => (
                  <div key={index} className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        label={index === 0 ? "Phone Number" : "Alternative Number"}
                        name={`phone-${index}`}
                        value={phone}
                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="w-10 flex justify-center">
                      {formData.phones.length > 1 && index > 0 && (
                        <button
                          type="button"
                          onClick={() => removePhone(index)}
                          className="mb-1.5 p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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
            <div className="p-6 space-y-8">
              {formData.addresses.map((addr, index) => (
                <div
                  key={index}
                  className="relative group/address animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-slate-50 group-hover/address:bg-[#1B3C53]/10 transition-colors rounded-full"></div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-700">
                      {addr.addressType} Address
                    </span>
                    {index === 1 && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          onChange={(e) => e.target.checked && copyPermanentToComm()}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600">Same as permanent address</span>
                      </label>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <Input
                      label="Address Type"
                      name={`addressType-${index}`}
                      value={addr.addressType}
                      onChange={(e) => handleAddressChange(index, 'addressType', e.target.value)}
                      readOnly
                      placeholder={addr.addressType}
                    />
                    <Input
                      label="Country"
                      name={`country-${index}`}
                      value={addr.country}
                      onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                      placeholder="Enter country"
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        name={`address-${index}`}
                        type="textarea"
                        value={addr.address}
                        onChange={(e) => handleAddressChange(index, 'address', e.target.value)}
                        placeholder="Enter full address"
                      />
                    </div>
                  </div>
                  {index < formData.addresses.length - 1 && (
                    <div className="mt-8 h-px bg-slate-100"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Details & Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 12l2 2 4-4m5.618-4.016A9 9 0 1121 12c0-.47-.033-.933-.098-1.388a3.376 3.376 0 00-3.897-2.617z"
                  />
                </svg>
                <h2 className="text-base font-bold text-slate-900">
                  Account Status
                </h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 ml-1">
                  Role
                </label>
                <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-[13px] font-medium text-slate-500 cursor-not-allowed">
                  {formData.role}
                </div>
              </div>

              <div className="h-px bg-slate-50"></div>

              <div className="flex items-center justify-between p-4 bg-white border border-slate-300 rounded-2xl hover:border-slate-400 transition-all">
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-0.5">
                    Status
                  </div>
                  <div className="text-[13px] font-medium text-slate-900">
                    {formData.active ? "Active" : "Inactive"}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B3C53]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false
}) => (
  <div className="space-y-1.5 group">
    <label className="text-sm font-medium text-slate-700 ml-1">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        rows="3"
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-blue-300 hover:shadow-md resize-none ${
          readOnly ? 'border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed' : 'border-slate-300'
        }`}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-blue-300 hover:shadow-md ${
          readOnly ? 'border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed' : 'border-slate-300'
        }`}
      />
    )}
  </div>
);

export default VPEditAgent;