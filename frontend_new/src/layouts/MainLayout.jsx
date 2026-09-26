// MainLayout.jsx - Main Layout shell with Top Navbar and content area

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900">
      <Navbar />
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
