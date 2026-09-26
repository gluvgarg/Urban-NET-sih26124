// Overview.jsx - Command Center Main Dashboard Page

import React from 'react';
import { Bus, AlertTriangle, ShieldAlert, Layers, Activity, ArrowRight, CheckCircle2, Server, Database, Radio, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import { GisMapContainer } from '../components/map/GisMapContainer';
import { EventDetailDrawer } from '../components/events/EventDetailDrawer';

export const Overview = () => {
  const { events, buses, summary, setSelectedEvent } = useApp();

  const activeBusesCount = buses.filter((b) => b.status === 'ACTIVE').length;
  const criticalEvents = events.filter((e) => e.severity === 'CRITICAL' && e.status !== 'RESOLVED');
  const persistentIssues = events.filter((e) => e.handling === 'PERSISTENT' && e.status !== 'RESOLVED');
  const recentEvents = events.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Edge Architecture Pipeline Banner */}
      <div className="bg-slate-900 text-white rounded-md p-4 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded border border-blue-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Municipal Command Center</h1>
              <p className="text-xs text-slate-400">Urban Net Mobile Sensing Units Architecture Pipeline (SIH26124)</p>
            </div>
          </div>

          {/* Pipeline Flow Steps */}
          <div className="flex items-center space-x-2 text-xs font-mono overflow-x-auto py-1">
            <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">Bus Camera & GPS</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="px-2 py-1 bg-blue-950 text-blue-300 rounded border border-blue-800">Edge AI Detection</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">Deduplication</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="px-2 py-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">Command Center</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Sensing Buses</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {activeBusesCount} <span className="text-xs font-normal text-slate-500">/ {buses.length}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">92% Fleet Operational</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
            <Bus className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Events Detected</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{events.length}</div>
            <span className="text-[11px] text-slate-500">Edge AI Aggregated</span>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Critical Real-Time</span>
            <div className="text-2xl font-bold text-red-600 mt-1">{criticalEvents.length}</div>
            <span className="text-[11px] text-red-600 font-medium">Immediate Dispatch</span>
          </div>
          <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Persistent Issues</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{persistentIssues.length}</div>
            <span className="text-[11px] text-slate-500">Deduplicated Infra</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-700 rounded-md border border-purple-100">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Map & Live Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GIS Map Preview (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Live GIS Urban Sensing Map</h2>
              <p className="text-xs text-slate-500">Real-time bus tracking & edge event observation map</p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
              {buses.length} Buses | {events.length} Events
            </span>
          </div>
          <div className="flex-1 min-h-[380px]">
            <GisMapContainer eventsToDisplay={events} busesToDisplay={buses} height="380px" />
          </div>
        </div>

        {/* System Health & Ingestion Status (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              System Operational Health
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Central REST API</span>
                    <span className="text-[11px] text-slate-500">Express / Node.js Engine</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                  ONLINE (24ms)
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-semibold text-slate-800 block">MongoDB Database</span>
                    <span className="text-[11px] text-slate-500">Persistent Observations</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                  CONNECTED
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-purple-600" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Socket.IO Server</span>
                    <span className="text-[11px] text-slate-500">Real-time Push Stream</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px]">
                  LIVE (12ms)
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Edge Ingestion Stream</span>
                    <span className="text-[11px] text-slate-500">Mobile Bus Sensing Units</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px]">
                  142 obs/min
                </span>
              </div>
            </div>
          </div>

          {/* Critical Events Callout Panel */}
          <div className="bg-red-50/50 rounded-md border border-red-200 p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                Critical Real-Time Alerts ({criticalEvents.length})
              </h3>
            </div>
            <div className="space-y-2">
              {criticalEvents.slice(0, 3).map((evt) => (
                <div
                  key={evt.observationId}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-2 bg-white rounded border border-red-200 cursor-pointer hover:bg-red-50/80 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-red-700">{evt.observationId}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{evt.busId}</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-0.5">{evt.type.replace(/_/g, ' ')}</div>
                  <div className="text-[11px] text-slate-600 truncate mt-0.5">{evt.location?.address}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Edge Observations Data Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recent Edge Observations</h2>
            <p className="text-xs text-slate-500">Live feed of urban observations captured by bus edge AI</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Sensing Bus</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Deduplication</th>
                <th className="py-2.5 px-3">Captured At</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {recentEvents.map((evt) => (
                <tr key={evt.observationId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">{evt.observationId}</td>
                  <td className="py-2.5 px-3">
                    <CategoryBadge category={evt.category} />
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{evt.type.replace(/_/g, ' ')}</td>
                  <td className="py-2.5 px-3 font-mono">{evt.busId}</td>
                  <td className="py-2.5 px-3">
                    <SeverityBadge severity={evt.severity} />
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {evt.detectionCount || 1} obs
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                    {new Date(evt.capturedAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={evt.status} />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] transition-colors border border-slate-200"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Event Detail Drawer */}
      <EventDetailDrawer />
    </div>
  );
};
