import React from 'react';
import { useAuth } from '../../components/AuthContext';
import { useDocumentsByAgency } from '../../hooks/useDocuments';

const DocumentsList = () => {
  const { user } = useAuth();
  const agencyId = user?.agency_id || user?.agencyId || localStorage.getItem('agencyId');
  const { data: response, isLoading, error } = useDocumentsByAgency(agencyId);

  const documents = Array.isArray(response) ? response : response?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#1B3C53]/10 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[10px] font-black text-[#1B3C53] uppercase tracking-[0.3em] animate-pulse mt-8">Loading Documents</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20">
        <div className="bg-white rounded-[2.5rem] border border-rose-100 p-12 text-center shadow-[0_20px_50px_rgba(225,29,72,0.05)]">
          <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight uppercase">Error Loading Documents</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">{error.message || 'Failed to load documents'}</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(27,60,83,0.05)] border border-slate-100 p-20 text-center">
        <div className="w-28 h-28 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-14 h-14 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">No Documents</h3>
        <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">You haven't uploaded any documents yet. Start by uploading your insurance documents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-8 shadow-xl shadow-blue-900/10 relative overflow-hidden border border-white" style={{ background: "linear-gradient(135deg, #1B3C53 0%, #2D5A7B 100%)" }}>
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
            <div className="absolute -inset-2 bg-white/20 rounded-2xl blur-lg"></div>
            <div className="relative w-14 h-14 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-inner">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">Your Documents</h1>
            <p className="text-white/70 text-xs font-medium mt-2">View and manage your uploaded documents</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(27,60,83,0.05)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={doc.id || index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-900">{doc.name || doc.filename || 'Document'}</p>
                        <p className="text-[11px] text-slate-500">{doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] text-slate-600">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
                      {doc.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentsList;
