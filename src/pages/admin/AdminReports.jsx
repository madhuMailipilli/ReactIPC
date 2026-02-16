import React, { useState, useMemo, useEffect } from 'react';
import CustomSelect from '../../components/CustomSelect';
import authService from '../../api/authService';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';

// --- MOCK DATA GENERATOR ---

const COLORS = ['#1B3C53', '#2D5A7B', '#4FA3A0', '#4B9DA9', '#BDE8F5', '#10b981', '#3b82f6', '#6366f1', '#f97316', '#ec4899'];

const getAgencyData = (agencyName, year) => {
  const yearMultiplier = year === '2024' ? 1 : year === '2023' ? 0.8 : year === '2022' ? 0.6 : year === '2021' ? 0.5 : 0.4;
  const agencyDatasets = {
    'All Agencies': {
      totalPolicies: 1284,
      aiValidated: 892,
      reconciled: 705,
      pending: 156,
      submitted: 632,
      policiesByType: [
        { name: 'Commercial Property', value: 450 },
        { name: 'General Liability', value: 300 },
        { name: 'Commercial Umbrella', value: 150 },
        { name: 'Commercial Auto', value: 200 },
        { name: 'Business Owners', value: 180 },
        { name: 'Workers Compensation', value: 220 },
        { name: 'Professional Liability', value: 130 },
        { name: 'Cyber Liability', value: 90 },
        { name: 'Flood', value: 60 },
        { name: 'EPLI', value: 50 },
      ],
      policiesByPreparedBy: [
        { name: 'Senior Underwriter', value: 540 },
        { name: 'Junior Underwriter', value: 320 },
        { name: 'Risk Analyst', value: 210 },
        { name: 'Claims Manager', value: 150 },
      ],
      policyByStatus: [
        { name: 'Uploaded', value: 200 },
        { name: 'AI Validated', value: 450 },
        { name: 'Reconciled', value: 300 },
        { name: 'Checklist Submitted', value: 250 },
        { name: 'Checklist Pending', value: 100 },
      ],
      completedPerMonth: [
        { month: 'Jan', 'Commercial Property': 40, 'General Liability': 30, 'Commercial Auto': 20, 'Workers Comp': 25 },
        { month: 'Feb', 'Commercial Property': 45, 'General Liability': 35, 'Commercial Auto': 22, 'Workers Comp': 28 },
        { month: 'Mar', 'Commercial Property': 50, 'General Liability': 40, 'Commercial Auto': 25, 'Workers Comp': 30 },
        { month: 'Apr', 'Commercial Property': 48, 'General Liability': 38, 'Commercial Auto': 24, 'Workers Comp': 32 },
        { month: 'May', 'Commercial Property': 55, 'General Liability': 42, 'Commercial Auto': 28, 'Workers Comp': 35 },
        { month: 'Jun', 'Commercial Property': 60, 'General Liability': 45, 'Commercial Auto': 30, 'Workers Comp': 38 },
      ],
      requestsRaised: [
        { agency: 'Alpha Ins', requests: 120, resolved: 100 },
        { agency: 'Beta Risk', requests: 150, resolved: 130 },
        { agency: 'Gamma Corp', requests: 80, resolved: 75 },
        { agency: 'Delta Sec', requests: 200, resolved: 180 },
      ],
      uploadedByUser: [
        { name: 'John Doe', count: 150 },
        { name: 'Jane Smith', count: 120 },
        { name: 'Robert Brown', count: 100 },
        { name: 'Sarah Wilson', count: 90 },
        { name: 'Michael Lee', count: 80 },
      ],
      uploadedPerMonth: [
        { month: 'Jan', 'Commercial Property': 40, 'General Liability': 30, 'Commercial Auto': 20, 'Business Owners': 15 },
        { month: 'Feb', 'Commercial Property': 45, 'General Liability': 35, 'Commercial Auto': 22, 'Business Owners': 18 },
        { month: 'Mar', 'Commercial Property': 50, 'General Liability': 40, 'Commercial Auto': 25, 'Business Owners': 20 },
        { month: 'Apr', 'Commercial Property': 48, 'General Liability': 38, 'Commercial Auto': 24, 'Business Owners': 19 },
        { month: 'May', 'Commercial Property': 55, 'General Liability': 42, 'Commercial Auto': 28, 'Business Owners': 22 },
        { month: 'Jun', 'Commercial Property': 60, 'General Liability': 45, 'Commercial Auto': 30, 'Business Owners': 25 },
      ],
      requestsExtended: [
        { agency: 'Alpha Ins', 'Subscription Limit': 20, 'Update Limit': 12 },
        { agency: 'Beta Risk', 'Subscription Limit': 35, 'Update Limit': 18 },
        { agency: 'Gamma Corp', 'Subscription Limit': 15, 'Update Limit': 8 },
        { agency: 'Delta Sec', 'Subscription Limit': 45, 'Update Limit': 25 },
      ],
      avgProcessingTime: [
        { name: 'John Doe', time: 45 },
        { name: 'Jane Smith', time: 52 },
        { name: 'Robert Brown', time: 38 },
        { name: 'Sarah Wilson', time: 55 },
        { name: 'Michael Lee', time: 42 },
      ],
    },
    'Alpha Insurance': {
      totalPolicies: 890,
      aiValidated: 620,
      reconciled: 520,
      pending: 110,
      submitted: 440,
      policiesByType: [
        { name: 'Commercial Property', value: 315 },
        { name: 'General Liability', value: 210 },
        { name: 'Commercial Umbrella', value: 105 },
        { name: 'Commercial Auto', value: 140 },
        { name: 'Business Owners', value: 126 },
        { name: 'Workers Compensation', value: 154 },
        { name: 'Professional Liability', value: 91 },
        { name: 'Cyber Liability', value: 63 },
        { name: 'Flood', value: 42 },
        { name: 'EPLI', value: 35 },
      ],
      policiesByPreparedBy: [
        { name: 'Senior Underwriter', value: 378 },
        { name: 'Junior Underwriter', value: 224 },
        { name: 'Risk Analyst', value: 147 },
        { name: 'Claims Manager', value: 105 },
      ],
      policyByStatus: [
        { name: 'Uploaded', value: 140 },
        { name: 'AI Validated', value: 315 },
        { name: 'Reconciled', value: 210 },
        { name: 'Checklist Submitted', value: 175 },
        { name: 'Checklist Pending', value: 70 },
      ],
      completedPerMonth: [
        { month: 'Jan', 'Commercial Property': 28, 'General Liability': 21, 'Commercial Auto': 14, 'Workers Comp': 17 },
        { month: 'Feb', 'Commercial Property': 31, 'General Liability': 24, 'Commercial Auto': 15, 'Workers Comp': 19 },
        { month: 'Mar', 'Commercial Property': 35, 'General Liability': 28, 'Commercial Auto': 17, 'Workers Comp': 21 },
        { month: 'Apr', 'Commercial Property': 33, 'General Liability': 26, 'Commercial Auto': 16, 'Workers Comp': 22 },
        { month: 'May', 'Commercial Property': 38, 'General Liability': 29, 'Commercial Auto': 19, 'Workers Comp': 24 },
        { month: 'Jun', 'Commercial Property': 42, 'General Liability': 31, 'Commercial Auto': 21, 'Workers Comp': 26 },
      ],
      requestsRaised: [
        { agency: 'Alpha Ins', requests: 84, resolved: 70 },
      ],
      uploadedByUser: [
        { name: 'John Doe', count: 105 },
        { name: 'Jane Smith', count: 84 },
        { name: 'Robert Brown', count: 70 },
      ],
      uploadedPerMonth: [
        { month: 'Jan', 'Commercial Property': 28, 'General Liability': 21, 'Commercial Auto': 14, 'Business Owners': 10 },
        { month: 'Feb', 'Commercial Property': 31, 'General Liability': 24, 'Commercial Auto': 15, 'Business Owners': 12 },
        { month: 'Mar', 'Commercial Property': 35, 'General Liability': 28, 'Commercial Auto': 17, 'Business Owners': 14 },
        { month: 'Apr', 'Commercial Property': 33, 'General Liability': 26, 'Commercial Auto': 16, 'Business Owners': 13 },
        { month: 'May', 'Commercial Property': 38, 'General Liability': 29, 'Commercial Auto': 19, 'Business Owners': 15 },
        { month: 'Jun', 'Commercial Property': 42, 'General Liability': 31, 'Commercial Auto': 21, 'Business Owners': 17 },
      ],
      requestsExtended: [
        { agency: 'Alpha Ins', 'Subscription Limit': 14, 'Update Limit': 8 },
      ],
      avgProcessingTime: [
        { name: 'John Doe', time: 42 },
        { name: 'Jane Smith', time: 48 },
        { name: 'Robert Brown', time: 35 },
      ],
    },
    'Beta Risk Solutions': {
      totalPolicies: 1540,
      aiValidated: 1070,
      reconciled: 895,
      pending: 188,
      submitted: 758,
      policiesByType: [
        { name: 'Commercial Property', value: 540 },
        { name: 'General Liability', value: 360 },
        { name: 'Commercial Umbrella', value: 180 },
        { name: 'Commercial Auto', value: 240 },
        { name: 'Business Owners', value: 216 },
        { name: 'Workers Compensation', value: 264 },
        { name: 'Professional Liability', value: 156 },
        { name: 'Cyber Liability', value: 108 },
        { name: 'Flood', value: 72 },
        { name: 'EPLI', value: 60 },
      ],
      policiesByPreparedBy: [
        { name: 'Senior Underwriter', value: 648 },
        { name: 'Junior Underwriter', value: 384 },
        { name: 'Risk Analyst', value: 252 },
        { name: 'Claims Manager', value: 180 },
      ],
      policyByStatus: [
        { name: 'Uploaded', value: 240 },
        { name: 'AI Validated', value: 540 },
        { name: 'Reconciled', value: 360 },
        { name: 'Checklist Submitted', value: 300 },
        { name: 'Checklist Pending', value: 120 },
      ],
      completedPerMonth: [
        { month: 'Jan', 'Commercial Property': 48, 'General Liability': 36, 'Commercial Auto': 24, 'Workers Comp': 30 },
        { month: 'Feb', 'Commercial Property': 54, 'General Liability': 42, 'Commercial Auto': 26, 'Workers Comp': 33 },
        { month: 'Mar', 'Commercial Property': 60, 'General Liability': 48, 'Commercial Auto': 30, 'Workers Comp': 36 },
        { month: 'Apr', 'Commercial Property': 57, 'General Liability': 45, 'Commercial Auto': 28, 'Workers Comp': 38 },
        { month: 'May', 'Commercial Property': 66, 'General Liability': 50, 'Commercial Auto': 33, 'Workers Comp': 42 },
        { month: 'Jun', 'Commercial Property': 72, 'General Liability': 54, 'Commercial Auto': 36, 'Workers Comp': 45 },
      ],
      requestsRaised: [
        { agency: 'Beta Risk', requests: 180, resolved: 156 },
      ],
      uploadedByUser: [
        { name: 'John Doe', count: 180 },
        { name: 'Jane Smith', count: 144 },
        { name: 'Robert Brown', count: 120 },
        { name: 'Sarah Wilson', count: 108 },
      ],
      uploadedPerMonth: [
        { month: 'Jan', 'Commercial Property': 48, 'General Liability': 36, 'Commercial Auto': 24, 'Business Owners': 18 },
        { month: 'Feb', 'Commercial Property': 54, 'General Liability': 42, 'Commercial Auto': 26, 'Business Owners': 21 },
        { month: 'Mar', 'Commercial Property': 60, 'General Liability': 48, 'Commercial Auto': 30, 'Business Owners': 24 },
        { month: 'Apr', 'Commercial Property': 57, 'General Liability': 45, 'Commercial Auto': 28, 'Business Owners': 22 },
        { month: 'May', 'Commercial Property': 66, 'General Liability': 50, 'Commercial Auto': 33, 'Business Owners': 26 },
        { month: 'Jun', 'Commercial Property': 72, 'General Liability': 54, 'Commercial Auto': 36, 'Business Owners': 30 },
      ],
      requestsExtended: [
        { agency: 'Beta Risk', 'Subscription Limit': 42, 'Update Limit': 21 },
      ],
      avgProcessingTime: [
        { name: 'John Doe', time: 48 },
        { name: 'Jane Smith', time: 55 },
        { name: 'Robert Brown', time: 40 },
        { name: 'Sarah Wilson', time: 58 },
      ],
    },
    'Gamma Global': {
      totalPolicies: 642,
      aiValidated: 446,
      reconciled: 372,
      pending: 78,
      submitted: 316,
      policiesByType: [
        { name: 'Commercial Property', value: 225 },
        { name: 'General Liability', value: 150 },
        { name: 'Commercial Umbrella', value: 75 },
        { name: 'Commercial Auto', value: 100 },
        { name: 'Business Owners', value: 90 },
        { name: 'Workers Compensation', value: 110 },
        { name: 'Professional Liability', value: 65 },
        { name: 'Cyber Liability', value: 45 },
        { name: 'Flood', value: 30 },
        { name: 'EPLI', value: 25 },
      ],
      policiesByPreparedBy: [
        { name: 'Senior Underwriter', value: 270 },
        { name: 'Junior Underwriter', value: 160 },
        { name: 'Risk Analyst', value: 105 },
        { name: 'Claims Manager', value: 75 },
      ],
      policyByStatus: [
        { name: 'Uploaded', value: 100 },
        { name: 'AI Validated', value: 225 },
        { name: 'Reconciled', value: 150 },
        { name: 'Checklist Submitted', value: 125 },
        { name: 'Checklist Pending', value: 50 },
      ],
      completedPerMonth: [
        { month: 'Jan', 'Commercial Property': 20, 'General Liability': 15, 'Commercial Auto': 10, 'Workers Comp': 12 },
        { month: 'Feb', 'Commercial Property': 22, 'General Liability': 17, 'Commercial Auto': 11, 'Workers Comp': 14 },
        { month: 'Mar', 'Commercial Property': 25, 'General Liability': 20, 'Commercial Auto': 12, 'Workers Comp': 15 },
        { month: 'Apr', 'Commercial Property': 24, 'General Liability': 19, 'Commercial Auto': 12, 'Workers Comp': 16 },
        { month: 'May', 'Commercial Property': 27, 'General Liability': 21, 'Commercial Auto': 14, 'Workers Comp': 17 },
        { month: 'Jun', 'Commercial Property': 30, 'General Liability': 22, 'Commercial Auto': 15, 'Workers Comp': 19 },
      ],
      requestsRaised: [
        { agency: 'Gamma Corp', requests: 40, resolved: 37 },
      ],
      uploadedByUser: [
        { name: 'Robert Brown', count: 50 },
        { name: 'Sarah Wilson', count: 45 },
      ],
      uploadedPerMonth: [
        { month: 'Jan', 'Commercial Property': 20, 'General Liability': 15, 'Commercial Auto': 10, 'Business Owners': 7 },
        { month: 'Feb', 'Commercial Property': 22, 'General Liability': 17, 'Commercial Auto': 11, 'Business Owners': 8 },
        { month: 'Mar', 'Commercial Property': 25, 'General Liability': 20, 'Commercial Auto': 12, 'Business Owners': 10 },
        { month: 'Apr', 'Commercial Property': 24, 'General Liability': 19, 'Commercial Auto': 12, 'Business Owners': 9 },
        { month: 'May', 'Commercial Property': 27, 'General Liability': 21, 'Commercial Auto': 14, 'Business Owners': 11 },
        { month: 'Jun', 'Commercial Property': 30, 'General Liability': 22, 'Commercial Auto': 15, 'Business Owners': 12 },
      ],
      requestsExtended: [
        { agency: 'Gamma Corp', 'Subscription Limit': 7, 'Update Limit': 4 },
      ],
      avgProcessingTime: [
        { name: 'Robert Brown', time: 32 },
        { name: 'Sarah Wilson', time: 38 },
      ],
    },
  };

  const dataset = agencyDatasets[agencyName];

  if (!dataset) {
    return {
      kpis: {
        totalPolicies: 0,
        aiValidated: 0,
        reconciled: 0,
        pending: 0,
        submitted: 0,
        trends: {
          total: "0%",
          ai: "0%",
          reconciled: "0%",
          pending: "0%",
          submitted: "0%"
        }
      },
      policiesByType: [],
      policiesByPreparedBy: [],
      policyByStatus: [],
      completedPerMonth: [],
      requestsRaised: [],
      uploadedByUser: [],
      uploadedPerMonth: [],
      requestsExtended: [],
      avgProcessingTime: []
    };
  }

  return {
    kpis: {
      totalPolicies: Math.floor(dataset.totalPolicies * yearMultiplier),
      aiValidated: Math.floor(dataset.aiValidated * yearMultiplier),
      reconciled: Math.floor(dataset.reconciled * yearMultiplier),
      pending: Math.floor(dataset.pending * yearMultiplier),
      submitted: Math.floor(dataset.submitted * yearMultiplier),
      trends: {
        total: "12%",
        ai: "8%",
        reconciled: "5%",
        pending: "2%",
        submitted: "15%"
      }
    },
    policiesByType: dataset.policiesByType.map(item => ({ ...item, value: Math.floor(item.value * yearMultiplier) })),
    policiesByPreparedBy: dataset.policiesByPreparedBy.map(item => ({ ...item, value: Math.floor(item.value * yearMultiplier) })),
    policyByStatus: dataset.policyByStatus.map(item => ({ ...item, value: Math.floor(item.value * yearMultiplier) })),
    completedPerMonth: dataset.completedPerMonth.map(item => ({
      ...item,
      'Commercial Property': Math.floor(item['Commercial Property'] * yearMultiplier),
      'General Liability': Math.floor(item['General Liability'] * yearMultiplier),
      'Commercial Auto': Math.floor(item['Commercial Auto'] * yearMultiplier),
      'Workers Comp': Math.floor(item['Workers Comp'] * yearMultiplier)
    })),
    requestsRaised: dataset.requestsRaised.map(item => ({
      ...item,
      requests: Math.floor(item.requests * yearMultiplier),
      resolved: Math.floor(item.resolved * yearMultiplier)
    })),
    uploadedByUser: dataset.uploadedByUser.map(item => ({ ...item, count: Math.floor(item.count * yearMultiplier) })),
    uploadedPerMonth: dataset.uploadedPerMonth.map(item => ({
      ...item,
      'Commercial Property': Math.floor(item['Commercial Property'] * yearMultiplier),
      'General Liability': Math.floor(item['General Liability'] * yearMultiplier),
      'Commercial Auto': Math.floor(item['Commercial Auto'] * yearMultiplier),
      'Business Owners': Math.floor(item['Business Owners'] * yearMultiplier)
    })),
    requestsExtended: dataset.requestsExtended.map(item => ({
      ...item,
      'Subscription Limit': Math.floor(item['Subscription Limit'] * yearMultiplier),
      'Update Limit': Math.floor(item['Update Limit'] * yearMultiplier)
    })),
    avgProcessingTime: dataset.avgProcessingTime.map(item => ({ ...item, time: Math.floor(item.time * yearMultiplier) }))
  };
};

