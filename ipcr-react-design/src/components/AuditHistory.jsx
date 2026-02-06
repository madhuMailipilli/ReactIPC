import React, { useState, useEffect } from 'react';

const AuditHistory = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call when audit logs endpoint is available
      // const response = await authService.getAuditLogs();
      // if (response.success) {
      //   setAuditLogs(response.data);
      // }
      setAuditLogs([]);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = auditLogs.filter(log => 
    log.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.preparedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    const headers = ['SNo.', 'Client Name', 'Policy Number', 'Check List Prepared By', 'Policy Term'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map((log, index) => [
        index + 1,
        `"${log.clientName}"`,
        `"${log.policyNumber}"`,
        `"${log.preparedBy}"`,
        `"${log.policyTerm}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="w-48 h-7 bg-slate-100 rounded-lg animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-100 rounded-md w-3/4 animate-pulse"></div>
                <div className="h-2.5 bg-slate-100 rounded-md w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5">
      <div className="p-6 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between">
          <div className="flex flex-col space-y-3 xl:space-y-0 xl:flex-row xl:items-center xl:space-x-6">
            <div className="flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Audit History</h3>
              <p className="text-[10px] font-medium text-slate-500 mt-0.5">Recent system activities and logs</p>
            </div>
            
            <div className="relative w-full max-w-sm xl:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400 group-focus-within:text-[#1B3C53] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] focus:bg-white transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownload}
              className="inline-flex items-center px-5 py-2.5 shadow-lg shadow-blue-900/10 text-xs font-medium rounded-xl text-white transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{ backgroundColor: "#1B3C53" }}
            >
              <svg className="-ml-1 mr-2 h-4 w-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>
      <div className="p-0 overflow-x-auto custom-scrollbar" style={{ minHeight: '500px' }}>
        <table className="w-full border-collapse h-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">SNo.</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Client Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Policy Number</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Prepared By</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Term</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLogs.map((log, index) => (
              <tr key={log.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap text-[10px] font-medium text-slate-400 tracking-tighter">{String(index + 1).padStart(2, '0')}</td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-xs font-medium text-slate-900 group-hover:text-[#1B3C53] transition-colors">{log.clientName}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-[11px] text-slate-500 font-mono tracking-tight">{log.policyNumber}</td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-medium text-slate-500">
                      {log.preparedBy?.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-slate-600">{log.preparedBy}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-medium uppercase tracking-wider bg-blue-50 text-[#1B3C53] border border-blue-100/50 shadow-sm shadow-blue-100/20">
                    {log.policyTerm}
                  </span>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="5" className="h-full">
                  <div className="flex items-center justify-center" style={{ minHeight: '440px' }}>
                    <div className="flex flex-col items-center max-w-xs">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-slate-900 mb-1">No Activities Found</h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Your search didn't return any logs. Try refining your filters.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditHistory;
