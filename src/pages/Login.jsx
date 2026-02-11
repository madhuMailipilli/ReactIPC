import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const authContext = useAuth();
  const { login, isAuthenticated, user } = authContext;

  const verificationSteps = [
    { label: "Extracting Policy Data", sub: "Document Parsing Engine" },
    { label: "Analyzing Information", sub: "Smart Data Intelligence" },
    { label: "Validating Checklists", sub: "Accuracy Assurance" },
    { label: "Syncing Audit Trail", sub: "Compliance History" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (verificationSteps.length + 1));
    }, 1500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(stepInterval);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRoles = user?.roles || [];
      if (userRoles.includes('SUPER_ADMIN')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRoles.includes('VP')) {
        navigate('/vp', { replace: true });
      } else if (userRoles.includes('AGENT')) {
        navigate('/agent', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!login) {
      setError('Authentication service not available');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleAgentLogin = () => {
    // Set mock agent user in localStorage for testing
    const mockAgentUser = {
      id: 'agent-1',
      username: 'agent',
      email: 'agent@example.com',
      roles: ['AGENT']
    };
    localStorage.setItem('token', 'mock-agent-token');
    localStorage.setItem('user', JSON.stringify(mockAgentUser));
    window.location.href = '/agent';
  };

  return (
    <div className="h-screen bg-white selection:bg-blue-100 selection:text-blue-900 relative flex flex-col overflow-hidden">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }
          @keyframes blink {
            50% { border-color: transparent }
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(20px, -30px) scale(1.05); }
            66% { transform: translate(-10px, 15px) scale(0.95); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .typing-text {
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid #1B3C53;
            animation: typing 0.8s steps(30, end), blink 0.75s step-end infinite;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* Navigation matching Landing Page */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="IPC Logo" className="w-7 h-7 object-contain" />
            <span className="text-xl font-black tracking-tight" style={{ color: '#1B3C53' }}>IPC Enterprise</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1B3C53] transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1 pt-20 overflow-hidden">
        {/* Left Side: Mock Verification Animation & Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-12 xl:px-20 h-full">
          {/* Background Blobs */}
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="relative z-10 space-y-8">
            {/* Animated Verification Console */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 p-6 shadow-[0_20px_50px_rgba(27,60,83,0.08)] animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy Analysis Monitor</div>
              </div>

              <div className="space-y-4">
                {verificationSteps.map((step, idx) => (
                  <div key={idx} className={`transition-all duration-500 ${idx <= activeStep - 1 ? 'opacity-100' : 'opacity-20 translate-x-4'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${idx <= activeStep - 1 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-200'}`}>
                        {idx <= activeStep - 1 && (
                          <svg className="w-3 h-3 text-white animate-fadeIn" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className={`text-sm font-bold transition-colors ${idx <= activeStep - 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                          {idx === activeStep - 1 ? (
                            <div className="typing-text inline-block">{step.label}</div>
                          ) : step.label}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">{step.sub}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-8 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1B3C53] to-blue-500 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${(Math.min(activeStep, 4) / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Branding Text */}
            <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
              <h2 className="text-3xl xl:text-4xl font-black text-slate-900 leading-[1.1] mb-4">
                Redefining <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3C53] to-blue-600">Policy Compliance</span>
              </h2>
              <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
                IPCR Enterprise streamlines insurance policy verification and agency management with a secured audit trail. The global standard for regulatory transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10 relative bg-white border-l border-slate-100 h-full">
          <div className="max-w-md w-full relative z-10 animate-fadeIn">
            {/* Header */}
            <div className="text-left mb-6">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Sign In</h1>
              <p className="text-slate-500 mt-1 font-medium text-[11px]">Access your enterprise dashboard</p>
            </div>

            <div className="space-y-5">
              <form className="space-y-3" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1B3C53] focus:bg-white transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1B3C53] focus:bg-white transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1B3C53] transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center">
                    <input id="remember" type="checkbox" className="w-3.5 h-3.5 text-[#1B3C53] border-slate-300 rounded focus:ring-[#1B3C53]" />
                    <label htmlFor="remember" className="ml-2 text-[10px] font-bold text-slate-500 cursor-pointer">Remember me</label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl text-white font-bold shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                  style={{ backgroundColor: '#1B3C53' }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center border-t border-slate-50 pt-6">
                 <Link to="/forgot-password" className="text-[10px] font-bold text-slate-400 hover:text-[#1B3C53] transition-colors uppercase tracking-widest rounded-xl">
                   Reset Account Password
                 </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              © 2026 IPC Enterprise • Secured Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
