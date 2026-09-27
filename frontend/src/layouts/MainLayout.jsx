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
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden font-sans text-xs">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Operations Console */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-100">
        {/* Top Command Header */}
        <Header pageTitle={pageTitle} />

        {/* Dynamic Page Content View */}
        <main className="flex-1 overflow-y-auto p-4 bg-slate-100 space-y-4">
          <Outlet />
        </main>

        {/* Global Toast Notification Popup */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 text-xs rounded-md shadow-md">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
            <span className="font-semibold">{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
