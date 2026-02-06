import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionPlans, useDeletePlan } from '../../hooks/useSubscriptions';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { data: plans, isLoading, error } = useSubscriptionPlans();
  const deletePlanMutation = useDeletePlan();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete) {
      try {
        await deletePlanMutation.mutateAsync(planToDelete.id);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        alert('Failed to delete plan');
      }
    }
    setShowDeleteModal(false);
    setPlanToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPlanToDelete(null);
  };

  const plansArray = Array.isArray(plans) ? plans : 
                    Array.isArray(plans?.data) ? plans.data :
                    Array.isArray(plans?.plans) ? plans.plans : [];

  const getFeatures = (plan) => {
    return [
      `Up to ${plan.max_documents} documents per upload`,
      `Valid for ${plan.validity_days} days`,
      "Document processing",
      "Email support",
      "Document history"
    ];
  };

  const isHighlighted = (planName) => {
    const name = planName.toLowerCase();
    return name.includes('organization') || name.includes('business') || (name.includes('pro') && !name.includes('starter') && !name.includes('professional'));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 text-sm font-medium tracking-widest uppercase animate-pulse">Loading Plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
            <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Error Loading Plans</h3>
          <p className="text-slate-400 text-sm mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-900/10"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`, backgroundSize: '24px 24px' }}></div>
        
      <style>
        {`
          .grid-background {
            background-image: linear-gradient(to right, #00000005 1px, transparent 1px),
                              linear-gradient(to bottom, #00000005 1px, transparent 1px);
            background-size: 40px 40px;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* Main Content */}
      <div className="relative pt-2 pb-4 px-6 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-background pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-transparent to-slate-50 pointer-events-none"></div>

        <div className="max-3xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 animate-fade-in gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Plans</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-none">
                Subscription Plans
              </h1>
            </div>
            <button 
              onClick={() => navigate('/admin/subscription/create-plan')}
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] transition-all hover:scale-105 hover:bg-black active:scale-95 shadow-lg shadow-slate-900/10"
            >
              Add Plan
            </button>
          </div>

          {/* Advanced Pricing Horizontal Scroll */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`group/plans flex overflow-x-auto gap-12 pb-10 pt-4 snap-x snap-mandatory no-scrollbar -mx-4 px-10 scroll-smooth ${isDragging ? 'cursor-grabbing select-none scroll-auto' : 'cursor-grab'}`}
          >
            {plansArray.map((plan, index) => {
              const highlighted = isHighlighted(plan.name);
              const features = getFeatures(plan);
              
              return (
                <div 
                  key={plan.id}
                  className={`group relative rounded-[2rem] overflow-hidden transition-all duration-500 ease-out animate-fade-in flex flex-col min-w-[280px] md:min-w-[310px] snap-center will-change-transform
                    group-hover/plans:scale-[0.92] group-hover/plans:opacity-50 group-hover/plans:blur-[1.5px] 
                    hover:!scale-[1.08] hover:!opacity-100 hover:!blur-none hover:z-50 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]
                    ${highlighted 
                      ? 'bg-white shadow-xl border-2 border-slate-900 mx-4' 
                      : 'bg-white border border-slate-100 hover:border-slate-300 shadow-sm'
                    }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 flex flex-col h-full">
                    {/* Admin Actions */}
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className={`text-lg font-bold mb-1 ${highlighted ? 'text-slate-900' : 'text-slate-900'}`}>
                          {plan.name}
                        </h3>
                        <p className={`text-xs ${highlighted ? 'text-slate-500' : 'text-slate-500'}`}>
                          Short explanation about pricing
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/subscription/edit-plan/${plan.id}`); }}
                          className={`p-2 rounded-lg transition-all ${highlighted ? 'bg-slate-50 hover:bg-slate-100 text-slate-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(plan); }}
                          className={`p-2 rounded-lg transition-all ${highlighted ? 'bg-rose-500/10 hover:bg-rose-500/20' : 'bg-rose-500/10 hover:bg-rose-500/20'} text-rose-500`}
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-black ${highlighted ? 'text-slate-900' : 'text-slate-900'}`}>
                          $ {parseFloat(plan.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                      {features.map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-start gap-3">
                          <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${highlighted ? 'bg-slate-100' : 'bg-slate-100'}`}>
                            <svg className={`w-2.5 h-2.5 ${highlighted ? 'text-slate-600' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className={`text-xs font-medium ${highlighted ? 'text-slate-600' : 'text-slate-600'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Limits Info */}
                    <div className={`mt-4 pt-4 border-t ${highlighted ? 'border-slate-100' : 'border-slate-100'}`}>
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                        <span className={highlighted ? 'text-slate-400' : 'text-slate-400'}>Docs Limit</span>
                        <span className={highlighted ? 'text-slate-900' : 'text-slate-900'}>{plan.max_documents}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold mt-2">
                        <span className={highlighted ? 'text-slate-400' : 'text-slate-400'}>Validity</span>
                        <span className={highlighted ? 'text-slate-900' : 'text-slate-900'}>{plan.validity_days} Days</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {plansArray.length === 0 && (
        <div className="py-20 text-center relative z-10">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-200 shadow-sm">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight uppercase">No Plans Found</h3>
          <p className="text-slate-500 text-sm mb-8">Start by creating your first subscription tier.</p>
          <button 
            onClick={() => navigate('/admin/subscription/create-plan')}
            className="px-10 py-4 bg-[#1B3C53] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#2D5A7B] transition-all active:scale-95 shadow-xl shadow-blue-900/10"
          >
            Launch First Plan
          </button>
        </div>
      )}

      {/* Modals & Notifications */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
          <div className="bg-white text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">Action Successful</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Plan has been updated</p>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCancelDelete}></div>
          <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-10 max-w-md w-full animate-fade-in shadow-2xl">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-8 border border-rose-100">
              <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Delete Plan?</h3>
            <p className="text-slate-500 mb-10 text-sm leading-relaxed font-medium">
              You are about to delete <span className="text-slate-900 font-bold">{planToDelete?.name}</span>. This action cannot be undone and will affect all agencies currently on this plan.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleCancelDelete}
                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
