import React, { useState, useEffect } from 'react';
import DocumentTable from '../../components/DocumentTable';
import PendingTasks from '../../components/PendingTasks';
import { useAuth } from '../../components/AuthContext';
import CustomSelect from '../../components/CustomSelect';
import CustomDatePicker from '../../components/CustomDatePicker';
import dashboardLogo from '../../assets/HeroDashboard.png';
import apiService from '../../api/apiService';

const VPDashboard = () => {
  const { user } = useAuth();
  const [selectedLob, setSelectedLob] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [clickedCard, setClickedCard] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Using mock data since VP dashboard API endpoint doesn't exist
        const mockData = {
          total_uploaded: '1,234',
          total_validated: '987',
          total_reconciled: '756',
          total_completed: '623'
        };
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching VP dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const handleCardClick = (index) => {
    setClickedCard(index);
    setTimeout(() => setClickedCard(null), 600);
  };
  
  const lobOptions = [
    { value: 'property', label: 'Property Insurance' },
    { value: 'casualty', label: 'Casualty Insurance' },
    { value: 'health', label: 'Health Insurance' },
    { value: 'life', label: 'Life Insurance' },
    { value: 'auto', label: 'Auto Insurance' },
    { value: 'commercial', label: 'Commercial Insurance' },
  ];

  const kpiCards = [
    { 
      title: 'UPLOADED\nPOLICIES', 
      value: dashboardData?.total_uploaded || '0', 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    { 
      title: 'VALIDATION\nPOLICIES', 
      value: dashboardData?.total_validated || '0', 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17l6-6 4 4 8-8" />
        </svg>
      )
    },
    { 
      title: 'RECONCILED\nPOLICIES', 
      value: dashboardData?.total_reconciled || '0', 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    { 
      title: 'TOTAL EXTRACTION\nCOMPLETED', 
      value: dashboardData?.total_completed || '0', 
      footer: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12h6" strokeWidth="2"/>
          <path d="M9 16h6" strokeWidth="2"/>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2"/>
          <polyline points="14,2 14,8 20,8" strokeWidth="2"/>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-4 pt-1 pb-4">
      {/* Header */}
      <div className="rounded-2xl p-4 shadow-xl shadow-blue-900/10 relative overflow-hidden mb-4 border border-white" style={{ background: "linear-gradient(135deg, #1B3C53 0%, #2D5A7B 100%)" }}>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-white/20 rounded-xl blur-md"></div>
              <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/30 backdrop-blur-md bg-white/10 shadow-inner">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Hello, {user?.name || user?.username || 'VP'}! 👋</h1>
              <h2 className="text-lg font-semibold text-white/90 mb-2">Welcome to VP Dashboard.</h2>
              <p className="text-white/70 text-[13px] font-normal leading-relaxed max-w-xl">
                Monitor and oversee insurance policy processing operations with comprehensive analytics and management tools.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                  'bg-red-50 text-red-600 shadow-red-100'
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
                    'bg-red-600'
                  }`}></div>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">{card.footer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl border border-white p-4 shadow-xl shadow-blue-900/10 mb-4">
        <div className="flex flex-col sm:flex-row lg:flex-row lg:items-start gap-4">
          <div className="flex-1 min-w-0">
            <CustomSelect
              label="Line of Business"
              value={selectedLob}
              onChange={setSelectedLob}
              options={lobOptions}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0 w-36">
              <CustomDatePicker
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
              />
            </div>
            <div className="flex-shrink-0 w-36">
              <CustomDatePicker
                label="To Date"
                value={toDate}
                onChange={setToDate}
              />
            </div>

            <div className="flex-shrink-0 flex items-end">
              <button 
                onClick={() => {
                  console.log('Applying filters:', { selectedLob, fromDate, toDate });
                }}
                className="bg-[#1B3C53] hover:bg-[#2D5A7B] text-white text-[9px] font-medium px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 border border-white/10"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Details & Pending Tasks Section */}
      <div className="grid grid-cols-12 gap-4 relative">
        <div className="col-span-12 lg:col-span-9">
          <DocumentTable />
        </div>
        <div className="col-span-12 lg:col-span-3 lg:sticky lg:top-24" style={{ height: 'fit-content' }}>
          <PendingTasks />
        </div>
      </div>
    </div>
  );
};

export default VPDashboard;
