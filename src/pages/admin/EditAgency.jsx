import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAgency, useUpdateAgency } from "../../hooks/useAgencies";
import CustomSelect from "../../components/CustomSelect";
import logo from "../../assets/logo.png";

const EditAgency = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const returnPage = searchParams.get('returnPage') || '1';
  const { data: agencyData, isLoading: loading, error: fetchError } = useAgency(id, true);
  const updateAgencyMutation = useUpdateAgency();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: "",
    branchCode: "",
    email: "",
    country: "",
    phone: "",
    alternatePhone: "",
    address1: "",
    address2: "",
    pincode: "",
    state: "",
    city: "",
    documentLimit: "",
    startDate: "",
    endDate: "",
    term: "",
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

  useEffect(() => {
    if (agencyData) {
      const data = agencyData.data || agencyData.agency || agencyData;
      setFormData({
        agencyName: data.agency_name || "",
        branchCode: data.branch_code || "",
        email: data.email_address || data.email || "",
        country: data.country || "",
        phone: data.phone_number || data.phone || "",
        alternatePhone: data.alternate_phone || "",
        address1: data.address_line_1 || data.address1 || "",
        address2: data.address_line_2 || data.address2 || "",
        pincode: data.postal_code || data.pincode || "",
        state: data.state || "",
        city: data.city || "",
        documentLimit: data.document_limit || "",
        startDate: data.start_date ? data.start_date.split("T")[0] : "",
        endDate: data.end_date ? data.end_date.split("T")[0] : "",
        term: data.term || "",
      });
    }
  }, [agencyData]);

  const handleInputChange = (field, value) => {
    if (
      ["phone", "alternatePhone", "pincode", "documentLimit", "term"].includes(
        field,
      )
    ) {
      value = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateEmail = (email) => {
    return email.includes("@");
  };

  const handleCloseToast = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowError(false);
      setIsClosing(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.agencyName.trim()) {
      newErrors.agencyName = "Agency name is required";
    }
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email must contain @";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = agencyData.data || agencyData.agency || agencyData;
      const payload = {
        ...data,
        address_id: data?.address_id || data?.address?.id,
        contact_id: data?.contact_id || data?.contact?.id,
        location_id: data?.location_id || data?.location?.id,

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
        postal_code: formData.pincode,
        document_limit: formData.documentLimit,
        term: formData.term,
        start_date: formData.startDate,
        end_date: formData.endDate,
      };

      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined),
      );

      updateAgencyMutation.mutate(
        { id, data: cleanedPayload },
        {
          onSuccess: () => {
            navigate(`/admin/agency?page=${returnPage}`, {
              replace: true,
              state: { successMessage: "Agency updated successfully" },
            });
          },
          onError: (error) => {
            console.error("Failed to update agency:", error);
            setErrorMessage(
              error.message || "Failed to update agency. Please try again.",
            );
            setShowError(true);
          }
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <img src={logo} alt="IPC Logo" className="w-10 h-10 object-contain z-10" />
          <svg className="absolute inset-0 w-16 h-16 animate-spin" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1B3C53" strokeWidth="4" strokeDasharray="70 200" strokeLinecap="round" />
          </svg>
        </div>
        <span className="mt-4 text-sm font-medium text-slate-600">Loading...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-2xl border border-slate-100 shadow-xl text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-slate-900 mb-2">
          Operation Failed
        </h3>
        <p className="text-slate-500 text-sm mb-8">{fetchError.message}</p>
        <button
          onClick={() => navigate("/admin/agency")}
          className="px-8 py-3 bg-[#1B3C53] text-white rounded-xl font-medium text-[11px] uppercase tracking-widest hover:scale-105 transition-all"
        >
          Return to Console
        </button>
      </div>
    );
  }

  return (
    <div
      className={`max-w-6xl mx-auto space-y-6 pb-12 relative transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100 animate-in fade-in duration-500"}`}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        `}
      </style>

      {/* Error Notification */}
      {showError && (
        <div
          className={`fixed top-4 right-6 z-[60] ${isClosing ? "opacity-0 scale-95 transition-all duration-300" : "animate-fadeIn"}`}
        >
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-start border border-rose-100 min-w-[320px] max-w-md">
            <div className="mr-4 flex-shrink-0 w-8 h-8 bg-rose-50 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-rose-500"
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
            </div>
            <div className="flex-1">
              <p className="font-normal text-sm text-slate-900">
                Error Updating Agency
              </p>
              <p className="text-xs text-slate-500 font-normal leading-relaxed break-words">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={handleCloseToast}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 ml-2 flex-shrink-0"
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

      <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate(`/admin/agency?page=${returnPage}`)}
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
                  Edit Agency
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium rounded-xl transition-all uppercase tracking-widest border border-slate-200 hover:border-slate-300"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                form="edit-agency-form"
                disabled={updateAgencyMutation.isPending}
                className="px-6 py-2.5 bg-[#1B3C53] text-white text-[11px] font-medium rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/10 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2.5 uppercase tracking-widest"
              >
                {updateAgencyMutation.isPending ? (
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
                    Updating
                  </>
                ) : (
                  "Update Agency"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <form id="edit-agency-form" onSubmit={handleSubmit} className="mt-2">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 transition-all hover:shadow-md">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v8"
                  />
                </svg>
                <h2 className="text-base font-bold text-slate-900">
                  Agency Identity
                </h2>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input
                label="Agency Name"
                required
                value={formData.agencyName}
                onChange={(value) => handleInputChange("agencyName", value)}
                error={errors.agencyName}
                placeholder=""
              />
              <Input
                label="Branch Code"
                value={formData.branchCode}
                onChange={(value) => handleInputChange("branchCode", value)}
                placeholder=""
              />
              <Input
                label="Email Address"
                required
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                error={errors.email}
                placeholder=""
              />
              <CustomSelect
                label="Country"
                value={formData.country}
                onChange={(value) => handleInputChange("country", value)}
                options={[
                  { value: "India", label: "India" },
                  { value: "USA", label: "United States" },
                  { value: "UK", label: "United Kingdom" },
                  { value: "Canada", label: "Canada" },
                  { value: "Australia", label: "Australia" },
                ]}
              />
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                placeholder=""
              />
              <Input
                label="Alternate Phone Number"
                value={formData.alternatePhone}
                onChange={(value) => handleInputChange("alternatePhone", value)}
                placeholder=""
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 transition-all hover:shadow-md">
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
                  Regional Assignment
                </h2>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              <div className="md:col-span-3">
                <Input
                  label="Address Line 1"
                  value={formData.address1}
                  onChange={(value) => handleInputChange("address1", value)}
                  placeholder=""
                />
              </div>
              <div className="md:col-span-3">
                <Input
                  label="Address Line 2"
                  value={formData.address2}
                  onChange={(value) => handleInputChange("address2", value)}
                  placeholder=""
                />
              </div>
              <Input
                label="City"
                value={formData.city}
                onChange={(value) => handleInputChange("city", value)}
                placeholder=""
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(value) => handleInputChange("state", value)}
                placeholder=""
              />
              <Input
                label="Postal Code"
                value={formData.pincode}
                onChange={(value) => handleInputChange("pincode", value)}
                placeholder=""
              />
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
  placeholder,
  type = "text",
  error,
  required = false,
}) => (
  <div className="space-y-1.5 group">
    <label className="text-sm font-medium text-slate-700 ml-1">
      {label}
      {required && <span className="text-[#1B3C53] ml-1">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 bg-white border rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-slate-400 ${
        error ? "border-red-200 ring-4 ring-red-50" : "border-slate-300"
      }`}
    />
    {error && (
      <p className="text-[9px] font-medium text-red-500 flex items-center mt-1 ml-1 uppercase tracking-widest">
        <svg
          className="h-3 w-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {error}
      </p>
    )}
  </div>
);

export default EditAgency;
