import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUsers, useDeleteUser, useResetPassword } from "../../hooks/useUsers";
import Pagination from "../../components/Pagination";
import logo from "../../assets/logo.png";

const VPAgentManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 1;
  });
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || "");
  const searchQueryRef = useRef("");
  const { data: users = [], isLoading: loading, error } = useUsers(1, 1000, debouncedSearch, false);
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetPassword();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [resetPasswordModal, setResetPasswordModal] = useState({ show: false, user: null });
  const [newPassword, setNewPassword] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    if (debouncedSearch) params.set('search', debouncedSearch);
    setSearchParams(params);
  }, [currentPage, debouncedSearch, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearch !== searchQueryRef.current) {
      searchQueryRef.current = debouncedSearch;
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewUser = (user) => {
    const userId = user.id || user.user_id;
    setDropdownOpen(null);
    const params = new URLSearchParams({ returnPage: currentPage.toString() });
    if (debouncedSearch) params.set('search', debouncedSearch);
    navigate(`/vp/agent/view/id/${userId}?${params.toString()}`);
  };

  const handleEditUser = (user) => {
    const userId = user.id || user.user_id;
    setDropdownOpen(null);
    const params = new URLSearchParams({ returnPage: currentPage.toString() });
    if (debouncedSearch) params.set('search', debouncedSearch);
    navigate(`/vp/agent/edit/${userId}?${params.toString()}`);
  };

  const handleDeleteUser = (user) => {
    setDeleteModal({ show: true, user });
    setDropdownOpen(null);
  };

  const handleResetPassword = (user) => {
    setResetPasswordModal({ show: true, user });
    setDropdownOpen(null);
  };

  const confirmResetPassword = async () => {
    if (!newPassword.trim()) return;
    
    const userId = resetPasswordModal.user.id || resetPasswordModal.user.user_id;
    resetPasswordMutation.mutate(
      { userId, newPassword },
      {
        onSuccess: () => {
          setResetPasswordModal({ show: false, user: null });
          setNewPassword("");
          setShowSuccessNotification(true);
          
          setTimeout(() => {
            setShowSuccessNotification(false);
          }, 3000);
        }
      }
    );
  };

  const confirmDelete = async () => {
    const user = deleteModal.user;
    const userId = user.id || user.user_id;
    setDeleteModal({ show: false, user: null });

    deleteUserMutation.mutate(userId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(27,60,83,0.05)] border border-slate-100 relative animate-in fade-in duration-500">
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

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30">
        <div className="flex flex-col sm:flex-row lg:flex-row justify-between items-start sm:items-center lg:items-center gap-4">
          <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Agent Management
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 font-normal">
              Manage and oversee agent accounts
            </p>
          </div>

          <div
            className="flex items-center gap-3 animate-fadeIn"
            style={{ animationDelay: "100ms" }}
          >
            <Link
              to="/vp/agent/add"
              className="inline-flex items-center px-4 py-2 text-[10px] font-medium rounded-lg shadow-lg shadow-blue-900/10 transition-all hover:scale-105 active:scale-95 text-white uppercase tracking-widest"
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
              Add Agent
            </Link>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 lg:px-6 py-4 bg-slate-50/50 border-b border-slate-100">
        <div className="relative max-w-sm lg:max-w-md xl:max-w-lg w-full">
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
            placeholder="Search by username or email..."
            className="block w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/10 focus:border-[#1B3C53] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto lg:overflow-x-visible xl:overflow-x-visible custom-scrollbar overflow-y-visible" style={{ minHeight: '500px' }}>
        <table className="w-full border-collapse h-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="text-left py-3 px-3 lg:px-4 text-sm font-medium text-gray-600">
                Agent Profile
              </th>
              <th className="text-left py-3 px-3 lg:px-4 text-sm font-medium text-gray-600">
                Contact Details
              </th>
              <th className="text-left py-3 px-3 lg:px-4 text-sm font-medium text-gray-600">
                Role
              </th>
              <th className="text-center py-3 px-3 lg:px-4 text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="text-center py-3 px-3 lg:px-4 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-32 text-center">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {debouncedSearch ? "No matching agents found" : "No Agents Found"}
                    </h3>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, i) => {
                const userId = user.id || user.user_id;
                return (
                  <tr
                    key={userId || i}
                    data-row-index={i}
                    className={`group hover:bg-slate-50/50 transition-all duration-300 ${deleteUserMutation.isPending ? "opacity-50 grayscale" : ""}`}
                  >
                    <td className="px-4 lg:px-6 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium text-xs">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-slate-900 group-hover:text-[#1B3C53] transition-colors truncate max-w-[120px]">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-4 py-3.5">
                      <div className="flex flex-col max-w-[180px]">
                        <span className="text-[13px] font-medium text-slate-900 truncate">
                          {user.email}
                        </span>
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                          {user.phones && user.phones.length > 0
                            ? user.phones[0].phone_number
                            : "No Phone"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="text-[11px] font-medium text-slate-900">
                        {user.roles && user.roles.length > 0
                          ? user.roles[0].code
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-3 lg:px-4 py-3.5 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-medium uppercase tracking-wider transition-all ${
                          user.is_active
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-3.5 whitespace-nowrap text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newIndex = dropdownOpen === i ? null : i;
                          setDropdownOpen(newIndex);
                          if (newIndex !== null) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const spaceBelow = window.innerHeight - rect.bottom;
                            setDropdownPosition({ [i]: spaceBelow < 280 });
                          }
                        }}
                        className={`p-1.5 rounded-lg transition-all ${dropdownOpen === i ? "bg-slate-100 text-[#1B3C53]" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>

                      {dropdownOpen === i && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setDropdownOpen(null)}
                          ></div>
                          <div className={`absolute right-0 ${dropdownPosition[i] ? 'bottom-full mb-2' : 'top-full mt-2'} bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 border border-slate-200/60 py-2 animate-zoomIn overflow-hidden min-w-[160px] lg:min-w-[180px]`}>
                            <button
                              onClick={() => {
                                handleViewUser(user);
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
                              <span className="text-[13px]">View Agent</span>
                            </button>
                            <button
                              onClick={() => {
                                handleEditUser(user);
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
                              <span className="text-[13px]">Edit Agent</span>
                            </button>
                            <button
                              onClick={() => {
                                handleResetPassword(user);
                                setDropdownOpen(null);
                              }}
                              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1B3C53] transition-all group/item"
                            >
                              <div className="w-7 h-7 rounded-lg bg-purple-50 group-hover/item:bg-purple-100 flex items-center justify-center mr-3 transition-colors">
                                <svg
                                  className="h-4 w-4 text-purple-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                  />
                                </svg>
                              </div>
                              <span className="text-[13px]">Reset Password</span>
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteUser(user);
                                setDropdownOpen(null);
                              }}
                              disabled={deleteUserMutation.isPending}
                              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all disabled:opacity-50 group/item"
                            >
                              <div className="w-7 h-7 rounded-lg bg-rose-50 group-hover/item:bg-rose-100 flex items-center justify-center mr-3 transition-colors">
                                {deleteUserMutation.isPending ? (
                                  <svg className="h-4 w-4 animate-spin text-rose-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : (
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
                                )}
                              </div>
                              <span className="text-[13px]">
                                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete Agent'}
                              </span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
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

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-[200] animate-in slide-in-from-right-full duration-300">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-6 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Password Reset Successfully</h4>
                <p className="text-xs text-slate-500 leading-relaxed">The agent's password has been updated and they can now log in with the new credentials.</p>
              </div>
              <button
                onClick={() => setShowSuccessNotification(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 -m-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetPasswordModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setResetPasswordModal({ show: false, user: null });
              setNewPassword("");
            }}
          ></div>

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight text-center">
                Reset Password
              </h3>
              <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed text-center">
                Enter a new password for{" "}
                <span className="text-slate-900 font-bold">
                  {resetPasswordModal.user?.username}
                </span>
              </p>

              <div className="mb-6">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-400 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/10 focus:border-[#1B3C53] transition-all hover:border-slate-500"
                  disabled={resetPasswordMutation.isPending}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    setResetPasswordModal({ show: false, user: null });
                    setNewPassword("");
                  }}
                  disabled={resetPasswordMutation.isPending}
                  className="flex-1 px-4 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResetPassword}
                  disabled={!newPassword.trim() || resetPasswordMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-[#1B3C53] text-white text-xs font-black rounded-xl hover:bg-[#1B3C53]/90 transition-all shadow-xl shadow-[#1B3C53]/20 active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setDeleteModal({ show: false, user: null })}
          ></div>

          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <svg
                  className="w-8 h-8 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                Confirm Deletion
              </h3>
              <p className="text-[13px] text-slate-500 font-medium mb-8 leading-relaxed">
                You are about to permanently remove{" "}
                <span className="text-slate-900 font-bold underline decoration-[#1B3C53]/20 underline-offset-4">
                  {deleteModal.user?.username}
                </span>{" "}
                from the system.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => setDeleteModal({ show: false, user: null })}
                  className="flex-1 px-4 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-widest"
                >
                  Discard
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-rose-500 text-white text-xs font-black rounded-xl hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 active:scale-95 uppercase tracking-widest"
                >
                  Delete Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VPAgentManagement;
