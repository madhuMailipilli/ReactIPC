import React, { useState, useRef } from 'react';

const UploadDoc = ({ label, file, onFileChange }) => {
  const fileInputRef = useRef(null);
  const isRequired = label.includes('*');
  const cleanLabel = label.replace('*', '');

  return (
    <div className="border border-slate-300 rounded-2xl p-4 transition-all bg-white hover:shadow-xl hover:shadow-blue-900/5 hover:border-slate-400">
      <div className="flex items-center justify-between gap-3 w-full mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B3C53] to-[#2d5573] flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          
          {/* Label and status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[13px] font-semibold text-[#1B3C53]">{cleanLabel}</span>
              {isRequired && (
                <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-semibold rounded border border-red-200">Required</span>
              )}
            </div>
            
            {file && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-[11px] font-medium text-slate-500 truncate">{file.name}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action button */}
        <button
          type="button"
          className="px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all flex-shrink-0 bg-[#1B3C53] text-white hover:bg-[#1B3C53]/90 flex items-center gap-2 shadow-lg shadow-blue-900/10"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current.click();
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            {file ? (
              <>
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </>
            ) : (
              <>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" x2="12" y1="3" y2="15"></line>
              </>
            )}
          </svg>
          {file ? 'Replace' : 'Upload'}
        </button>
      </div>
      
      {/* File remove option */}
      {file && (
        <div className="pt-2 border-t border-slate-200">
          <button
            type="button"
            className="text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null);
            }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove file
          </button>
        </div>
      )}
      
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={(e) => onFileChange(e.target.files[0])}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default UploadDoc;
