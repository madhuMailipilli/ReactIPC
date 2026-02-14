import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadDoc from "./UploadDoc";
import CustomSelect from "../../components/CustomSelect";
import documentLogo from "../../assets/upload.png";
import { useAuth } from "../../components/AuthContext";
import { useUploadDocuments } from "../../hooks/useDocuments";
import { useUser } from "../../hooks/useUsers";

const Document = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const uploadMutation = useUploadDocuments();
  const userId = user?.id || user?.user_id || user?.userId;
  const { data: userDetails, isLoading: userLoading } = useUser(userId);
  const [classification, setClassification] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [files, setFiles] = useState({
    policy: null,
    binder: null,
    acord: null,
    priorPolicy: null,
    proposal: null,
    quote: null,
    endorsement: null,
  });

  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleCancel = () => {
    setClassification("");
    setFiles({
      policy: null,
      binder: null,
      acord: null,
      priorPolicy: null,
      proposal: null,
      quote: null,
      endorsement: null,
    });
    setShowError(false);
  };

  const handleSubmit = () => {
    const errors = [];
    if (!classification) errors.push("Classification");
    if (!files.policy) errors.push("Policy document");

    if (errors.length > 0) {
      setErrorMessage(
        `${errors.join(" and ")} ${errors.length > 1 ? "are" : "is"} required`,
      );
      setShowError(true);
      return;
    }

    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    try {
      const formData = new FormData();
      Object.values(files).forEach((file) => {
        if (file) {
          formData.append('documents', file);
        }
      });
      
      const agencyId =
        userDetails?.agencies?.[0]?.id ||
        userDetails?.agencies?.[0]?.agency_id;
      if (!agencyId) {
        setErrorMessage(userLoading ? 'Fetching agency details...' : 'Unable to identify agency.');
        setShowError(true);
        return;
      }
      
      formData.append('agency_id', agencyId);
      await uploadMutation.mutateAsync(formData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleCancel();
        navigate("/agent");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Failed to upload documents');
      setShowError(true);
    }
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const uploadedCount = Object.values(files).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-4 animate-in fade-in duration-500">
      {/* Sleek Compact Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
            <img src={documentLogo} alt="Icon" className="w-14 h-14 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Document Submission</h1>
            <p className="text-sm text-slate-500 font-medium">Manage and upload your insurance policies securely.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
            <p className={`text-sm font-bold ${files.policy ? 'text-emerald-500' : 'text-amber-500'}`}>
              {files.policy ? 'Ready to Submit' : 'Policy Required'}
            </p>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploadMutation.isPending || !files.policy || !classification}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg
                ${uploadMutation.isPending || !files.policy || !classification
                  ? 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                  : 'bg-[#1B3C53] text-white hover:bg-[#152e42] shadow-blue-900/10'}
              `}
            >
              {uploadMutation.isPending ? 'Processing...' : 'Submit Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Control Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Information</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Upload Channel
                </label>
                <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-semibold text-slate-600">
                  Insurance Policy
                </div>
              </div>

              <CustomSelect
                label="Classification"
                value={classification}
                onChange={(value) => setClassification(value)}
                options={[
                  { value: "Cyber Liability", label: "Cyber Liability" },
                  { value: "Commercial Package", label: "Commercial Package" },
                  { value: "Commercial Auto", label: "Commercial Auto" },
                  { value: "General Liability", label: "General Liability" },
                  { value: "Business Owners", label: "Business Owners" },
                  { value: "Commercial Property", label: "Commercial Property" },
                  { value: "Worker Compensation", label: "Worker Compensation" },
                  { value: "Epli", label: "Epli" },
                  { value: "Directors and Officers", label: "Directors and Officers" },
                  { value: "Dwelling Fire", label: "Dwelling Fire" },
                ]}
                hideSelectOption
                enableAlphabeticSearch={true}
              />
            </div>
          </div>

          <div className="bg-[#1B3C53] rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest">Requirements</h4>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-xs font-medium text-blue-100">
                <div className={`w-1.5 h-1.5 rounded-full ${files.policy ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                Policy Document (Required)
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-blue-200">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                Max file size: 10MB
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-blue-200">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                PDF, DOCX, JPG supported
              </li>
            </ul>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Policy Documents</h3>
                <p className="text-xs text-slate-400 font-medium">Select or drag documents into the appropriate slots.</p>
              </div>
              <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                {uploadedCount} File{uploadedCount !== 1 ? 's' : ''} Uploaded
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <UploadDoc
                label="Policy*"
                file={files.policy}
                onFileChange={(file) => handleFileChange("policy", file)}
              />
              <UploadDoc
                label="Binder"
                file={files.binder}
                onFileChange={(file) => handleFileChange("binder", file)}
              />
              <UploadDoc
                label="ACORD"
                file={files.acord}
                onFileChange={(file) => handleFileChange("acord", file)}
              />
              <UploadDoc
                label="Prior Policy"
                file={files.priorPolicy}
                onFileChange={(file) => handleFileChange("priorPolicy", file)}
              />
              <UploadDoc
                label="Proposal"
                file={files.proposal}
                onFileChange={(file) => handleFileChange("proposal", file)}
              />
              <UploadDoc
                label="Quote"
                file={files.quote}
                onFileChange={(file) => handleFileChange("quote", file)}
              />
              <UploadDoc
                label="Endorsement"
                file={files.endorsement}
                onFileChange={(file) => handleFileChange("endorsement", file)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Pop Notifications */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right duration-500">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 pr-12 flex items-center gap-4 border border-white/10 backdrop-blur-md">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold">Successfully Uploaded</p>
              <p className="text-[11px] text-slate-400">Processing documents...</p>
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right duration-500">
          <div className="bg-white rounded-2xl shadow-2xl p-4 pr-12 flex items-center gap-4 border border-rose-100">
            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Submission Error</p>
              <p className="text-[11px] text-slate-500">{errorMessage}</p>
            </div>
            <button onClick={() => setShowError(false)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Confirm Upload</h3>
                  <p className="text-sm text-slate-600 mt-0.5">Ready to submit {uploadedCount} document{uploadedCount !== 1 ? 's' : ''}?</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 px-4 py-2.5 bg-[#1B3C53] hover:bg-[#152e42] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Document;
