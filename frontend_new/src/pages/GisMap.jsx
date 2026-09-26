// GisMap.jsx - Interactive Live GIS Map Page for Urban Net

import React, { useState, useMemo } from 'react';
import { Filter, Layers, Bus, ShieldAlert, MapPin, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GisMapContainer } from '../components/map/GisMapContainer';
import { EventDetailDrawer } from '../components/events/EventDetailDrawer';

export const GisMap = () => {
  const { events, buses } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [handlingFilter, setHandlingFilter] = useState('ALL');
  const [busFilter, setBusFilter] = useState('ALL');
  const [showBuses, setShowBuses] = useState(true);

  // Filter events dynamically
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
      if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
      if (handlingFilter !== 'ALL' && e.handling !== handlingFilter) return false;
      if (busFilter !== 'ALL' && e.busId !== busFilter && (!e.detectedBy || !e.detectedBy.includes(busFilter))) return false;
      return true;
    });
  }, [events, categoryFilter, severityFilter, handlingFilter, busFilter]);

  const busesToDisplay = showBuses ? buses : [];

  return (
    <div className="space-y-4">
      {/* Top Header Bar & Map Filters */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Live GIS Urban Sensing Map</h1>
            <p className="text-xs text-slate-500">Real-time geospatial tracking of buses and edge AI detected observations</p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200">
              Showing {filteredEvents.length} / {events.length} Events
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200">
              {busesToDisplay.length} Active Buses
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Categories</option>
              <option value="ROAD">Road</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="SAFETY">Safety</option>
              <option value="TRAFFIC">Traffic</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Handling Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Handling Mode</label>
            <select
              value={handlingFilter}
              onChange={(e) => setHandlingFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Handling</option>
              <option value="REAL_TIME">Real-Time Event</option>
              <option value="PERSISTENT">Persistent Infra Issue</option>
            </select>
          </div>

          {/* Bus Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Sensing Bus</label>
            <select
              value={busFilter}
              onChange={(e) => setBusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            >
              <option value="ALL">All Buses</option>
              {buses.map((b) => (
                <option key={b.busId} value={b.busId}>
                  {b.busId} ({b.routeId})
                </option>
              ))}
            </select>
          </div>

          {/* Layer Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setShowBuses(!showBuses)}
              className={`w-full py-1.5 px-3 rounded font-semibold text-xs border transition-colors flex items-center justify-center ${
                showBuses
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Bus className="w-3.5 h-3.5 mr-1.5" />
              {showBuses ? 'Hide Buses Layer' : 'Show Buses Layer'}
            </button>
          </div>
        </div>
      </div>

      {/* Legend & Map Container */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Map Legend Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs bg-slate-50 p-2.5 rounded border border-slate-200 gap-2">
          <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">GIS Map Marker Legend:</span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-xs"></span>
              <span className="text-slate-700 font-medium">Bus Unit</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs"></span>
              <span className="text-slate-700 font-medium">Critical / Safety Event</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-600 border border-white shadow-xs"></span>
              <span className="text-slate-700 font-medium">Road Issue</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600 border border-white shadow-xs"></span>
              <span className="text-slate-700 font-medium">Infrastructure Issue</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-600 border border-white shadow-xs"></span>
              <span className="text-slate-700 font-medium">Traffic Issue</span>
            </div>
          </div>
        </div>

        {/* GIS Map */}
        <div className="h-[620px]">
          <GisMapContainer eventsToDisplay={filteredEvents} busesToDisplay={busesToDisplay} height="620px" />
        </div>
      </div>

      {/* Event Detail Drawer */}
      <EventDetailDrawer />
    </div>
  );
};
