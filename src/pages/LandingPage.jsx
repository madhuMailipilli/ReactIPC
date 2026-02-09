import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import logo from '../assets/DashboardLogo1.png';
import heroImage from '../assets/HeroDashboard.png';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRoles = user?.roles || [];
      if (userRoles.includes('SUPER_ADMIN')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (userRoles.includes('AGENT')) {
        navigate('/agent', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(20px, -30px) scale(1.05); }
            66% { transform: translate(-10px, 15px) scale(0.95); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="IPC Logo" className="w-7 h-7 object-contain" />
            <span className="text-xl font-black tracking-tight" style={{ color: '#1B3C53' }}>IPC Enterprise</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-[#1B3C53] transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-semibold text-slate-600 hover:text-[#1B3C53] transition-colors">Solutions</a>
            <Link to="/about" className="text-sm font-semibold text-slate-600 hover:text-[#1B3C53] transition-colors">About</Link>
            <Link to="/login" className="text-sm font-bold px-3.5 py-1.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/10" style={{ backgroundColor: '#1B3C53' }}>
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">AI POWERED INSURANCE DOCUMENT EXTRACTION</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Upload Insurance Documents. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3C53] to-blue-600">Get Data Extracted Instantly.</span>
              </h1>
              <p className="text-base text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                IPC Enterprise helps agents upload policy documents and automatically extracts key insurance details using AI — faster processing, fewer manual errors, and better policy validation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-bold shadow-2xl shadow-blue-900/20 transition-all hover:scale-105 hover:shadow-[#1B3C53]/30 active:scale-95" style={{ backgroundColor: '#1B3C53' }}>
                  Get Started Now
                </Link>

              </div>

            </div>

            <div className="flex-none w-96 relative animate-float">
              <div className="relative z-20 bg-white p-3 rounded-[2rem] shadow-[0_30px_60px_rgba(27,60,83,0.1)] border border-slate-100">
                <img 
                  src={heroImage} 
                  alt="Dashboard Preview" 
                  className="rounded-[1.2rem] w-full h-auto max-w-sm mx-auto"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -top-8 -right-8 z-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-[#1B3C53] rounded-2xl opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Core Features</h2>
          <h3 className="text-4xl font-black text-slate-900 mb-16 tracking-tight">Everything you need to manage <br/>policies at scale</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Smart Document Upload',
                desc: 'Upload Policy, Binder, Acord, Proposal, Quote, Prior Policy, and Endorsement files in one place.',
                icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
              },
              {
                title: 'AI Auto Data Extraction',
                desc: 'AI reads the uploaded document and extracts important fields like insured name, policy number, premium, location, coverage details, and more.',
                icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
              },
              {
                title: 'Validation & Reconciliation',
                desc: 'Review extracted results, validate fields, compare with required checklist, and complete reconciliation smoothly.',
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              }
            ].map((f, i) => (
              <div key={i} className="group p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-8 group-hover:bg-[#1B3C53] transition-colors">
                  <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#1B3C53] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { val: '99%', label: 'Extraction Accuracy' },
              { val: '10x', label: 'Faster Processing' },
              { val: '85%', label: 'Manual Effort Reduced' },
              { val: '24/7', label: 'Automated Support' }
            ].map((s, i) => (
              <div key={i}>
                <div className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tighter">{s.val}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-200/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100">
                  <img src={logo} alt="IPC Logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-xl font-black tracking-tight text-[#0B2B3C]">IPC Enterprise</span>
              </div>
              <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                IPC Enterprise is a secure insurance policy checking platform that enables agents to upload documents, extract data with AI, validate results, and manage everything through a smart dashboard.
              </p>

            </div>
            
            <div>
              <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Product</h5>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-[#0B2B3C]">Features</a></li>
                <li><a href="#" className="hover:text-[#0B2B3C]">Security</a></li>
                <li><a href="#" className="hover:text-[#0B2B3C]">Enterprise</a></li>
                <li><a href="#" className="hover:text-[#0B2B3C]">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Company</h5>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><Link to="/about" className="hover:text-[#1B3C53]">About Us</Link></li>
                <li><a href="#" className="hover:text-[#1B3C53]">Careers</a></li>
                <li><a href="#" className="hover:text-[#1B3C53]">Blog</a></li>
                <li><a href="#" className="hover:text-[#1B3C53]">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              &copy; 2026 IPC ENTERPRISE. ALL RIGHTS RESERVED.
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
