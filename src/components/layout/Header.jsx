import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  Clock, 
  User, 
  ChevronDown,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const Header = ({ pageTitle }) => {
  const { cityConfig, searchQuery, setSearchQuery, liveTickerFeed } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

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
    <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
      {/* Page Title & System Badge */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {pageTitle || "Urban Intelligence Command Center"}
          </h1>
          <p className="text-xs text-slate-400">
            {cityConfig.authorityName} • Jurisdiction: <span className="text-blue-400 font-medium">{cityConfig.cityName}</span>
          </p>
        </div>
        <div className="hidden md:flex items-center px-2.5 py-1 bg-emerald-950/80 border border-emerald-700/50 rounded-full text-emerald-400 text-xs font-semibold tracking-wide gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>SYSTEM OPERATIONAL</span>
        </div>
      </div>

      {/* Global Search & Clock & Profile */}
      <div className="flex items-center space-x-4">
        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bus, defect, street, EVT ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Real-time Clock */}
        <div className="hidden xl:flex items-center text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700/60 space-x-2">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{formattedDate}</span>
          <span className="font-mono text-blue-300 font-semibold">{formattedTime}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
            title="System Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                <span className="font-bold text-white">Live System Alerts</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded">4 New</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                {liveTickerFeed.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-slate-800/70 transition flex items-start gap-2.5">
                    <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-200">{item.type}</div>
                      <div className="text-[11px] text-slate-400">Sensor: <span className="text-blue-400">{item.bus}</span> • {item.location}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center pl-3 border-l border-slate-800 space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-700 border border-blue-400 flex items-center justify-center font-bold text-white text-xs">
            BEL
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-semibold text-slate-100">Municipal Command</div>
            <div className="text-[10px] text-slate-400">Authority Operator</div>
          </div>
        </div>
      </div>
    </header>
  );
};
