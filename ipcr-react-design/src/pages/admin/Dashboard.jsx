import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useAgencies } from '../../hooks/useAgencies';
import AuditHistory from '../../components/AuditHistory';
import AgencyStats from '../../components/AgencyStats';
import dashboardLogo from '../../assets/HeroDashboard.png';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: agencies = [], isLoading, error } = useAgencies(false);
  const [clickedCard, setClickedCard] = useState(null);
  const agencyCount = agencies?.length || 0;

  const handleCardClick = (index) => {
    setClickedCard(index);
    setTimeout(() => setClickedCard(null), 600);
  };

  const kpiCards = [
    { 
      title: 'TOTAL\nAGENCIES', 
      value: isLoading ? '...' : agencyCount.toString(), 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      title: 'VALIDATION\nPOLICIES', 
      value: '0', 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17l6-6 4 4 8-8" />
        </svg>
      )
    },
    { 
      title: 'RECONCILED\nPOLICIES', 
      value: '0', 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      title: 'PENDING\nPOLICIES', 
      value: '0', 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: 'COMPLETED\nPOLICIES', 
      value: '0', 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-2 pt-1 pb-4">
      {/* Header */}
      <div className="rounded-2xl p-6 shadow-xl shadow-blue-900/10 relative overflow-hidden mb-6 border border-white" style={{ background: "linear-gradient(135deg, #1B3C53 0%, #2D5A7B 100%)" }}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-white/20 rounded-xl blur-md"></div>
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30 backdrop-blur-md bg-white/10 shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Hello, {user?.name || user?.username || 'User'}! 👋</h1>
              <h2 className="text-lg font-semibold text-white/90 mb-2">Welcome to Insurance Policy Checking</h2>
              <p className="text-white/70 text-[13px] font-normal leading-relaxed max-w-xl">
                Easily extract data from policy pages, analyze relevant information within minutes, 
                and improve accuracy with fast, customized checklists.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent"></div>
        </div>
        <img 
          src={dashboardLogo} 
          alt="Insurance Dashboard" 
          className="absolute top-1/2 right-8 -translate-y-1/2 h-44 w-auto object-contain filter drop-shadow-2xl brightness-110"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {kpiCards.map((card, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-2xl border border-slate-100 p-4 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-display font-semibold text-slate-900 uppercase tracking-widest leading-tight">{card.title}</p>
                </div>
                <div className={`p-2.5 rounded-xl transition-all duration-500 ${
                  index === 0 ? 'bg-blue-50 text-blue-600 shadow-blue-100' :
                  index === 1 ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' :
                  index === 2 ? 'bg-amber-50 text-amber-600 shadow-amber-100' :
                  index === 3 ? 'bg-orange-50 text-orange-600 shadow-orange-100' :
                  'bg-purple-50 text-purple-600 shadow-purple-100'
                } ${
                  clickedCard === index ? 'scale-90 shadow-inner' : 'group-hover:scale-110 shadow-md'
                }`} onClick={() => handleCardClick(index)}>
                  {React.cloneElement(card.icon, { className: "w-4 h-4" })}
                </div>
              </div>
              
              <div>
                <p className="text-2xl font-display font-bold text-slate-900 group-hover:text-[#1B3C53] transition-colors">
                  {card.value}
                </p>
                
                <div className="flex items-center space-x-2 mt-3">
                  <div className={`h-1 w-6 rounded-full transition-all duration-500 group-hover:w-10 ${
                    index === 0 ? 'bg-blue-600' :
                    index === 1 ? 'bg-emerald-600' :
                    index === 2 ? 'bg-amber-600' :
                    index === 3 ? 'bg-orange-600' :
                    'bg-purple-600'
                  }`}></div>
                  <p className="text-[9px] text-slate-400 font-normal uppercase tracking-wider">{card.footer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8">
          <AuditHistory />
        </div>
        <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-24" style={{ height: '600px' }}>
          <AgencyStats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
