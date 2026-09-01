import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const PAGE_TITLES = {
  '/': 'Overview — Command Center Dashboard',
  '/gis-map': 'Live GIS Map & Spatial Intelligence',
  '/road-conditions': 'Road Conditions & Defect Maintenance',
  '/traffic-intelligence': 'Traffic Intelligence & Flow Analytics',
  '/infrastructure': 'Infrastructure Deficiency Monitoring',
  '/safety-incidents': 'Public Safety & Hit-and-Run Incident Tracker',
  '/bus-fleet': 'Bus Fleet Mobile Sensing Units',
  '/analytics-reports': 'Centralized Analytics & Municipal Reports'
};

export const MainLayout = () => {
  const location = useLocation();
  const { toast } = useApp();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Urban Intelligence Platform';

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Persistent Left Sidebar (8 Core Modules) */}
      <Sidebar />

      {/* Main Command Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900">
        {/* Top Command Header */}
        <Header pageTitle={pageTitle} />

        {/* Dynamic Page Content View */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/60">
          <Outlet />
        </main>

        {/* Global Toast Notification Popup */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg shadow-2xl animate-bounce">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            <span className="font-semibold">{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
