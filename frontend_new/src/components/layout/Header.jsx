import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Clock, Shield, AlertCircle } from 'lucide-react';

export const Header = ({ pageTitle }) => {
  const { filters, setFilters, serverError } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-5 py-2.5 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Page Title & Status */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            {pageTitle || 'URBAN NET — Central Command Station'}
          </h1>
          <p className="text-[11px] text-slate-400">
            Delhi Urban Mobility & Transport Authority • Central System
          </p>
        </div>
        {serverError ? (
          <div className="hidden md:flex items-center px-2 py-0.5 bg-red-950/90 border border-red-800 rounded text-red-400 text-[10px] font-mono font-semibold gap-1.5">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span>SERVER UNAVAILABLE</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center px-2 py-0.5 bg-emerald-950/90 border border-emerald-800 rounded text-emerald-400 text-[10px] font-mono font-semibold gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>BACKEND ONLINE</span>
          </div>
        )}
      </div>

      {/* Controls & Clock */}
      <div className="flex items-center space-x-3">
        {/* Search Bar */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-2.5 top-2 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search bus ID, type, observation..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600 transition"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ ...filters, search: '' })}
              className="absolute right-2 top-1.5 text-xs text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Real-time Clock */}
        <div className="hidden xl:flex items-center text-xs text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 space-x-2 font-mono text-[11px]">
          <Clock className="w-3 h-3 text-blue-400" />
          <span>{formattedDate}</span>
          <span className="text-blue-300 font-bold">{formattedTime}</span>
        </div>

        {/* Authority Badge */}
        <div className="hidden sm:flex items-center text-xs text-slate-400 border-l border-slate-800 pl-3">
          <Shield className="w-4 h-4 mr-1.5 text-slate-400" />
          <span className="font-medium text-slate-300">Transit Sensing Unit</span>
        </div>
      </div>
    </header>
  );
};
