import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import logo from "../assets/DashboardLogo1.png";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    agencies: false,
    users: false,
    subscriptions: false
  });
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.pathname === "/admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Auto-expand menus based on current route
  useEffect(() => {
    if (location.pathname.startsWith("/admin/agency")) {
      setExpandedMenus(prev => ({ ...prev, agencies: true }));
    }
    if (location.pathname.startsWith("/admin/user")) {
      setExpandedMenus(prev => ({ ...prev, users: true }));
    }
    if (location.pathname.startsWith("/admin/subscription")) {
      setExpandedMenus(prev => ({ ...prev, subscriptions: true }));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setProfileMenuOpen(false);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navigationGroups = [
    {
      title: "Overview",
      items: [
        {
          path: "/admin",
          label: "Dashboard",
          icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
        }
      ]
    },
    {
      title: "Management",
      items: [
        {
          path: "/admin/agency",
          label: "Agencies",
          icon: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z",
          expandKey: "agencies",
          subItems: [
            { 
              path: "/admin/agency/add", 
              label: "Add Agency",
              icon: "M12 4v16m8-8H4"
            },
            { 
              path: "/admin/agency", 
              label: "View All",
              icon: "M4 6h16M4 10h16M4 14h16M4 18h16"
            }
          ]
        },
        {
          path: "/admin/user",
          label: "Users",
          icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
          expandKey: "users",
          subItems: [
            { 
              path: "/admin/user/add", 
              label: "Add User",
              icon: "M12 4v16m8-8H4"
            },
            { 
              path: "/admin/user", 
              label: "View All",
              icon: "M4 6h16M4 10h16M4 14h16M4 18h16"
            }
          ]
        },
        {
          path: "/admin/subscription/plans",
          label: "Subscriptions",
          icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
          expandKey: "subscriptions",
          subItems: [
            { 
              path: "/admin/subscription/create-plan", 
              label: "Create Plan",
              icon: "M12 4v16m8-8H4"
            },
            { 
              path: "/admin/subscription/plans", 
              label: "Manage Plans",
              icon: "M4 6h16M4 10h16M4 14h16M4 18h16"
            }
          ]
        }
      ]
    },
    {
      title: "Analytics",
      items: [
        {
          path: "/admin/reports",
          label: "Reports",
          icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50 antialiased overflow-hidden">
      {/* Enhanced Sidebar */}
      <aside className={`fixed left-0 top-20 h-[calc(100vh-5rem)] transition-all duration-300 bg-white flex flex-col flex-shrink-0 border-r border-slate-200 z-30 shadow-sm ${
        sidebarCollapsed ? 'w-16' : 'w-52 lg:w-56 xl:w-60'
      }`}>
        
        {/* Collapse Toggle Button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          {!sidebarCollapsed && (
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</h3>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors ml-auto"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          {navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {!sidebarCollapsed && (
                <h4 className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {group.title}
                </h4>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isItemActive = item.path === "/admin" 
                    ? location.pathname === "/admin" || location.pathname === "/admin/dashboard"
                    : location.pathname.startsWith(item.path);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isExpanded = hasSubItems && expandedMenus[item.expandKey];

                  return (
                    <div key={item.path}>
                      {/* Main Menu Item */}
                      <div className="relative">
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                            isItemActive
                              ? "bg-gradient-to-r from-[#1B3C53] to-[#2D5A7B] text-white shadow-md shadow-blue-900/20"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                          title={sidebarCollapsed ? item.label : ""}
                        >
                          {/* Active Indicator */}
                          {isItemActive && !sidebarCollapsed && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                          )}
                          
                          <svg 
                            className={`flex-shrink-0 transition-colors ${
                              sidebarCollapsed ? 'w-5 h-5 mx-auto' : 'w-5 h-5'
                            } ${isItemActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                          </svg>
                          
                          {!sidebarCollapsed && (
                            <>
                              <span className="flex-1">{item.label}</span>
                              {hasSubItems && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    toggleMenu(item.expandKey);
                                  }}
                                  className="p-1 rounded hover:bg-white/10"
                                >
                                  <svg 
                                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              )}
                            </>
                          )}
                        </Link>
                      </div>

                      {/* Sub Menu Items */}
                      {hasSubItems && isExpanded && !sidebarCollapsed && (
                        <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-200 space-y-1">
                          {item.subItems.map((subItem) => {
                            const isSubItemActive = location.pathname === subItem.path;
                            return (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  isSubItemActive
                                    ? "bg-slate-100 text-[#1B3C53] font-semibold"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={subItem.icon} />
                                </svg>
                                <span>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>


      </aside>

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 min-w-0 h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-52 lg:ml-56 xl:ml-60'
      }`}>
        {/* Professional Topbar */}
        <header className="fixed top-0 right-0 left-0 h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 xl:px-10 py-4 z-40">
          
          {/* Logo and Title */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1B3C53] flex items-center justify-center shadow-lg shadow-blue-900/20">
                <img src={logo} alt="IPC" className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
            </Link>

            <div className="flex flex-col">
              <h2 className="text-base font-bold text-slate-900 tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>IPC</h2>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide -mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>Insurance Policy Control</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex lg:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{user?.username || user?.email?.split('@')[0]}</span>
              <span className="text-xs font-medium text-slate-500" style={{ fontFamily: 'Poppins, sans-serif' }}>{user?.roles || 'Administrator'}</span>
            </div>
            
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-medium text-sm transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 group relative overflow-hidden"
                style={{ backgroundColor: "#1B3C53" }}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden z-[9999]">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">{user?.username || user?.email?.split("@")[0]}</p>
                    <p className="text-xs text-slate-600 mt-1">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <Link 
                      to="/admin/profile"
                      className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-50 transition-colors duration-200 text-left"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Profile</p>
                        <p className="text-xs text-slate-600">View your profile</p>
                      </div>
                    </Link>


                  </div>

                  <div className="border-t border-slate-200"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors duration-200 text-left"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <p className="text-sm font-medium text-red-600">Logout</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50 p-4 mt-20">
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Confirm Logout</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Are you sure you want to sign out?</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 6px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
