import React, { useState, useEffect, useRef } from 'react';

const CustomSelect = ({
  label,
  value,
  onChange,
  error,
  required = false,
  options = [],
  hideSelectOption = false,
  enableAlphabeticSearch = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === value) || null
  );
  const [searchKey, setSearchKey] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const filteredOptions = searchKey
    ? options.filter(opt => opt.label.toLowerCase().startsWith(searchKey.toLowerCase()))
    : options;

  useEffect(() => {
    setSelectedOption(options.find(opt => opt.value === value) || null);
  }, [value, options]);

  useEffect(() => {
    if (!isOpen) {
      setSearchKey('');
      return;
    }

    if (!enableAlphabeticSearch) return;

    const handleKeyPress = (e) => {
      if (!/^[a-zA-Z]$/.test(e.key)) return;
      e.preventDefault();
      setSearchKey(prev => prev + e.key.toLowerCase());
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        setSearchKey(prev => prev.slice(0, -1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => prev < filteredOptions.length - 1 ? prev + 1 : prev);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredOptions[highlightedIndex]);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, enableAlphabeticSearch, highlightedIndex, options]);

  useEffect(() => {
    if (!searchKey || !enableAlphabeticSearch) return;

    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  }, [searchKey, enableAlphabeticSearch]);

  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const element = dropdownRef.current.children[highlightedIndex];
      if (element) {
        element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5 group">
      <label className="text-sm font-medium text-slate-700 ml-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-[12px] font-medium focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-slate-400 cursor-pointer flex items-center ${
            !selectedOption ? "text-slate-500" : "text-slate-700"
          } ${error ? "border-red-300 ring-4 ring-red-50" : ""}`}
        >
          {enableAlphabeticSearch && searchKey && isOpen ? (
            <span className="text-[#1B3C53] font-bold">{searchKey}</span>
          ) : (
            <span>{selectedOption ? selectedOption.label : `Select ${label}`}</span>
          )}
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center gap-1 px-3 text-slate-400">
          {(selectedOption || searchKey) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOption(null);
                onChange('');
                setSearchKey('');
              }}
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors pointer-events-auto"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <svg className={`w-3.5 h-3.5 transition-transform pointer-events-none ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div ref={dropdownRef} className="max-h-[250px] overflow-y-auto custom-scrollbar">
              {filteredOptions.map((option, index) => {
                const isHighlighted = index === highlightedIndex;
                const matchLength = searchKey.length;
                const labelText = option.label;
                const highlightedPart = labelText.substring(0, matchLength);
                const remainingPart = labelText.substring(matchLength);
                
                return (
                  <div
                    key={option.key || `${option.value}-${index}`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-3 py-2 text-[12px] cursor-pointer transition-all relative ${
                      isHighlighted
                        ? "bg-[#1B3C53]/10 text-[#1B3C53] font-bold"
                        : selectedOption?.value === option.value 
                        ? "bg-[#1B3C53]/5 text-[#1B3C53] font-bold" 
                        : "text-slate-600 hover:bg-slate-50 font-medium"
                    }`}
                    title={option.label}
                  >
                    {searchKey ? (
                      <span>
                        <span className="font-extrabold text-[#1B3C53]">{highlightedPart}</span>
                        <span>{remainingPart}</span>
                      </span>
                    ) : (
                      <span>{option.label}</span>
                    )}
                  </div>
                );
              })}
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