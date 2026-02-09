import React, { useState, useEffect } from 'react';

const CustomSelect = ({
  label,
  value,
  onChange,
  error,
  required = false,
  options = [],
  hideSelectOption = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === value) || null
  );

  useEffect(() => {
    setSelectedOption(options.find(opt => opt.value === value) || null);
  }, [value, options]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5 group">
      <label className="text-sm font-medium text-slate-700 ml-1">
        {label}
        {required && <span className="text-[#1B3C53] ml-1">*</span>}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-[12px] font-medium focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-slate-400 cursor-pointer flex items-center ${
            !selectedOption ? "text-slate-500" : "text-slate-700"
          } ${error ? "border-red-300 ring-4 ring-red-50" : ""}`}
        >
          {selectedOption ? selectedOption.label : `Select ${label}`}
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          <svg className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-[9999] w-full mt-1 bg-white border border-slate-300 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
        {!hideSelectOption && (
          <div
            onClick={() => {
              setSelectedOption(null);
              onChange('');
              setIsOpen(false);
            }}
            className="px-3 py-2 text-[10px] font-medium uppercase tracking-widest cursor-pointer text-slate-400 hover:bg-slate-50 border-b border-slate-50"
          >
            Select {label}
          </div>
        )}
            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
              {options.map((option, index) => (
                <div
                  key={option.key || `${option.value}-${index}`}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 text-[12px] font-medium cursor-pointer transition-colors ${
                    selectedOption?.value === option.value 
                      ? "bg-[#1B3C53]/5 text-[#1B3C53]" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  title={option.label}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-[9px] font-medium text-red-500 flex items-center mt-1 ml-1 uppercase tracking-widest">
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;