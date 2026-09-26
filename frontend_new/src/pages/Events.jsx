// Events.jsx - Unified Edge AI Events & Observations Management System

import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, Layers, Eye, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, StatusBadge, CategoryBadge, HandlingBadge } from '../components/common/Badge';
import { EventDetailDrawer } from '../components/events/EventDetailDrawer';

export const Events = () => {
  const { events, buses, updateEventStatus, setSelectedEvent } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [handlingFilter, setHandlingFilter] = useState('ALL');
  const [busFilter, setBusFilter] = useState('ALL');

  // Filtered Events calculation
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (categoryFilter !== 'ALL' && e.category !== categoryFilter) return false;
      if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (handlingFilter !== 'ALL' && e.handling !== handlingFilter) return false;
      if (busFilter !== 'ALL' && e.busId !== busFilter && (!e.detectedBy || !e.detectedBy.includes(busFilter))) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchId = e.observationId.toLowerCase().includes(query);
        const matchType = e.type.toLowerCase().includes(query);
        const matchAddress = e.location?.address?.toLowerCase().includes(query) || false;
        const matchBus = e.busId.toLowerCase().includes(query);
        if (!matchId && !matchType && !matchAddress && !matchBus) return false;
      }
      return true;
    });
  }, [events, categoryFilter, severityFilter, statusFilter, handlingFilter, busFilter, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Unified Edge AI Events Register</h1>
            <p className="text-xs text-slate-500">Central database of observations captured by bus fleet edge AI units</p>
          </div>
          <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
            Total Records: <strong className="text-slate-900">{filteredEvents.length}</strong> / {events.length}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Search Observations</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search ID, type, bus or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Category</label>
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
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Severity</label>
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
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Workflow Status</label>
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
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase">Sensing Bus</label>
            <select
              value={busFilter}
              onChange={(e) => setBusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none font-mono"
            >
              <option value="ALL">All Buses</option>
              {buses.map((b) => (
                <option key={b.busId} value={b.busId}>
                  {b.busId}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Event ID</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Bus ID</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Conf.</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Deduplication</th>
                <th className="py-3 px-3">Captured At</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-500">
                    No matching Edge AI observations found. Try relaxing filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.observationId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-blue-700 font-bold">{evt.observationId}</td>
                    <td className="py-3 px-3">
                      <CategoryBadge category={evt.category} />
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{evt.type.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{evt.busId}</td>
                    <td className="py-3 px-3">
                      <SeverityBadge severity={evt.severity} />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {((evt.confidence || 0.9) * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={evt.location?.address}>
                      {evt.location?.address}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {evt.detectionCount || 1} obs
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {new Date(evt.capturedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={evt.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] transition-colors border border-slate-200 flex items-center inline-flex"
                      >
                        <Eye className="w-3 h-3 mr-1 text-slate-600" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Event Detail Drawer */}
      <EventDetailDrawer />
    </div>
  );
};
