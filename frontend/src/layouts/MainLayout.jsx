import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Overview — Command Center Console',
  '/gis-map': 'Live GIS Map & Spatial Intelligence',
  '/road-conditions': 'Road Conditions & Maintenance Log',
  '/traffic-intelligence': 'Traffic Intelligence & Corridor Analytics',
  '/infrastructure': 'Infrastructure Deficiency Monitoring',
  '/safety-incidents': 'Public Safety & Incident Log',
  '/bus-fleet': 'Bus Fleet Mobile Sensing Units',
  '/analytics-reports': 'Centralized Analytics & Municipal Reports'
};

export const MainLayout = () => {
  const location = useLocation();
  const { toast } = useApp();
  const pageTitle = PAGE_TITLES[location.pathname] || 'URBAN NET — Mobile Urban Intelligence Platform';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans text-xs">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Operations Console */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
        {/* Top Command Header */}
        <Header pageTitle={pageTitle} />

        {/* Dynamic Page Content View */}
        <main className="flex-1 overflow-y-auto p-5 bg-slate-950/60 space-y-4">
          <Outlet />
        </main>

        {/* Global Toast Notification Popup */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded shadow-lg animate-in fade-in slide-in-from-bottom-2">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