// --- COMPONENTS ---

const KPIChart = ({ title, value, icon, iconColor }) => (
  <div className="group relative bg-white rounded-2xl border border-slate-100 p-4 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6 overflow-hidden">
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-tight">{title}</p>
        </div>
        <div className={`p-2.5 rounded-xl transition-all duration-500 ${iconColor.replace('bg-', 'bg-').replace('-600', '-50')} ${iconColor.replace('bg-', 'text-')} shadow-md group-hover:scale-110`}>
          {React.cloneElement(icon, { className: "w-4 h-4" })}
        </div>
      </div>
      
      <div>
        <p className="text-2xl font-bold text-slate-900 group-hover:text-[#1B3C53] transition-colors">
          {value.toLocaleString()}
        </p>
        
        <div className="flex items-center space-x-2 mt-3">
          <div className={`h-1 w-6 rounded-full transition-all duration-500 group-hover:w-10 ${iconColor}`}></div>
          <p className="text-[9px] text-slate-400 font-normal uppercase tracking-wider"></p>
        </div>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-500 ${className}`}>
    <div className="mb-6">
      <h3 className="text-[11px] font-semibold text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1B3C53]"></span>
        {title}
      </h3>
      {subtitle && <p className="text-[9px] text-slate-500 mt-1 ml-3.5 font-normal">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const AdminReports = () => {
  const [agency, setAgency] = useState('All Agencies');
  const [year, setYear] = useState('2024');
  const [agencies, setAgencies] = useState([]);

  const fetchAgencies = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const url = `${baseUrl.replace(/\/$/, '')}/agencies/get-all?includeInactive=false`;
      const response = await fetch(url, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });
      const data = await response.json();
      if (data.status === 'success' && data.data && Array.isArray(data.data)) {
        setAgencies(data.data);
      } else {
        setAgencies([]);
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setAgencies([]);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  const data = useMemo(() => {
    return getAgencyData(agency, year);
  }, [agency, year]);

  const handleExport = () => {
    const filename = `Reports_${agency.replace(/\s+/g, '_')}_${year}.xlsx`;
    console.log(`Exporting report: ${filename}`);
    // Export functionality would be implemented here
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
          
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-zoomIn { animation: zoomIn 0.2s ease-out forwards; }
        `}
      </style>

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30 relative z-[50]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="animate-fadeIn">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
            <p className="mt-0.5 text-sm text-slate-500 font-normal">
              Monitor and analyze policy processing metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-48 h-[42px] relative z-[10]">
              <CustomSelect
                label="Agency"
                value={agency}
                onChange={setAgency}
                options={[
                  { value: 'All Agencies', label: 'All Agencies' },
                  ...agencies
                    .filter((agencyOption, index, self) => 
                      index === self.findIndex(a => a.agency_name === agencyOption.agency_name)
                    )
                    .map((agencyOption, index) => ({
                      value: agencyOption.agency_name,
                      label: agencyOption.agency_name,
                      key: `${agencyOption.agency_name}-${agencyOption.id || agencyOption.agency_id || index}`
                    }))
                ]}
                hideSelectOption
              />
            </div>

            <div className="w-28 h-[42px] relative z-[10]">
              <CustomSelect
                label="Year"
                value={year}
                onChange={setYear}
                options={[
                  { value: 'All Years', label: 'All Years' },
                  { value: '2024', label: '2024' },
                  { value: '2023', label: '2023' },
                  { value: '2022', label: '2022' },
                  { value: '2021', label: '2021' },
                  { value: '2020', label: '2020' },
                  { value: '2019', label: '2019' },
                  { value: '2018', label: '2018' },
                  { value: '2017', label: '2017' },
                  { value: '2016', label: '2016' },
                  { value: '2015', label: '2015' }
                ]}
                hideSelectOption
              />
            </div>

            <button onClick={handleExport} className="h-[42px] px-4 bg-emerald-600 text-[10px] font-medium uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-900/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 text-white whitespace-nowrap mt-12">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-50/20">
        {/* KPI Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <KPIChart 
            title="Total Policies"
            value={data.kpis.totalPolicies} 
            iconColor="bg-blue-600"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
          />
          <KPIChart 
            title="AI Validated"
            value={data.kpis.aiValidated} 
            iconColor="bg-emerald-600"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17l6-6 4 4 8-8" />
              </svg>
            }
          />
          <KPIChart 
            title="Reconciled"
            value={data.kpis.reconciled} 
            iconColor="bg-amber-600"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
          <KPIChart 
            title="Pending"
            value={data.kpis.pending} 
            iconColor="bg-orange-600"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <KPIChart 
            title="Submitted"
            value={data.kpis.submitted} 
            iconColor="bg-purple-600"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
              </svg>
            }
          />
        </div>

        {/* Analytics Section — Donut Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ChartCard title="Policy Types" subtitle="Distribution across insurance categories">
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={data.policiesByType}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-out"
                >
                  {data.policiesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#1B3C53', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                />
                <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold', paddingTop: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Team Performance" subtitle="Workload by team member">
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={data.policiesByPreparedBy}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-out"
                >
                  {data.policiesByPreparedBy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#1B3C53', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                />
                <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold', paddingTop: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Status Overview" subtitle="Current processing status">
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={data.policyByStatus}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-out"
                >
                  {data.policyByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#1B3C53', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                />
                <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '9px', color: '#64748b', fontWeight: 'bold', paddingTop: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Multi-Line Chart — Policies Completed Per Month */}
        <div className="mb-6">
          <ChartCard title="Monthly Trends" subtitle="Performance over time">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.completedPerMonth}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ paddingTop: '25px', fontSize: '9px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                <Line type="monotone" dataKey="Commercial Property" stroke={COLORS[0]} strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="General Liability" stroke={COLORS[1]} strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="Commercial Auto" stroke={COLORS[2]} strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="Workers Comp" stroke={COLORS[3]} strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Bottom Row — Bar Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Requests & Issues" subtitle="Inquiries and resolutions">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.requestsRaised}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="agency" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ paddingTop: '25px', fontSize: '9px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                <Bar dataKey="requests" name="Inquiries" fill={COLORS[0]} radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="resolved" name="Resolutions" fill={COLORS[2]} radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="User Activity" subtitle="Contributions by team">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={data.uploadedByUser}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                />
                <Bar dataKey="count" name="Policies" fill={COLORS[1]} radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ChartCard title="Monthly Distribution" subtitle="Breakdown by category">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.uploadedPerMonth}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ paddingTop: '25px', fontSize: '9px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                <Bar dataKey="Commercial Property" stackId="a" fill={COLORS[0]} barSize={40} />
                <Bar dataKey="General Liability" stackId="a" fill={COLORS[1]} barSize={40} />
                <Bar dataKey="Commercial Auto" stackId="a" fill={COLORS[2]} barSize={40} />
                <Bar dataKey="Business Owners" stackId="a" fill={COLORS[3]} radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Processing Time" subtitle="Average time per user">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart layout="vertical" data={data.avgProcessingTime}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                />
                <Bar dataKey="time" name="Avg Minutes" fill={COLORS[4]} radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
