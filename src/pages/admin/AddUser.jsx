import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../hooks/useUsers";
import { useAgencies } from "../../hooks/useAgencies";
import CustomSelect from "../../components/CustomSelect";

const AddUser = () => {
  const navigate = useNavigate();
  const { data: agencies = [] } = useAgencies(false);
  const createUserMutation = useCreateUser();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    userRole: "",
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    password: "",
    agencyName: "",
    country: "",
    phones: [""],
    addresses: [
      { address: "", country: "", addressType: "Permanent" },
      { address: "", country: "", addressType: "Communication" }
    ],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        handleCloseToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhoneChange = (index, value) => {
    // Limit phone number to 16 characters
    if (value.length > 16) return;
    
    setFormData(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) =>
        i === index ? value : phone
      )
    }));
  };

  const addPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, ""]
    }));
  };

  const removePhone = (index) => {
    if (formData.phones.length > 1) {
      setFormData(prev => ({
        ...prev,
        phones: prev.phones.filter((_, i) => i !== index)
      }));
    }
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

  const handleAddressChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr, i) =>
        i === index ? { ...addr, [field]: value } : addr,
      ),
    }));
  };

  const addAddress = () => {
    if (formData.addresses.length < 2) {
      const nextType = formData.addresses[0]?.addressType === "Permanent" ? "Communication" : "Permanent";
      setFormData((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses,
          { address: "", country: "", addressType: nextType },
        ],
      }));
    }
  };

  const removeAddress = (index) => {
    if (formData.addresses.length > 1) {
      setFormData((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.phones[0]?.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.agencyName.trim()) {
      newErrors.agencyName = "Agency is required";
    }
    if (!formData.userRole) {
      newErrors.userRole = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClearForm = () => {
    setFormData({
      userRole: "",
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      password: "",
      agencyName: "",
      country: "",
      phones: [""],
      addresses: [
        { address: "", country: "", addressType: "Permanent" },
        { address: "", country: "", addressType: "Communication" }
      ],
    });
    setErrors({});
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
    if (!validateForm()) {
      return;
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      agencyId: formData.agencyName,
      roles: [parseInt(formData.userRole)],
      phones: formData.phones.filter(phone => phone.trim()),
      addresses: formData.addresses,
      profile: {
        first_name: formData.firstName,
        last_name: formData.lastName,
      },
    };

    // Only add middle_name if it has actual content
    const trimmedMiddleName = formData.middleName?.trim();
    if (trimmedMiddleName && trimmedMiddleName.length > 0) {
      userData.profile.middle_name = trimmedMiddleName;
    }

    createUserMutation.mutate(userData, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/admin/user");
        }, 2000);
      },
      onError: (error) => {
        console.error('Error creating user:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to create user. Please try again.';
        setErrorMessage(errorMsg);
        setShowError(true);
      }
    });
  };

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
        <div className={`fixed top-4 right-6 z-[60] ${isClosing ? 'opacity-0 scale-95 transition-all duration-300' : 'animate-fadeIn'}`}>
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center border border-slate-100 min-w-[320px]">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-normal text-sm text-slate-900">User Created Successfully</p>
  
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
              <p className="font-normal text-sm text-slate-900">Error Creating User</p>
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
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate("/admin/user")}
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
                  Add New User
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClearForm}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-xl transition-all uppercase tracking-widest border border-slate-200 hover:border-slate-300"
              >
                Clear Form
              </button>
              <button
                type="submit"
                form="add-user-form"
                disabled={createUserMutation.isPending}
                className="px-6 py-2.5 bg-[#1B3C53] text-white text-[11px] font-medium rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2.5 uppercase tracking-widest"
              >
                {createUserMutation.isPending ? (
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
                    Processing
                  </>
                ) : (
                  "Create User"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form
        id="add-user-form"
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
                  required
                  value={formData.firstName}
                  onChange={(value) => handleInputChange("firstName", value)}
                  error={errors.firstName}
                  placeholder="Enter first name"
                />
                <Input
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={(value) => handleInputChange("middleName", value)}
                  error={errors.middleName}
                  placeholder="Enter middle name"
                />
                <Input
                  label="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(value) => handleInputChange("lastName", value)}
                  error={errors.lastName}
                  placeholder="Enter last name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <Input
                    label="Email Address"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange("email", value)}
                    error={errors.email}
                    placeholder="Enter email address"
                    autoComplete="off"
                  />
                </div>
                <Input
                  label="Username"
                  required
                  value={formData.username}
                  onChange={(value) => handleInputChange("username", value)}
                  error={errors.username}
                  placeholder="Enter username"
                  autoComplete="off"
                />
                <Input
                  label="Password"
                  required
                  type="password"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  error={errors.password}
                  placeholder="Enter password"
                  autoComplete="new-password"
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
                        required={index === 0}
                        value={phone}
                        onChange={(value) => handlePhoneChange(index, value)}
                        error={index === 0 ? errors.phone : ""}
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

          {/* Location Details */}
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                      value={addr.addressType}
                      disabled
                      placeholder={addr.addressType}
                    />
                    <Input
                      label="Country"
                      value={addr.country}
                      onChange={(value) =>
                        handleAddressChange(index, "country", value)
                      }
                      placeholder="Enter country"
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        value={addr.address}
                        onChange={(value) =>
                          handleAddressChange(index, "address", value)
                        }
                        placeholder="Enter full address"
                        type="textarea"
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

        {/* Sidebar: Role & Agency */}
        <div className="space-y-6 overflow-visible">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 sticky top-6">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v8"
                  />
                </svg>
                <h2 className="text-base font-bold text-slate-900">
                  Role & Agency
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-visible">
              <div className="relative z-[60]">
                <SelectWrapper
                  label="Role"
                  required
                  value={formData.userRole}
                  onChange={(value) => handleInputChange("userRole", value)}
                  error={errors.userRole}
                  options={[
                    { value: "2", label: "Vice President" },
                    { value: "3", label: "Agent" },
                  ]}
                  hideSelectOption
                />
              </div>

              <div className="relative z-50">
                <SelectWrapper
                  label="Agency"
                  required
                  value={formData.agencyName}
                  onChange={(value) => handleInputChange("agencyName", value)}
                  error={errors.agencyName}
                  options={agencies.map((agency) => ({
                    value: agency.id || agency.agency_id,
                    label: agency.agency_name,
                  }))}
                  hideSelectOption
                  enableAlphabeticSearch={true}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

/* ---- Reusable Components ---- */

const Input = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  required = false,
  placeholder = "",
  autoComplete,
  disabled = false,
}) => (
  <div className="space-y-1.5 group">
    <label className="text-sm font-medium text-slate-700 ml-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows="3"
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-blue-300 hover:shadow-md resize-none ${
          error ? "border-rose-200 ring-4 ring-rose-50" : "border-slate-300"
        } ${disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-blue-300 hover:shadow-md ${
          error ? "border-rose-200 ring-4 ring-rose-50" : "border-slate-300"
        } ${disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : ""}`}
      />
    )}
    {error && (
      <p className="text-[9px] font-medium text-rose-500 flex items-center ml-1 uppercase tracking-widest">
        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

const SelectWrapper = ({
  label,
  value,
  onChange,
  error,
  required = false,
  options = [],
  hideSelectOption = false,
  enableAlphabeticSearch = false,
}) => (
  <CustomSelect
    label={label}
    value={value}
    onChange={onChange}
    options={options}
    error={error}
    required={required}
    hideSelectOption={hideSelectOption}
    enableAlphabeticSearch={enableAlphabeticSearch}
  />
);

export default AddUser;