import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Bus, 
  Zap, 
  AlertTriangle, 
  Car, 
  Siren, 
  ShieldAlert, 
  ArrowRight, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Eye, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { HOURLY_TRAFFIC_TREND } from '../data/traffic';
import { DEFECTS_OVER_TIME_TREND } from '../data/analytics';
import { SEVERITY_BADGES } from '../data/events';

// Fix Leaflet default marker icon bug in React Leaflet
const createCustomIcon = (color, label = '') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
        ${label}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const CATEGORY_COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'];

export const Overview = () => {
  const { 
    cityConfig, 
    buses, 
    events, 
    defects, 
    incidents, 
    setSelectedEvent,
    liveTickerFeed
  } = useApp();

  const activeBuses = buses.filter(b => b.status === 'ONLINE').length;
  const criticalIncidentsCount = incidents.filter(i => i.severity === 'CRITICAL').length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. SYSTEMIC PIPELINE VISUAL BANNER (Requested by User) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform Sensing & Action Pipeline
            </span>
          </div>
          <span className="text-[10px] text-slate-400 italic">
            BEL Edge AI Architecture • Mobile Transport Fleet
          </span>
        </div>

        {/* Pipeline Step Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { step: '01', title: 'CITY BUSES', subtitle: '50 Transport Units', color: 'bg-blue-600' },
            { step: '02', title: 'EDGE AI', subtitle: 'Onboard Processing', color: 'bg-purple-600' },
            { step: '03', title: 'IMPORTANT EVENTS', subtitle: 'Bandwidth Optimized', color: 'bg-amber-600' },
            { step: '04', title: 'CENTRAL PLATFORM', subtitle: 'Aggregated Storage', color: 'bg-indigo-600' },
            { step: '05', title: 'GIS & ANALYTICS', subtitle: 'Heatmaps & Spatial', color: 'bg-cyan-600' },
            { step: '06', title: 'AUTHORITY ACTION', subtitle: 'Municipal Dispatch', color: 'bg-emerald-600' }
          ].map((item, idx) => (
            <div 
              key={item.step}
              className="pipeline-step bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 relative group hover:border-blue-500/50 transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded ${item.color}`}>
                  STEP {item.step}
                </span>
                {idx < 5 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 hidden lg:block" />
                )}
              </div>
              <div className="text-xs font-black text-slate-100">{item.title}</div>
              <div className="text-[10px] text-slate-400">{item.subtitle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TOP 6 COMMAND KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">ACTIVE BUSES</span>
            <Bus className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            42 <span className="text-sm font-normal text-slate-400">/ 50</span>
          </div>
          <div className="flex items-center text-[10px] text-emerald-400 font-semibold gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            84% Fleet Operational
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">EVENTS DETECTED</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">1,284</div>
          <div className="text-[10px] text-amber-400 font-semibold">
            +14% vs yesterday
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">ROAD DEFECTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-white">167</div>
          <div className="text-[10px] text-slate-400">
            82 Potholes • 31 Waterlogging
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">TRAFFIC ALERTS</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">28</div>
          <div className="text-[10px] text-cyan-400 font-semibold">
            18 Congested Zones
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">CRITICAL INCIDENTS</span>
            <Siren className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-400">{criticalIncidentsCount}</div>
          <div className="text-[10px] text-rose-400 font-semibold">
            3 Hit & Run Tracked
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-md hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">INFRASTRUCTURE</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">94</div>
          <div className="text-[10px] text-slate-400">
            14 Missing Dividers
          </div>
        </div>
      </div>

      {/* 3. MAIN COMMAND SPLIT VIEW: MAP (~65%) vs CRITICAL ALERTS (~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT ~65%: LIVE CITY GIS MAP PREVIEW */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-white">LIVE CITY GIS SENSING MAP</span>
              <span className="text-xs text-slate-400">({cityConfig.cityName})</span>
            </div>
            <Link 
              to="/gis-map" 
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline"
            >
              Open Full GIS Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Leaflet Map Preview Container */}
          <div className="w-full h-80 rounded-lg overflow-hidden border border-slate-800 relative">
            <MapContainer
              center={cityConfig.center}
              zoom={11}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap & CartoDB"
              />

              {/* Render Bus Markers */}
              {buses.slice(0, 15).map(bus => (
                <Marker
                  key={bus.id}
                  position={[bus.latitude, bus.longitude]}
                  icon={createCustomIcon(bus.status === 'ONLINE' ? '#2563eb' : '#f59e0b', 'B')}
                >
                  <Popup>
                    <div className="text-xs p-1">
                      <div className="font-bold text-blue-600">{bus.id}</div>
                      <div>Route: {bus.routeId}</div>
                      <div>Speed: {bus.speed} km/h</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Render Defect Markers */}
              {defects.slice(0, 8).map(def => (
                <Marker
                  key={def.id}
                  position={[def.latitude, def.longitude]}
                  icon={createCustomIcon('#ef4444', '!')}
                >
                  <Popup>
                    <div className="text-xs p-1">
                      <div className="font-bold text-red-600">{def.type}</div>
                      <div>Location: {def.location}</div>
                      <div>Confidence: {(def.confidence * 100).toFixed(1)}%</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-md p-2 text-[10px] text-slate-300 z-[1000] flex items-center space-x-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Active Bus
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Pothole / Defect
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Waterlogging
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT ~35%: CRITICAL ALERTS & EDGE BANDWIDTH WIDGET */}
        <div className="lg:col-span-4 space-y-4">
          {/* Critical Alerts Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col h-[280px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center space-x-2">
                <Siren className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-bold text-white">CRITICAL ALERTS FEED</span>
              </div>
              <span className="text-[10px] text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800 font-bold">
                LIVE
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-800/50">
              {events.slice(0, 4).map(evt => (
                <div 
                  key={evt.id} 
                  onClick={() => setSelectedEvent(evt)}
                  className="pt-2 hover:bg-slate-800/40 p-2 rounded cursor-pointer transition flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={SEVERITY_BADGES[evt.severity] || "bg-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded"}>
                        {evt.severity}
                      </span>
                      <span className="text-xs font-bold text-slate-100">{evt.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Bus <span className="text-blue-400 font-semibold">{evt.busId}</span> • {evt.location}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 whitespace-nowrap">
                    {evt.timeAgo}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edge AI Bandwidth Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Edge AI Processing Telemetry
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Camera Streams</div>
                <div className="font-bold text-slate-200">5 Per Bus (250 Total)</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Raw Video Uploaded</div>
                <div className="font-bold text-rose-400">0 GB (Blocked)</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Events Transmitted</div>
                <div className="font-bold text-amber-400">1,284 Metadata Pkts</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Bandwidth Saved</div>
                <div className="font-bold text-emerald-400">~82.4%</div>
              </div>
            </div>
            <div className="text-[9px] text-slate-500 text-right italic">
              * Estimated / Demo Metric
            </div>
          </div>
        </div>
      </div>

      {/* 4. CHARTS ROW: TRAFFIC DENSITY TREND & ROAD DEFECT TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Traffic Density Over Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Citywide Traffic Density Trend (24h)
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold">Peak Index: 92 at 17:00</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_TRAFFIC_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="densityIndex" stroke="#38bdf8" strokeWidth={2} name="Traffic Index" />
                <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} name="Fleet Speed (km/h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Defects Detected Per Day */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Road Defects Detected Per Day (Weekly)
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">Total: 167 Issues</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEFECTS_OVER_TIME_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="potholes" fill="#f59e0b" name="Potholes" />
                <Bar dataKey="waterlogging" fill="#06b6d4" name="Waterlogging" />
                <Bar dataKey="infrastructure" fill="#a855f7" name="Infrastructure" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. RECENT AI EVENTS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">RECENT AI-DETECTED URBAN EVENTS</span>
          </div>
          <span className="text-xs text-slate-400">Showing latest Edge AI detection logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Event ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Sensing Bus</th>
                <th className="p-3">Location</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((evt) => (
                <tr 
                  key={evt.id}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                  onClick={() => setSelectedEvent(evt)}
                >
                  <td className="p-3 font-mono font-bold text-blue-400">{evt.id}</td>
                  <td className="p-3 font-semibold text-slate-100">{evt.type}</td>
                  <td className="p-3">
                    <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-blue-300 font-mono text-[11px]">
                      {evt.busId}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{evt.location}</td>
                  <td className="p-3 font-mono font-semibold text-emerald-400">
                    {(evt.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-3">
                    <span className={SEVERITY_BADGES[evt.severity] || "bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded"}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{evt.timestamp}</td>
                  <td className="p-3">
                    <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-blue-400 hover:text-blue-300 font-semibold text-[11px]">
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
