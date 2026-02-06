import React from 'react';

const DocumentTable = () => {
  const documents = [
    { id: 'DOC001', name: 'Auto Policy Template', pages: 12, lob: 'Auto', uploaded: '2024-01-15', size: 245, status: 'Active' },
    { id: 'DOC002', name: 'Home Insurance Form', pages: 8, lob: 'Home', uploaded: '2024-01-14', size: 189, status: 'Active' },
    { id: 'DOC003', name: 'Life Policy Draft', pages: 15, lob: 'Life', uploaded: '2024-01-13', size: 312, status: 'Inactive' },
    { id: 'DOC004', name: 'Commercial Policy', pages: 20, lob: 'Commercial', uploaded: '2024-01-12', size: 456, status: 'Active' }
  ];

  const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider ${
      status === 'Active' 
        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
        : 'bg-rose-50 text-rose-600 border border-rose-100'
    }`}>
      {status}
    </span>
  );

  return (
    <div className="group relative bg-white rounded-2xl border border-white h-full flex flex-col overflow-hidden shadow-xl shadow-blue-900/10 transition-all duration-300">
      <div className="flex-shrink-0 relative z-10 p-4 border-b border-slate-50">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Document Details</h2>
          <p className="text-slate-500 text-[12px] font-medium mt-1">Manage and track your uploaded policy documents</p>
        </div>
        <div className="relative group/search">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full px-3 py-2 pl-10 border border-slate-100 rounded-xl bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] focus:bg-white transition-all duration-300 text-[12px] font-medium text-slate-700 placeholder-slate-400"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-[#1B3C53] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto relative z-10 custom-scrollbar">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50/50 sticky top-0 border-b border-slate-100 backdrop-blur-md">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Document Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Pages</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">LOB</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Uploaded</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Size (KB)</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {documents.map((doc, idx) => (
              <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors duration-200 group/row">
                <td className="px-4 py-3 text-[12px] font-medium text-[#1B3C53]">{doc.id}</td>
                <td className="px-4 py-3 text-[12px] text-slate-700 font-medium group-hover/row:text-[#1B3C53] transition-colors">{doc.name}</td>
                <td className="px-4 py-3 text-[12px] text-slate-500 font-medium">{doc.pages}</td>
                <td className="px-4 py-3 text-[12px]">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-50/50 text-blue-600 font-medium text-[9px] uppercase tracking-wider border border-blue-100/50">{doc.lob}</span>
                </td>
                <td className="px-4 py-3 text-[12px] text-slate-500 font-medium">{doc.uploaded}</td>
                <td className="px-4 py-3 text-[12px] text-slate-500 font-medium">{doc.size}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;