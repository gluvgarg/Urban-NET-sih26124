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
  BarChart3
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
    <aside className="w-56 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Branding Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-blue-700 flex items-center justify-center font-bold text-white text-xs tracking-wider border border-blue-500">
            UN
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider text-white">
              URBAN NET
            </div>
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
              Municipal Control Station
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
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
