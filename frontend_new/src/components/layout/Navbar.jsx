// Navbar.jsx - Top Navigation Bar for Municipal Command Center

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bus, Map, AlertTriangle, BarChart3, Radio, Shield, Server, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = () => {
  const { serverError } = useApp();

  const navItems = [
    { label: 'Command Center', path: '/', icon: Radio },
    { label: 'Live Map', path: '/map', icon: Map },
    { label: 'Events', path: '/events', icon: AlertTriangle },
    { label: 'Fleet', path: '/fleet', icon: Bus },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 }
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-md flex items-center justify-center text-white">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">URBAN NET</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Central Municipal Transit Sensing Command Center</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 md:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2 text-slate-400" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Side Status Indicators */}
          <div className="flex items-center space-x-3">
            {serverError ? (
              <div className="flex items-center space-x-2 px-2.5 py-1 bg-red-950/80 rounded border border-red-800 text-xs text-red-300">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span className="font-mono font-semibold">Server Offline</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-slate-800 rounded border border-slate-700 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-slate-200">Socket.IO Live</span>
              </div>
            )}

            {/* Government Authority Badge */}
            <div className="hidden sm:flex items-center text-xs text-slate-400 border-l border-slate-800 pl-3">
              <Shield className="w-4 h-4 mr-1.5 text-slate-400" />
              <span className="font-medium text-slate-300">Transit Authority</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
