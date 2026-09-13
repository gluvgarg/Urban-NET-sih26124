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
    <aside className="w-60 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Branding Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-blue-700 flex items-center justify-center font-bold text-white text-xs tracking-wider border border-blue-500">
            UN
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider text-white">
              URBAN NET
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
              Urban Intelligence Console
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Modules */}
      <div className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
          Operations Modules
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-2.5 py-2 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-bold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Edge AI Sensing Status Box */}
      <div className="m-2.5 p-2.5 bg-slate-900 border border-slate-800 rounded text-xs space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-200 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" /> Edge AI Pipeline
          </span>
          <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 font-mono">
            ACTIVE
          </span>
        </div>

        <div className="space-y-1 text-[10px] text-slate-400">
          <div className="flex justify-between">
            <span>Bandwidth Savings:</span>
            <span className="text-emerald-400 font-mono font-bold">~82.4%</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden border border-slate-800">
            <div className="bg-emerald-600 h-full w-[82.4%]"></div>
          </div>
          <div className="text-[9px] text-slate-500 italic">
            * Estimated / Demo Metric
          </div>
        </div>

        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-blue-400" /> 50 Buses
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-purple-400" /> v4.2.1
          </span>
        </div>
      </div>
    </aside>
  );
};
