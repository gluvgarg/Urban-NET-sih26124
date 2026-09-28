// GisMap.jsx - Live GIS Urban Sensing Map Page

import React, { useState, useMemo } from 'react';
import { Layers, Bus, ShieldAlert, Flame, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GisMapContainer } from '../components/map/GisMapContainer';
import { EventDetailDrawer } from '../components/events/EventDetailDrawer';

export const GisMap = () => {
  const { events, buses, loading } = useApp();

  // Layer Toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showBuses, setShowBuses] = useState(true);
  const [showEventMarkers, setShowEventMarkers] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [busFilter, setBusFilter] = useState('ALL');

  // Filtered Events calculation
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
      if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (busFilter !== 'ALL' && e.busId !== busFilter && (!e.detectedBy || !e.detectedBy.includes(busFilter))) return false;
      return true;
    });
  }, [events, categoryFilter, severityFilter, statusFilter, busFilter]);

  const busesToDisplay = showBuses ? buses : [];

  if (loading) {
    return (
      <div className="bg-white rounded-md border border-slate-200 p-12 text-center text-xs text-slate-500 font-mono">
        Loading GIS Sensing Layers...
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      {/* Top Header & Telemetry KPI Banner */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Live GIS Urban Sensing Map
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Spatial visualization of real-time Edge AI detected events & sensing bus telemetry from central backend.
            </p>
          </div>

          {/* Telemetry Stats */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200">
              <Bus className="w-3.5 h-3.5 text-blue-600" />
              <span>Sensing Buses: <strong>{buses.length}</strong> ({buses.filter(b => b.status === 'ONLINE').length} Online)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-800 rounded border border-orange-200">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
              <span>Events Visible: <strong>{filteredEvents.length}</strong> / {events.length}</span>
            </div>
          </div>
        </div>

        {/* Layer Toggles & Multi-Level Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Quick Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                showHeatmap ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Event Heatmap: {showHeatmap ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setShowEventMarkers(!showEventMarkers)}
              className={`px-3 py-1.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                showEventMarkers ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
              Event Markers: {showEventMarkers ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setShowBuses(!showBuses)}
              className={`px-3 py-1.5 rounded border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                showBuses ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              Buses: {showBuses ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none"
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
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">Workflow Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Bus Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">Sensing Bus</label>
            <select
              value={busFilter}
              onChange={(e) => setBusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none font-mono"
            >
              <option value="ALL">All Buses</option>
              {buses.map((b) => (
                <option key={b.busId} value={b.busId}>
                  {b.busId} ({b.route || 'No Route'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Render Section */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Real-Time GIS Spatial Sensing
            </span>
          </div>
          <span className="text-xs font-mono text-slate-600">
            {busesToDisplay.length} Buses | {filteredEvents.length} Events Layered
          </span>
        </div>

        <div className="h-[620px]">
          <GisMapContainer
            eventsToDisplay={filteredEvents}
            busesToDisplay={busesToDisplay}
            showHeatmap={showHeatmap}
            showBuses={showBuses}
            showDefectMarkers={showEventMarkers}
            height="620px"
          />
        </div>
      </div>

      {/* Event Detail Drawer */}
      <EventDetailDrawer />
    </div>
  );
};
