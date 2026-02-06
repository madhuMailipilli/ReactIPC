import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/DashboardLogo1.png';
import heroImage from '../assets/HeroDashboard.png';

const About = () => {
  const [scrolled, setScrolled] = useState(false);

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
          .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
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
            <Link to="/#features" className="text-sm font-semibold text-slate-600 hover:text-[#1B3C53] transition-colors">Features</Link>
            <Link to="/#solutions" className="text-sm font-semibold text-slate-600 hover:text-[#1B3C53] transition-colors">Solutions</Link>
            <Link to="/about" className="text-sm font-bold text-[#1B3C53]">About</Link>
            <Link to="/login" className="text-sm font-bold px-3.5 py-1.5 rounded-xl text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/10" style={{ backgroundColor: '#1B3C53' }}>
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-6 mb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-blue-50/50 rounded-full blur-3xl -z-10 animate-blob"></div>
          
          <div className="max-w-4xl mx-auto text-center animate-fadeIn">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Our Mission</h2>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              Redefining Trust in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3C53] to-blue-600">Insurance Compliance</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              IPC Enterprise is an AI-powered insurance policy checking platform built to simplify document processing and improve compliance workflows. Our mission is to help agencies and agents reduce manual work, increase accuracy, and maintain secure transparency while managing policy documents at scale.
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'AI Auto Extraction', value: 'Extract key policy details instantly' },
              { label: 'Faster Policy Checking', value: 'Validate and review in minutes' },
              { label: 'Reduced Manual Work', value: 'Less typing, fewer errors' },
              { label: 'Secure Role-Based Access', value: 'Admin and Agent modules separated' },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 text-center hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                <div className="text-xl font-black text-[#1B3C53] mb-3 group-hover:scale-105 transition-transform leading-tight">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision & Values */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8 animate-fadeIn">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Why IPC Enterprise?</h3>
              <p className="text-slate-600 leading-relaxed">
                At IPC Enterprise, we understand that insurance is more than documents it’s about people, protection, and peace of mind. Our platform bridges the gap between complex insurance compliance requirements and seamless operational efficiency by combining AI extraction, secure workflows, and user-friendly dashboards.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Absolute Transparency', desc: 'Every upload, extraction update, and validation action is recorded for audit-ready tracking.' },
                  { title: 'Regulatory Validation Support', desc: 'Extracted fields can be reviewed and validated to ensure accuracy before completion.' },
                  { title: 'Security by Design', desc: 'Token-based authentication with controlled access for different roles and agencies.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex-none w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-[#1B3C53] rounded-[3rem] rotate-3 opacity-10"></div>
                <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100">
                  <img 
                    src={heroImage} 
                    alt="IPC Infrastructure" 
                    className="rounded-[2.5rem] w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Impact */}
        <section className="bg-[#1B3C53] py-24 px-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h3 className="text-3xl lg:text-4xl font-black mb-8 tracking-tight">Ready to modernize your <br/>insurance compliance workflow?</h3>
            <p className="text-blue-100/70 mb-12 text-lg">
              Join the agencies adopting smarter policy verification through AI extraction, faster validation, and secure dashboards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="px-10 py-4 bg-white text-[#1B3C53] font-black rounded-2xl hover:scale-105 transition-all">
                Get Started
              </Link>
              <button className="px-10 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm border border-slate-100">
                <img src={logo} alt="IPC Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-lg font-black tracking-tight text-[#1B3C53]">IPC Enterprise</span>
            </Link>
            <div className="flex gap-8 text-sm font-bold text-slate-400">
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              &copy; 2026 IPC ENTERPRISE. AI-POWERED POLICY VERIFICATION & COMPLIANCE PLATFORM
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
