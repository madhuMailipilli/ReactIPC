/**
 * Custom Date Picker Component with Modern Calendar UI
 * Provides a clean, responsive calendar interface with month/year grid selection
 */

import React, { useState, useRef, useEffect } from 'react';
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore } from 'date-fns';
import { setMonth, setYear, getYear, getMonth } from 'date-fns';

const CustomDatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'dd-mm-yyyy',
  maxDate,
  minDate,
  disabled = false,
  error,
  futureOnly = false,
}) => {
  // Set default date constraints based on futureOnly prop
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const effectiveMinDate = futureOnly ? today : minDate;
  const effectiveMaxDate = futureOnly ? undefined : (maxDate || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState('days');
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Convert dd-mm-yyyy string to Date object
  const parseValue = (dateString) => {
    if (!dateString) return null;
    try {
      return parse(dateString, 'dd-MM-yyyy', new Date());
    } catch {
      return null;
    }
  };

  // Convert Date object to dd-mm-yyyy string
  const formatValue = (date) => {
    if (!date) return '';
    try {
      return format(date, 'dd-MM-yyyy');
    } catch {
      return '';
    }
  };

  const selectedDate = parseValue(value);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setCalendarView('days');
        setCurrentMonth(selectedDate || new Date());
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, selectedDate]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Add padding days from previous month
    const startDay = start.getDay();
    const paddingDays = [];
    for (let i = 0; i < startDay; i++) {
      const paddingDate = new Date(start);
      paddingDate.setDate(start.getDate() - (startDay - i));
      paddingDays.push(paddingDate);
    }
    
    return [...paddingDays, ...days];
  };

  // Generate months grid
  const generateMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const monthDate = setMonth(currentMonth, i);
      months.push({
        date: monthDate,
        name: format(monthDate, 'MMM'),
        fullName: format(monthDate, 'MMMM'),
        value: i
      });
    }
    return months;
  };

  // Generate years grid
  const generateYears = () => {
    const currentYear = getYear(currentMonth);
    const startYear = currentYear - 6;
    const years = [];
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  const handleDateSelect = (date) => {
    if (effectiveMinDate && isBefore(date, effectiveMinDate)) return;
    if (effectiveMaxDate && isAfter(date, effectiveMaxDate)) return;
    
    onChange(formatValue(date));
    setIsOpen(false);
    setCalendarView('days');
  };

  const handleMonthSelect = (monthIndex) => {
    if (isMonthDisabled(monthIndex)) return;
    const newDate = setMonth(currentMonth, monthIndex);
    setCurrentMonth(newDate);
    setCalendarView('days');
  };

  const handleYearSelect = (year) => {
    if (isYearDisabled(year)) return;
    const newDate = setYear(currentMonth, year);
    setCurrentMonth(newDate);
    setCalendarView('months');
  };

  const handleInputClick = () => {
    if (!disabled) {
      if (!isOpen) {
        setCurrentMonth(selectedDate || new Date());
        setCalendarView('days');
        
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const dropdownHeight = 350;
          
          setDropdownPosition(spaceBelow >= dropdownHeight || spaceBelow > spaceAbove ? 'bottom' : 'top');
        }
      }
      setIsOpen(!isOpen);
    }
  };

  const handlePrevMonth = () => {
    if (calendarView === 'days') {
      setCurrentMonth(prev => subMonths(prev, 1));
    } else if (calendarView === 'years') {
      setCurrentMonth(prev => setYear(prev, getYear(prev) - 12));
    } else if (calendarView === 'months') {
      setCurrentMonth(prev => setYear(prev, getYear(prev) - 1));
    }
  };

  const handleNextMonth = () => {
    if (calendarView === 'days') {
      setCurrentMonth(prev => addMonths(prev, 1));
    } else if (calendarView === 'years') {
      setCurrentMonth(prev => setYear(prev, getYear(prev) + 12));
    } else if (calendarView === 'months') {
      setCurrentMonth(prev => setYear(prev, getYear(prev) + 1));
    }
  };

  const handleHeaderClick = () => {
    if (calendarView === 'days') {
      setCalendarView('months');
    } else if (calendarView === 'months') {
      setCalendarView('years');
    }
  };

  const isDateDisabled = (date) => {
    if (effectiveMinDate && isBefore(date, effectiveMinDate)) return true;
    if (effectiveMaxDate && isAfter(date, effectiveMaxDate)) return true;
    return false;
  };

  const isMonthDisabled = (monthIndex) => {
    const monthDate = setMonth(currentMonth, monthIndex);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    if (effectiveMinDate && isAfter(effectiveMinDate, monthEnd)) return true;
    if (effectiveMaxDate && isBefore(effectiveMaxDate, monthStart)) return true;
    return false;
  };

  const isYearDisabled = (year) => {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    
    if (effectiveMinDate && isAfter(effectiveMinDate, yearEnd)) return true;
    if (effectiveMaxDate && isBefore(effectiveMaxDate, yearStart)) return true;
    return false;
  };

  const calendarDays = generateCalendarDays();
  const months = generateMonths();
  const years = generateYears();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getHeaderText = () => {
    if (calendarView === 'days') {
      return format(currentMonth, 'MMMM yyyy');
    } else if (calendarView === 'months') {
      return format(currentMonth, 'yyyy');
    } else {
      const currentYear = getYear(currentMonth);
      return `${currentYear - 6} - ${currentYear + 5}`;
    }
  };

  return (
    <div className="w-full" ref={containerRef}>
      <label className="text-[10px] font-medium text-slate-700 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue.match(/^\d{0,2}-?\d{0,2}-?\d{0,4}$/)) {
              onChange(inputValue);
            }
          }}
          onClick={handleInputClick}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2.5 bg-white border rounded-xl text-[13px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-[#1B3C53]/5 focus:border-[#1B3C53] transition-all duration-300 hover:border-slate-400 ${
            error ? 'border-red-200 ring-4 ring-red-50' : 'border-slate-300'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          readOnly={!disabled}
        />
        <button
          type="button"
          onClick={handleInputClick}
          disabled={disabled}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#1B3C53] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        {error && (
          <p className="text-[9px] font-medium text-red-500 flex items-center ml-1 uppercase tracking-widest mt-1">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {error}
          </p>
        )}
        
        {/* Calendar Popup */}
        {isOpen && (
          <div className={`absolute left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-[99999] p-2 min-w-[240px] ${
            dropdownPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
          }`}>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleHeaderClick}
                className="text-sm font-medium text-slate-900 hover:text-[#1B3C53] transition-colors px-2 py-1 rounded hover:bg-slate-100"
              >
                {getHeaderText()}
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Days View */}
            {calendarView === 'days' && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div key={day} className="text-xs font-medium text-slate-400 text-center py-1">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    const isDisabled = isDateDisabled(date);
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        disabled={isDisabled}
                        className={`w-6 h-6 text-xs rounded-lg transition-all duration-150 ${
                          !isCurrentMonth
                            ? 'text-slate-300 hover:bg-slate-50'
                            : isSelected
                            ? 'bg-[#1B3C53] text-white shadow-md'
                            : isToday
                            ? 'bg-blue-100 text-blue-600 font-bold'
                            : isDisabled
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-[#1B3C53]'
                        }`}
                      >
                        {format(date, 'd')}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            
            {/* Months View */}
            {calendarView === 'months' && (
              <div className="grid grid-cols-3 gap-2">
                {months.map((month) => {
                  const isCurrentMonth = selectedDate && getMonth(selectedDate) === month.value && getYear(selectedDate) === getYear(currentMonth);
                  const isThisMonth = getMonth(new Date()) === month.value && getYear(new Date()) === getYear(currentMonth);
                  const isDisabled = isMonthDisabled(month.value);
                  
                  return (
                    <button
                      key={month.value}
                      type="button"
                      onClick={() => handleMonthSelect(month.value)}
                      disabled={isDisabled}
                      className={`px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                        isDisabled
                          ? 'text-slate-300 cursor-not-allowed'
                          : isCurrentMonth
                          ? 'bg-[#1B3C53] text-white shadow-md'
                          : isThisMonth
                          ? 'bg-blue-100 text-blue-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-[#1B3C53]'
                      }`}
                    >
                      {month.name}
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Years View */}
            {calendarView === 'years' && (
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => {
                  const isCurrentYear = selectedDate && getYear(selectedDate) === year;
                  const isThisYear = getYear(new Date()) === year;
                  const isDisabled = isYearDisabled(year);
                  
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      disabled={isDisabled}
                      className={`px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                        isDisabled
                          ? 'text-slate-300 cursor-not-allowed'
                          : isCurrentYear
                          ? 'bg-[#1B3C53] text-white shadow-md'
                          : isThisYear
                          ? 'bg-blue-100 text-blue-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-[#1B3C53]'
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Clear Button */}
            {value && calendarView === 'days' && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                    setCalendarView('days');
                  }}
                  className="w-full px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors"
                >
                  Clear Date
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDatePicker;