import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Bell, 
  Clock, 
  Activity,
  Terminal
} from 'lucide-react';

export const Header = ({ pageTitle }) => {
  const { cityConfig, searchQuery, setSearchQuery, liveTickerFeed, triggerDemoEvent } = useApp();
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
    <header className="bg-slate-900 text-white border-b border-slate-800 px-5 py-2.5 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Page Title & Operational Status */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            {pageTitle || "URBAN NET — Intelligence Command Center"}
          </h1>
          <p className="text-[11px] text-slate-400">
            {cityConfig.authorityName} • Jurisdiction: <span className="text-blue-400 font-medium">{cityConfig.cityName}</span>
          </p>
        </div>
        <div className="hidden md:flex items-center px-2 py-0.5 bg-emerald-950/90 border border-emerald-800 rounded text-emerald-400 text-[10px] font-mono font-semibold gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Controls & Clock & User */}
      <div className="flex items-center space-x-3">
        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-2.5 top-2 text-slate-500 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search bus, defect, street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
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

        {/* Demo Event Trigger Dropdown (Dev/Demo Tool) */}
        <div className="relative flex items-center">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-400 text-[10px] font-mono space-x-1">
            <Terminal className="w-3 h-3 text-amber-400" />
            <span className="text-slate-400">DEMO TOOL:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  triggerDemoEvent(e.target.value);
                  e.target.value = '';
                }
              }}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Trigger Event...</option>
              <option value="POTHOLE" className="bg-slate-900 text-white">Pothole Event</option>
              <option value="WATERLOGGING" className="bg-slate-900 text-white">Waterlogging Event</option>
              <option value="FOOTPATH_DAMAGE" className="bg-slate-900 text-white">Footpath Defect</option>
              <option value="HIT_AND_RUN" className="bg-slate-900 text-white">Hit-and-Run Incident</option>
            </select>
          </div>
        </div>

        {/* System Alerts Feed Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
            title="System Alerts Queue"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-800 flex justify-between items-center text-slate-300 font-bold">
                <span>System Operations Queue</span>
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded">LIVE</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
                {liveTickerFeed.map((item) => (
                  <div key={item.id} className="p-2.5 hover:bg-slate-800/60 transition flex items-start gap-2">
                    <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-slate-200">{item.type}</div>
                      <div className="text-[11px] text-slate-400">Sensor: <span className="text-blue-400 font-mono">{item.bus}</span> • {item.location}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center pl-2 border-l border-slate-800 space-x-2">
          <div className="w-7 h-7 rounded bg-blue-700 border border-blue-500 flex items-center justify-center font-bold text-white text-[11px]">
            BEL
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-semibold text-slate-200 text-[11px]">Municipal Operator</div>
            <div className="text-[9px] text-slate-400 font-mono">ID: OP-4409</div>
          </div>
        </div>
      </div>
    </header>
  );
};
