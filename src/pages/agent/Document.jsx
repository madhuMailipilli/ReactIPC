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

  const handleSubmit = async () => {
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

    try {
      const formData = new FormData();
      
      // Add all selected files
      Object.values(files).forEach((file) => {
        if (file) {
          formData.append('documents', file);
        }
      });
      
      // Get agency ID from getById response (agencies array)
      const agencyId =
        userDetails?.agencies?.[0]?.id ||
        userDetails?.agencies?.[0]?.agency_id;
      if (!agencyId) {
        setErrorMessage(userLoading ? 'Fetching agency details. Please try again.' : 'Unable to identify agency. Please log in again.');
        setShowError(true);
        return;
      }
      
      // Append agency_id
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
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <div className="flex flex-col space-y-4 pl-0 pr-0 pt-2 pb-6">
      {/* Header */}
      <div className="rounded-2xl border-none p-6 shadow-xl shadow-blue-900/10 relative overflow-hidden bg-[#1B3C53]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="absolute -inset-1 bg-white/20 rounded-xl blur-sm"></div>
              <div className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20 backdrop-blur-md bg-white/10">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Document Upload Center
              </h1>
              <p className="text-white/70 text-[13px] font-medium max-w-xl mt-1">
                Securely upload and process your insurance documents with our
                advanced validation system.
              </p>
            </div>
          </div>
        </div>

        <img
          src={documentLogo}
          alt="Document Upload"
          className="absolute top-1/2 right-6 -translate-y-1/2 h-40 w-40 md:h-48 md:w-48 object-contain opacity-70 drop-shadow-lg pointer-events-none"
        />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Form Section */}
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/10 border border-slate-100">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-[#1B3C53]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-[#1B3C53]">
              Document Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[9px] font-medium text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Document Channel
              </label>
              <div className="relative">
                <input
                  type="text"
                  value="Insurance Policy"
                  disabled
                  className="w-full px-4 py-2.5 border border-slate-100 rounded-xl bg-slate-50 text-slate-500 text-[13px] font-semibold"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-4 h-4 text-slate-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
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
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/10 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/30">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Upload Documents
                </h3>
                <p className="text-xs text-slate-600">Select and upload your insurance policy documents</p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-slate-100 rounded-lg">
              <span className="text-xs font-semibold text-slate-700">
                {Object.values(files).filter(Boolean).length} / {Object.keys(files).length}
              </span>
              <span className="text-xs text-slate-500 ml-1">uploaded</span>
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

        {/* Buttons */}
        <div className="flex justify-end pt-2 gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 text-[13px] font-medium rounded-xl transition-all bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploadMutation.isPending}
            className="px-6 py-2 text-[13px] font-medium rounded-xl transition-all bg-[#1B3C53] text-white hover:bg-[#1B3C53]/90 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploadMutation.isPending ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Submit Documents'
            )}
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white rounded-lg shadow-xl border border-emerald-200 p-3 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="flex-1 text-sm text-gray-900">Documents uploaded successfully!</p>
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-white rounded-lg shadow-xl border border-red-200 p-3 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="flex-1 text-sm text-gray-900">{errorMessage}</p>
              <button
                onClick={() => setShowError(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Document;
