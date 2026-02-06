import React, { useState } from 'react';

const PendingTasks = () => {
  const [activeTab, setActiveTab] = useState('Reconcile');

  const tasks = [
    { id: 1, name: 'Policy Review - Auto Insurance', date: '2024-01-15', user: 'JD', gradient: 'from-blue-500 to-blue-600' },
    { id: 2, name: 'Document Verification', date: '2024-01-14', user: 'SM', gradient: 'from-orange-500 to-orange-600' },
    { id: 3, name: 'Compliance Check', date: '2024-01-13', user: 'RK', gradient: 'from-green-500 to-green-600' },
    { id: 4, name: 'Risk Assessment', date: '2024-01-12', user: 'AL', gradient: 'from-purple-500 to-purple-600' },
    { id: 5, name: 'Premium Calculation', date: '2024-01-11', user: 'MJ', gradient: 'from-red-500 to-red-600' },
    { id: 6, name: 'Client Interview', date: '2024-01-10', user: 'TW', gradient: 'from-indigo-500 to-indigo-600' }
  ];

  return (
    <div className="relative bg-white rounded-2xl border border-white h-full w-full flex flex-col overflow-hidden shadow-xl shadow-blue-900/10 transition-all duration-300">
      <div className="flex-shrink-0 p-4 border-b border-slate-50 bg-slate-50/30 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Pending Tasks <span className="text-[#1B3C53] font-bold ml-1">(15)</span></h2>
        <div className="flex mt-2 gap-3">
          {['Reconcile', 'Review Checklist'].map((tab) => (
            <label key={tab} className="flex items-center space-x-2 cursor-pointer group/label">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={activeTab === tab}
                  onChange={() => setActiveTab(tab)}
                  className="peer w-3.5 h-3.5 opacity-0 absolute cursor-pointer"
                />
                <div className={`w-3.5 h-3.5 rounded border-2 transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-[#1B3C53] border-[#1B3C53]' 
                    : 'border-slate-300 bg-white group-hover/label:border-[#1B3C53]'
                }`}>
                  {activeTab === tab && (
                    <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className={`text-[10px] font-medium uppercase tracking-wider transition-colors ${
                activeTab === tab ? 'text-[#1B3C53]' : 'text-slate-400 group-hover/label:text-slate-600'
              }`}>{tab}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-2 p-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="group/task relative flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-slate-50 hover:border-slate-200 cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex-shrink-0 w-1 h-8 bg-[#1B3C53] rounded-full group-hover/task:h-10 transition-all duration-300"></div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-slate-700 group-hover/task:text-[#1B3C53] transition-colors leading-tight">
                  {task.name}
                </p>
                <div className="flex items-center mt-1.5 space-x-3">
                  <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider flex items-center space-x-1">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span>{task.date}</span>
                  </span>
                  <div className="px-1.5 py-0.5 bg-[#1B3C53]/5 rounded flex items-center justify-center border border-[#1B3C53]/10">
                    <span className="text-[9px] font-medium text-[#1B3C53]">{task.user}</span>
                  </div>
                </div>
              </div>
              <div className="self-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.5) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.7);
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: rgba(71, 85, 105, 0.9);
          background-clip: content-box;
        }
      `}</style>
    </div>
  );
};

export default PendingTasks;