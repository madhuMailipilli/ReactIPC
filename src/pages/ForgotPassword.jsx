import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const verificationSteps = [
    { label: "Securing Connection", sub: "AES-256 Tunnel established" },
    { label: "Validating Email", sub: "Email verification active" },
    { label: "Generating Token", sub: "Reset token creation" },
    { label: "Sending Link", sub: "Email dispatch ready" }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await apiService.post('/auth/forgot-password', { email });
      setMessage('Password reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
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
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
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
        `}
      </style>

      {/* Navigation matching Landing Page */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="IPC Logo" className="w-7 h-7 object-contain" />
            <span className="text-xl font-black tracking-tight" style={{ color: '#1B3C53' }}>IPC Enterprise</span>
          </Link>

          <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1B3C53] transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Login
          </Link>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1 pt-20 overflow-hidden">
        {/* Left Side: Animation */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-12 xl:px-20 h-full">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

          <div className="relative z-10 space-y-8">
            <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/60 p-6 shadow-[0_20px_50px_rgba(27,60,83,0.08)] animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password Recovery</div>
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

              <div className="mt-8 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1B3C53] to-blue-500 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${(Math.min(activeStep, 4) / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
              <h2 className="text-3xl xl:text-4xl font-black text-slate-900 leading-[1.1] mb-4">
                Secure <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3C53] to-blue-600">Password Recovery</span>
              </h2>
              <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
                Recover your account securely with enterprise-grade email verification and encrypted reset links.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10 relative bg-white border-l border-slate-100 h-full">
          <div className="max-w-md w-full relative z-10 animate-fadeIn">
            {/* Header */}
            <div className="text-left mb-6">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                {step === 1 ? 'Forgot Password' : 'Reset Password'}
              </h1>
              <p className="text-slate-500 mt-1 font-medium text-xs">
                {step === 1 
                  ? "We'll send you an OTP to your email"
                  : "Enter the OTP and your new password"}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(27,60,83,0.05)]">
              {message && (
                <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-xs font-bold flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1B3C53] focus:bg-white transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl text-white font-bold shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                  style={{ backgroundColor: '#1B3C53' }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              © 2026 IPC Enterprise • Secured Recovery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;