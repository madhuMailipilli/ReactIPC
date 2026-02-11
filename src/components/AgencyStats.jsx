import React, { useMemo } from "react";
import { useSubscriptionUsage } from "../hooks/useDocuments";
import { useAgencies } from "../hooks/useAgencies";

const AgencyStats = () => {
  const { data: response, isLoading: usageLoading } = useSubscriptionUsage();
  const { data: agencies = [], isLoading: agenciesLoading } = useAgencies(false, 1, 1000, '', false);
  const usageData = response?.data?.data || [];

  const isLoading = usageLoading || agenciesLoading;

  const stats = useMemo(() => {
    const agencyMap = agencies.reduce((acc, agency) => {
      acc[agency.id || agency.agency_id] = agency.agency_name;
      return acc;
    }, {});

    const recentUploads = usageData.map((item) => ({
      id: item.agency_id,
      agency: agencyMap[item.agency_id],
      count: item.documents_processed || 0,
    }));

    const totalUploads = recentUploads.reduce((sum, upload) => sum + upload.count, 0);

    return {
      totalAgencies: usageData.length,
      totalUploads,
      recentUploads,
    };
  }, [usageData, agencies]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 h-full overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <div className="w-32 h-6 bg-slate-100 rounded-lg animate-pulse"></div>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="h-20 bg-slate-50 rounded-xl animate-pulse"></div>
            <div className="h-20 bg-slate-50 rounded-xl animate-pulse"></div>
          </div>
          <div className="space-y-2 pt-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-slate-50 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5">
      <div className="p-4 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Agency Statistics
        </h3>
        <p className="text-[10px] font-medium text-slate-500 mt-0.5">
          Overview and recent activity
        </p>
      </div>

      <div className="p-4 border-b border-slate-50 bg-slate-50/20">
        {/* Key Metrics - Static */}
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#1B3C53] to-[#2D5A7B] rounded-xl p-4 shadow-lg shadow-blue-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-bl-2xl -mr-3 -mt-3 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white/80 mb-0.5">
                  Total Agencies
                </p>
                <p className="text-xl font-bold text-white">
                  {stats.totalAgencies}
                </p>
              </div>
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700 mb-0.5">
                  Total Uploads
                </p>
                <p className="text-xl font-bold text-[#1B3C53]">
                  {stats.totalUploads.toLocaleString()}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-emerald-600"
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
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        {/* Recent Uploads - Scrollable */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #E2E8F0;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #CBD5E1;
          }
        `,
          }}
        />
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">
            Recent Onboarding
          </h4>
          <div className="space-y-2">
            {stats.recentUploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center justify-between p-3 bg-slate-200 rounded-xl"
              >
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[9px] font-medium text-[#1B3C53] shadow-sm">
                    {upload.agency?.charAt(0)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {upload.agency}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider rounded-md bg-[#1B3C53]/5 text-[#1B3C53]">
                    {upload.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyStats;
