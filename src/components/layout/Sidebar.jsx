import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Siren, 
  Bus, 
  BarChart3,
  Cpu,
  Wifi,
  Settings,
  HelpCircle,
  HardDrive
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/gis-map', label: 'Live GIS Map', icon: Map },
  { path: '/road-conditions', label: 'Road Conditions', icon: AlertTriangle },
  { path: '/traffic-intelligence', label: 'Traffic Intelligence', icon: TrendingUp },
  { path: '/infrastructure', label: 'Infrastructure', icon: ShieldAlert },
  { path: '/safety-incidents', label: 'Safety & Incidents', icon: Siren },
  { path: '/bus-fleet', label: 'Bus Fleet', icon: Bus },
  { path: '/analytics-reports', label: 'Analytics & Reports', icon: BarChart3 }
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* App Branding Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-lg tracking-widest shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/40">
            US
          </div>
          <div>
            <div className="text-base font-extrabold tracking-wider text-white flex items-center gap-1.5">
              URBAN SENSE
            </div>
            <div className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">
              Mobile Urban AI Platform
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Modules (8 Core Modules) */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Command Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Edge AI System Status Widget */}
      <div className="m-3 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2">
        <div className="flex items-center justify-between font-bold text-slate-200">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" /> Edge AI Unit
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
            ACTIVE
          </span>
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-400">
          <div className="flex justify-between">
            <span>Bandwidth Saved:</span>
            <span className="text-emerald-400 font-bold">~82.4%</span>
          </div>
          <div className="text-[9px] text-slate-500 italic">
            * Estimated / Demo Metric
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[82.4%]"></div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-blue-400" /> 50 Buses Linked
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-purple-400" /> Edge-v4.2
          </span>
        </div>
      </div>

      {/* Footer Settings & Help */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/40">
        <button className="flex items-center gap-1.5 hover:text-slate-200 transition">
          <Settings className="w-3.5 h-3.5" /> Settings
        </button>
        <button className="flex items-center gap-1.5 hover:text-slate-200 transition">
          <HelpCircle className="w-3.5 h-3.5" /> Help Docs
        </button>
      </div>
    </aside>
  );
};
