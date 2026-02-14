import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAgency } from "../../hooks/useAgencies";
import CustomSelect from "../../components/CustomSelect";

const AddAgency = () => {
  const navigate = useNavigate();
  const createAgencyMutation = useCreateAgency();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    agencyName: '',
    branchCode: '',
    email: '',
    country: '',
    phone: '',
    alternatePhone: '',
    address1: '',
    address2: '',
    pincode: '',
    state: '',
    city: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setShowError(false);
          setIsClosing(false);
        }, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleClearForm = () => {
    setFormData({
      agencyName: '',
      branchCode: '',
      email: '',
      country: '',
      phone: '',
      alternatePhone: '',
      address1: '',
      address2: '',
      pincode: '',
      state: '',
      city: ''
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    if (['phone', 'alternatePhone', 'pincode', 'documentLimit', 'term'].includes(field)) {
      value = value.replace(/[^0-9]/g, '');
    }
    
    if (field === 'agencyName' && value.length > 100) {
      value = value.slice(0, 100);
    }
    if (['phone', 'alternatePhone'].includes(field) && value.length > 16) {
      value = value.slice(0, 16);
    }
    if (field === 'pincode' && value.length > 10) {
      value = value.slice(0, 10);
    }
    if (['state', 'city'].includes(field) && value.length > 100) {
      value = value.slice(0, 100);
    }
    if (field === 'documentLimit' && value.length > 10) {
      value = value.slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email) => {
    return email.includes('@');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.agencyName.trim()) {
      newErrors.agencyName = 'Agency name is required';
    }
    if (!formData.branchCode.trim()) {
      newErrors.branchCode = 'Branch code is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must contain @';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.address1.trim()) {
      newErrors.address1 = 'Address line 1 is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Postal code is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Format data according to API structure
      const payload = {
        agency_name: formData.agencyName,
        branch_code: formData.branchCode,
        email_address: formData.email,
        phone_number: formData.phone,
        alternate_phone: formData.alternatePhone,
        address_line_1: formData.address1,
        address_line_2: formData.address2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.pincode
      };
      
      console.log('Agency data to send:', payload);
      
      createAgencyMutation.mutate(payload, {
        onSuccess: () => {
          setShowSuccess(true);
          
          setTimeout(() => {
            setIsClosing(true);
            setTimeout(() => {
              navigate('/admin/agency');
            }, 300);
          }, 1500);
        },
        onError: (error) => {
          console.error('Full error object:', error);
          
          let errorMessage = 'Failed to create agency. Please try again.';
          if (typeof error === 'string') {
            errorMessage = error;
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (typeof error === 'object') {
            errorMessage = JSON.stringify(error);
          }
          
          setErrorMessage(errorMessage);
          setShowError(true);
        }
      });
    }
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-6 relative transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in duration-500'}`}>
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #f8fafc inset !important;
            -webkit-text-fill-color: #0f172a !important;
            background-color: #f8fafc !important;
          }
          select:-webkit-autofill,
          select:-webkit-autofill:hover,
          select:-webkit-autofill:focus,
          select:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #f8fafc inset !important;
            -webkit-text-fill-color: #0f172a !important;
            background-color: #f8fafc !important;
          }
          select {
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            -ms-appearance: none !important;
            appearance: none !important;
            background-image: none !important;
            background-color: #f8fafc !important;
          }
          select:focus {
            outline: none !important;
            border-color: #64748b !important;
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            -moz-box-shadow: none !important;
          }
          select:focus-visible {
            outline: none !important;
            border-color: #64748b !important;
            box-shadow: none !important;
          }
          *:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          select::-moz-focus-inner {
            border: 0 !important;
            outline: none !important;
          }
          select option {
            background-color: white !important;
            color: #0f172a !important;
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
              <p className="font-normal text-sm text-slate-900">Agency has been successfully created</p>
            </div>
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
              <p className="font-normal text-sm text-slate-900">Error Creating Agency</p>
              <p className="text-xs text-slate-500 font-normal leading-relaxed break-words">{errorMessage}</p>
            </div>
            <button 
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  setShowError(false);
                  setIsClosing(false);
                }, 300);
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 ml-2 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="p-6 relative">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate('/admin/agency')}
              className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 transition-all active:scale-90 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Agency</h1>
            </div>
          </div>
        </div>
      </div>

      <form id="add-agency-form" onSubmit={handleSubmit} className="mt-2">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 transition-all hover:shadow-md">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v8" />
                </svg>
                <h2 className="text-base font-bold text-slate-900">Agency Identity</h2>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input 
                label="Agency Name" 
                required
                value={formData.agencyName}
                onChange={(value) => handleInputChange('agencyName', value)}
                error={errors.agencyName}
                placeholder="Enter agency name"
              />
              <Input 
                label="Branch Code" 
                required
                value={formData.branchCode}
                onChange={(value) => handleInputChange('branchCode', value)}
                error={errors.branchCode}
                placeholder="Enter branch code"
              />
              <Input 
                label="Email Address" 
                required
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                error={errors.email}
                placeholder="Enter email address"
              />
              <CustomSelect 
                label="Country" 
                required
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                error={errors.country}
                options={[
                  { value: "India", label: "India" },
                  { value: "USA", label: "United States" },
                  { value: "UK", label: "United Kingdom" },
                  { value: "Canada", label: "Canada" },
                  { value: "Australia", label: "Australia" },
                ]}
                hideSelectOption
                enableAlphabeticSearch={true}
              />
              <Input 
                label="Phone Number" 
                required
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', value)}
                error={errors.phone}
                placeholder="Enter phone number"
              />
              <Input 
                label="Alternate Phone" 
                value={formData.alternatePhone}
                onChange={(value) => handleInputChange('alternatePhone', value)}
                placeholder="Enter alternate phone"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 transition-all hover:shadow-md">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-base font-bold text-slate-900">Location Details</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <Input 
                    label="Address Line 1" 
                    required
                    value={formData.address1}
                    onChange={(value) => handleInputChange('address1', value)}
                    error={errors.address1}
                    placeholder="Enter address"
                  />
                </div>
                <Input 
                  label="Address Line 2" 
                  value={formData.address2}
                  onChange={(value) => handleInputChange('address2', value)}
                  placeholder="Enter address line 2"
                />
                <Input 
                  label="City" 
                  required
                  value={formData.city}
                  onChange={(value) => handleInputChange('city', value)}
                  error={errors.city}
                  placeholder="Enter city"
                />
                <Input 
                  label="State" 
                  required
                  value={formData.state}
                  onChange={(value) => handleInputChange('state', value)}
                  error={errors.state}
                  placeholder="Enter state"
                />
                <Input 
                  label="Postal Code" 
                  required
                  value={formData.pincode}
                  onChange={(value) => handleInputChange('pincode', value)}
                  error={errors.pincode}
                  placeholder="Enter postal code"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={handleClearForm}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-all border border-slate-300 hover:border-slate-400"
                >
                  Cancel
                </button>

                <button 
                  type="submit"
                  disabled={createAgencyMutation.isPending}
                  className="px-8 py-3 bg-[#1B3C53] text-white text-sm font-medium rounded-xl hover:bg-[#152e42] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createAgencyMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing
                    </>
                  ) : 'Create Agency'}
                </button>
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
  value,
  onChange,
  error,
  type = "text",
  required = false,
  placeholder = "",
}) => (
  <div className="space-y-1.5 group">
    <label className="text-sm font-medium text-slate-700 ml-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 bg-white border rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-blue-300 hover:shadow-md ${
        error ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-300'
      }`}
    />
    {error && (
      <p className="text-[9px] font-medium text-red-500 flex items-center mt-1 ml-1 uppercase tracking-widest">
        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

export default AddAgency;
