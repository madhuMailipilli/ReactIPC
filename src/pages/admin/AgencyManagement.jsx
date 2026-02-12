import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAgencies, useDeleteAgency, useUpdateAgency } from "../../hooks/useAgencies";
import { useSubscriptionPlans, useAssignSubscription } from "../../hooks/useSubscriptions";
import Pagination from "../../components/Pagination";
import AgencyRowWithSubscription from "../../components/AgencyRowWithSubscription";
import logo from "../../assets/logo.png";

const AgencyManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 1;
  });
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || "");
  const searchQueryRef = useRef("");
  
  const { data: allAgencies = [], isLoading, error } = useAgencies(false, 1, 1000, debouncedSearch, false);
  const totalPages = Math.ceil(allAgencies.length / itemsPerPage);
  const paginatedAgencies = allAgencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const deleteAgencyMutation = useDeleteAgency();
  const updateAgencyMutation = useUpdateAgency();
  const { data: plansResponse, isLoading: plansLoading } = useSubscriptionPlans();
  const subscriptionPlans = plansResponse?.data || [];
  const assignSubscriptionMutation = useAssignSubscription();
  
  const [subscriptionModal, setSubscriptionModal] = useState({ show: false, agency: null });
  const [subscriptionData, setSubscriptionData] = useState({
    planId: ''
  });
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const [planSearchKey, setPlanSearchKey] = useState('');
  const [highlightedPlanIndex, setHighlightedPlanIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [toastStatus, setToastStatus] = useState("success");
  const toastTimerRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, agency: null });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const params = { page: currentPage.toString() };
    if (debouncedSearch) params.search = debouncedSearch;
    setSearchParams(params);
  }, [currentPage, debouncedSearch, setSearchParams]);

  useEffect(() => {
    if (debouncedSearch !== searchQueryRef.current) {
      searchQueryRef.current = debouncedSearch;
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (!planDropdownOpen) {
      setPlanSearchKey('');
      setHighlightedPlanIndex(-1);
      return;
    }

    const filteredPlans = subscriptionPlans.filter(plan => 
      !planSearchKey || plan.name.toLowerCase().startsWith(planSearchKey.toLowerCase())
    );

    const handleKeyPress = (e) => {
      if (!/^[a-zA-Z]$/.test(e.key)) return;
      e.preventDefault();
      setPlanSearchKey(prev => prev + e.key.toLowerCase());
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        setPlanSearchKey(prev => prev.slice(0, -1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedPlanIndex(prev => prev < filteredPlans.length - 1 ? prev + 1 : prev);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedPlanIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && highlightedPlanIndex >= 0) {
        e.preventDefault();
        setSubscriptionData(prev => ({ ...prev, planId: filteredPlans[highlightedPlanIndex].id }));
        setPlanDropdownOpen(false);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [planDropdownOpen, planSearchKey, highlightedPlanIndex, subscriptionPlans]);

  useEffect(() => {
    // Check both React Router state and window.history.state
    const historyState = window.history.state?.usr;
    const locationState = window.history.state?.state; // React Router stores it here

    const msg = locationState?.successMessage || historyState?.successMessage;

    if (msg) {
      triggerSuccess(msg);
      // Clean up the state to prevent re-showing on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const showToast = (message, status = "success", autoClose = true) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    setSuccessMessage(message || "Action completed successfully");
    setToastStatus(status);
    setShowSuccess(true);
    setIsClosing(false);

    if (autoClose) {
      toastTimerRef.current = setTimeout(() => {
        handleCloseToast();
      }, 3000);
    }
  };

  const triggerSuccess = (message) => {
    showToast(message, "success", true);
  };

  const handleCloseToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    setIsClosing(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsClosing(false);
    }, 300);
  };

  const navigateWithSuccess = (path, message) => {
    window.history.pushState({ usr: { successMessage: message } }, "");
    navigate(path);
  };

  const handleDeleteAgency = (agencyId, agencyName) => {
    setDeleteModal({ show: true, agency: { id: agencyId, name: agencyName } });
  };

  const confirmDelete = async () => {
    const { id: agencyId } = deleteModal.agency;
    setDeleteModal({ show: false, agency: null });
    
    deleteAgencyMutation.mutate(agencyId, {
      onSuccess: () => {
        triggerSuccess("Agency has been successfully deactivated");
      },
      onError: (error) => {
        console.error('Failed to deactivate agency:', error);
        alert('Failed to deactivate agency: ' + (error.response?.data?.message || error.message));
      }
    });
  };

  const toggleDataRetention = (agencyId) => {
    const agency = allAgencies.find(a => (a.id || a.agency_id) === agencyId);
    if (!agency) return;
    
    const currentRetention = agency.data_retention ?? agency.dataRetention ?? false;
    const newRetention = !currentRetention;
    
    updateAgencyMutation.mutate(
      { id: agencyId, data: { data_retention: newRetention } },
      {
        onSuccess: () => {
          // Silent success - no toast message
        },
        onError: (error) => {
          console.error("Failed to update data retention:", error);
          alert("Failed to update data retention: " + (error.response?.data?.message || error.message));
        }
      }
    );
  };

  const handleSubscriptionClick = (agency) => {
    setSubscriptionData({
      planId: ''
    });
    setSubscriptionModal({ show: true, agency });
  };

  const handleSubscriptionSave = () => {
    const agency = subscriptionModal.agency;
    if (!agency || !subscriptionData.planId) return;
    const agencyId = agency.id || agency.agency_id;

    assignSubscriptionMutation.mutate(
      { 
        agencyId, 
        subscriptionData: {
          planId: subscriptionData.planId
        }
      },
        {
          onMutate: () => {
            setSubscriptionModal({ show: false, agency: null });
            setPlanDropdownOpen(false);
            showToast("Assigning subscription...", "loading", false);
          },
          onSuccess: () => {
            setSubscriptionModal({ show: false, agency: null });
            showToast("Subscription assigned successfully", "success", true);
          },
        onError: (error) => {
          console.error("Failed to assign subscription:", error);
          const message = error?.response?.data?.message || error?.message || "Failed to assign subscription";
          showToast(message, "error", true);
        }
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 relative animate-in fade-in duration-500 overflow-hidden">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
          .animate-zoomIn { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
            height: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #E2E8F0;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #CBD5E1;
          }
        `}
      </style>

      {/* Success Notification */}
      {showSuccess && (
        <div
          className={`fixed top-6 right-6 z-[60] ${isClosing ? "opacity-0 scale-95 transition-all duration-300" : "animate-fadeIn"}`}
        >
          <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-3.5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center border border-slate-100 min-w-[300px]">
            <div className={`mr-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              toastStatus === "error"
                ? "bg-rose-50"
                : toastStatus === "loading"
                ? "bg-slate-100"
                : "bg-emerald-50"
            }`}>
              {toastStatus === "loading" ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-[#1B3C53] rounded-full animate-spin" />
              ) : toastStatus === "error" ? (
                <svg
                  className="w-5 h-5 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-xs text-slate-900">
                {successMessage}
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

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30">
        <div className="flex flex-col sm:flex-row lg:flex-row justify-between items-start sm:items-center lg:items-center gap-4">
          <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Agency Management
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 font-normal">
              Oversee and manage your enterprise agency network
            </p>
          </div>

          <div
            className="flex items-center gap-3 animate-fadeIn"
            style={{ animationDelay: "100ms" }}
          >
            <button
              onClick={() =>
                navigate("/admin/agency/add", { state: { from: "management" } })
              }
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-all hover:bg-[#2d5d7e] text-white"
              style={{ backgroundColor: "#1B3C53" }}
            >
              <svg
                className="-ml-0.5 mr-2 h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Agency
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 lg:px-6 py-4 bg-slate-50/50 border-b border-slate-100">
        <div className="relative flex-1 w-full max-w-sm lg:max-w-md xl:max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agencies by name..."
            className="block w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/10 focus:border-[#1B3C53] transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="overflow-x-auto lg:overflow-x-visible xl:overflow-x-visible custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Agency Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Document Limit
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contract Term
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact Details
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Data Retention
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="flex flex-col justify-center items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <img src={logo} alt="IPC Logo" className="w-10 h-10 object-contain z-10" />
                      <svg className="absolute inset-0 w-16 h-16 animate-spin" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#1B3C53" strokeWidth="4" strokeDasharray="70 200" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : allAgencies.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-8 py-32 text-center">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                      <svg
                        className="w-10 h-10 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 7h1m-1 4h1m-1 4h1"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {searchQuery ? "No matching agencies found" : "No Agencies Found"}
                    </h3>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAgencies.map((agency, index) => {
                const agencyId = agency.id || agency.agency_id;
                const isActive =
                  agency.active ?? agency.is_active ?? agency.isActive ?? false;
                const isRetained =
                  agency.data_retention ?? agency.dataRetention ?? false;

                return (
                  <AgencyRowWithSubscription key={agencyId || index} agency={agency}>
                    {({ currentSubscription }) => (
                  <tr
                    className={`group hover:bg-slate-50/50 transition-all duration-300 ${agency.isDeleting ? "opacity-50 grayscale" : ""}`}
                  >
                    <td className="px-4 lg:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18" />
                          <path d="M5 21V7l8-4v18" />
                          <path d="M19 21V11l-6-4" />
                          <path d="M9 9v.01" />
                          <path d="M9 12v.01" />
                          <path d="M9 15v.01" />
                          <path d="M9 18v.01" />
                        </svg>
                        <div className="flex flex-col min-w-0">
                          <div className="text-[13px] font-medium text-slate-900 truncate tracking-tight max-w-[150px]">
                            {agency.agency_name ||
                              agency.agencyName ||
                              "Unknown Agency"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 lg:px-4 py-3.5 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[13px] font-medium text-slate-900">
                          {(
                            currentSubscription?.document_limit ??
                            agency.document_limit ??
                            agency.documentLimit ??
                            0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 lg:px-4 py-3.5 whitespace-nowrap text-center">
                      <span className="text-[13px] font-medium text-slate-900">
                        {currentSubscription?.term ?? agency.term ?? agency.terms ?? agency.contract_term ?? "N/A"} Days
                      </span>
                    </td>

                    <td className="px-3 lg:px-4 py-3.5">
                      <div className="flex flex-col max-w-[180px]">
                        <span className="text-[13px] font-medium text-slate-900 truncate">
                          {agency.email_address ||
                            agency.emailAddress ||
                            agency.email ||
                            "N/A"}
                        </span>
                        <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest mt-0.5">
                          {agency.phone_number || "No Phone"}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 lg:px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-widest rounded-full border transition-all duration-300 ${
                          isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-3 lg:px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => toggleDataRetention(agencyId)}
                          className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                            isRetained ? "bg-[#1B3C53]" : "bg-slate-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isRetained ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </td>

                    <td className="px-4 lg:px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Actions Dropdown Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              const newIndex = dropdownOpen === index ? null : index;
                              setDropdownOpen(newIndex);
                              if (newIndex !== null) {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const spaceBelow = window.innerHeight - rect.bottom;
                                setDropdownPosition({ [index]: spaceBelow < 250 });
                              }
                            }}
                            className={`p-1.5 rounded-lg transition-all ${
                              dropdownOpen === index
                                ? "bg-slate-100 text-[#1B3C53]"
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                            }`}
                          >
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                              {dropdownOpen === index && (
                                <>
                                  <div
                                    className="fixed inset-0 z-20"
                                    onClick={() => setDropdownOpen(null)}
                                  ></div>
                                  <div
                                    className={`absolute right-0 ${dropdownPosition[index] ? 'bottom-full mb-2' : 'top-full mt-2'} bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-30 border border-slate-200/60 py-2 animate-zoomIn overflow-hidden min-w-[160px] lg:min-w-[180px]`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => {
                                        const params = new URLSearchParams({ returnPage: currentPage });
                                        if (debouncedSearch) params.set('search', debouncedSearch);
                                        navigate(`/admin/agency/view/${agencyId}?${params.toString()}`);
                                        setDropdownOpen(null);
                                      }}
                                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1B3C53] transition-all group/item"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover/item:bg-blue-100 flex items-center justify-center mr-3 transition-colors">
                                        <svg
                                          className="h-4 w-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                          />
                                        </svg>
                                      </div>
                                      <span className="text-[13px]">View Details</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        const params = new URLSearchParams({ returnPage: currentPage });
                                        if (debouncedSearch) params.set('search', debouncedSearch);
                                        navigate(`/admin/agency/edit/${agencyId}?${params.toString()}`);
                                        setDropdownOpen(null);
                                      }}
                                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1B3C53] transition-all group/item"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover/item:bg-emerald-100 flex items-center justify-center mr-3 transition-colors">
                                        <svg
                                          className="h-4 w-4 text-emerald-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                        </svg>
                                      </div>
                                      <span className="text-[13px]">Edit Agency</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleSubscriptionClick(agency);
                                        setDropdownOpen(null);
                                      }}
                                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1B3C53] transition-all group/item"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-indigo-50 group-hover/item:bg-indigo-100 flex items-center justify-center mr-3 transition-colors">
                                        <svg
                                          className="h-4 w-4 text-indigo-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                          />
                                        </svg>
                                      </div>
                                      <span className="text-[13px]">Subscription</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeleteAgency(
                                          agencyId,
                                          agency.agency_name || agency.agencyName
                                        );
                                        setDropdownOpen(null);
                                      }}
                                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all group/item"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-rose-50 group-hover/item:bg-rose-100 flex items-center justify-center mr-3 transition-colors">
                                        <svg
                                          className="h-4 w-4 text-rose-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </div>
                                      <span className="text-[13px]">Delete Agency</span>
                                    </button>
                                  </div>
                                </>
                              )}
                        </div>
                      </div>
                    </td>
                  </tr>
                    )}
                  </AgencyRowWithSubscription>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Subscription Modal */}
      {subscriptionModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 animate-zoomIn border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Assign Plan
                </h2>
                <p className="text-[9px] font-normal text-slate-400 uppercase tracking-widest mt-1">
                  Assign subscription plan to agency
                </p>
              </div>
              <button
                onClick={() =>
                  setSubscriptionModal({ show: false, agency: null })
                }
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-all hover:scale-110 active:scale-95 shadow-sm hover:border-slate-300"
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

            <div className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="text-[9px] font-medium text-blue-400 uppercase tracking-widest mb-0.5">
                  Target Agency
                </div>
                <div className="text-[13px] font-medium text-blue-900">
                  {subscriptionModal.agency?.agency_name}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-700 uppercase tracking-[0.2em] ml-1">
                  Subscription Plan
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPlanDropdownOpen(!planDropdownOpen)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-all hover:border-slate-400 flex items-center justify-between"
                  >
                    <span className={subscriptionData.planId ? "text-slate-900" : "text-slate-400"}>
                      {planSearchKey && planDropdownOpen ? (
                        <span className="text-[#1B3C53] font-bold">{planSearchKey}</span>
                      ) : subscriptionData.planId ? (
                        subscriptionPlans.find(p => p.id === subscriptionData.planId)?.name + " - " + subscriptionPlans.find(p => p.id === subscriptionData.planId)?.document_limit + " docs"
                      ) : (
                        "Select a plan"
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      {(subscriptionData.planId || planSearchKey) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSubscriptionData(prev => ({ ...prev, planId: '' }));
                            setPlanSearchKey('');
                          }}
                          className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${planDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {planDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setPlanDropdownOpen(false)}></div>
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                        {subscriptionPlans
                          .filter(plan => !planSearchKey || plan.name.toLowerCase().startsWith(planSearchKey.toLowerCase()))
                          .map((plan, idx) => {
                            const matchLength = planSearchKey.length;
                            const planName = plan.name;
                            const highlightedPart = planName.substring(0, matchLength);
                            const remainingPart = planName.substring(matchLength);
                            const isHighlighted = idx === highlightedPlanIndex;
                            
                            return (
                              <button
                                key={plan.id}
                                type="button"
                                onClick={() => {
                                  setSubscriptionData(prev => ({ ...prev, planId: plan.id }));
                                  setPlanDropdownOpen(false);
                                }}
                                onMouseEnter={() => setHighlightedPlanIndex(idx)}
                                className={`w-full px-4 py-2.5 text-left text-[13px] font-medium transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-slate-100 last:border-b-0 ${
                                  isHighlighted ? 'bg-[#1B3C53]/10 text-[#1B3C53]' : 'text-slate-900 hover:bg-slate-50'
                                }`}
                              >
                                {planSearchKey ? (
                                  <>
                                    <span className="font-extrabold text-[#1B3C53]">{highlightedPart}</span>
                                    <span>{remainingPart}</span>
                                    <span> - {plan.document_limit} docs</span>
                                  </>
                                ) : (
                                  <>{plan.name} - {plan.document_limit} docs</>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() =>
                  setSubscriptionModal({ show: false, agency: null })
                }
                className="flex-1 px-4 py-2.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-all active:scale-95 hover:border-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscriptionSave}
                disabled={!subscriptionData.planId || assignSubscriptionMutation.isPending}
                className="flex-1 px-4 py-2.5 text-xs font-medium text-white bg-[#1B3C53] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {assignSubscriptionMutation.isPending ? "Assigning..." : "Assign Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden animate-zoomIn border-2 border-slate-400">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-rose-100">
                <svg
                  className="w-8 h-8 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-2">
                Deactivate Agency
              </h3>
              <p className="text-[13px] text-slate-500 font-normal leading-relaxed mb-6 px-2">
                You are about to deactivate{" "}
                <span className="font-medium text-slate-900">
                  {deleteModal.agency?.name}
                </span>
                . This will restrict their access to the platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => setDeleteModal({ show: false, agency: null })}
                  className="flex-1 px-4 py-3 text-xs font-normal text-slate-600 bg-white border-2 border-slate-400 rounded-xl hover:bg-slate-50 transition-all active:scale-95 hover:border-slate-500"
                >
                  Keep Active
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 text-xs font-medium text-white bg-rose-600 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-rose-900/20"
                >
                  Deactivate Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyManagement;
