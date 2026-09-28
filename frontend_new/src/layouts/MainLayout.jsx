// MainLayout.jsx - Main Layout shell with Top Navbar and content area

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useApp } from '../context/AppContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const MainLayout = () => {
  const { serverError, refreshData, loading } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900">
      <Navbar />
      
      {serverError && (
        <div className="bg-red-600 text-white px-4 py-3 shadow-md border-b border-red-700">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-white" />
              <div>
                <p className="font-bold text-sm tracking-wide">Central server unavailable</p>
                <p className="text-xs text-red-100">
                  Unable to connect to the backend server at <code className="font-mono bg-red-800/60 px-1 py-0.5 rounded">http://localhost:5000/api/v1</code>.
                </p>
              </div>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="px-3 py-1.5 bg-white text-red-700 hover:bg-red-50 rounded text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Retry Connection
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <span>Urban Net Command Center &copy; 2026 Smart India Hackathon (SIH26124)</span>
          <span className="text-slate-400 mt-1 sm:mt-0 font-mono">Mobile Sensing Platform v2.4 | Central System</span>
        </div>
      </footer>
    </div>
  );
};
