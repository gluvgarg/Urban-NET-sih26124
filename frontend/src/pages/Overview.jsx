import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
  Bar 
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
  Layers, 
  Eye, 
  ChevronRight
} from 'lucide-react';
import { HOURLY_TRAFFIC_TREND } from '../data/traffic';
import { DEFECTS_OVER_TIME_TREND } from '../data/analytics';
import { SEVERITY_BADGES } from '../data/events';

// Leaflet default marker creation helper
const createCustomIcon = (color, label = '') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.4);">
        ${label}
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const Overview = () => {
  const { 
    cityConfig, 
    buses, 
    events, 
    defects, 
    infrastructure,
    incidents, 
    dashboardSummary,
    trafficSummary,
    hourlyTrafficTrend,
    defectsOverTimeTrend,
    setSelectedEvent
  } = useApp();

  const activeBusesCount = dashboardSummary?.activeBuses ?? buses.filter(b => b.status === 'ONLINE').length;
  const totalBusesCount = dashboardSummary?.totalBuses ?? buses.length;
  const eventsCount = dashboardSummary?.eventsTotal ?? events.length;
  const defectsCount = dashboardSummary?.roadDefectsTotal ?? defects.length;
  const trafficAlertsCount = dashboardSummary?.trafficAlerts ?? trafficSummary?.congestedZonesCount ?? 28;
  const criticalIncidentsCount = dashboardSummary?.criticalIncidents ?? incidents.filter(i => i.severity === 'CRITICAL').length;
  const infraCount = dashboardSummary?.infrastructureTotal ?? infrastructure.length;

  const trafficChartData = hourlyTrafficTrend && hourlyTrafficTrend.length > 0 ? hourlyTrafficTrend : HOURLY_TRAFFIC_TREND;
  const defectChartData = defectsOverTimeTrend && defectsOverTimeTrend.length > 0 ? defectsOverTimeTrend : DEFECTS_OVER_TIME_TREND;

  return (
    <div className="space-y-4 pb-10 text-xs">
      {/* 1. OPERATIONAL PIPELINE STEPPER */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3">
        <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-1.5 text-slate-400 text-[11px] font-bold">
          <span className="uppercase tracking-wider">Mobile Sensing & Response Flow</span>
          <span className="font-mono text-[10px]">Public Transport Edge Infrastructure</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { step: '01', title: 'TRANSIT FLEET', desc: `${totalBusesCount} Sensing Units` },
            { step: '02', title: 'EDGE INFERENCE', desc: 'Onboard Vision Processing' },
            { step: '03', title: 'EVENT DETECTIONS', desc: 'Bandwidth Optimized' },
            { step: '04', title: 'CENTRAL BACKEND', desc: 'SQLite & Geo-Deduplication' },
            { step: '05', title: 'GIS ANALYTICS', desc: 'Spatial Mapping' },
            { step: '06', title: 'COMMAND DISPATCH', desc: 'Municipal Action' }
          ].map((item, idx) => (
            <div 
              key={item.step}
              className="bg-slate-950 border border-slate-800 rounded p-2 text-left space-y-0.5"
            >
              <div className="flex items-center justify-between text-[9px] font-mono text-blue-400 font-bold">
                <span>STEP {item.step}</span>
                {idx < 5 && <ChevronRight className="w-3 h-3 text-slate-600 hidden lg:block" />}
              </div>
              <div className="font-bold text-slate-200 text-[11px]">{item.title}</div>
              <div className="text-[10px] text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TOP COMMAND KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>ACTIVE BUSES</span>
            <Bus className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {activeBusesCount} <span className="text-xs text-slate-500 font-normal">/ {totalBusesCount}</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {totalBusesCount > 0 ? Math.round((activeBusesCount / totalBusesCount) * 100) : 84}% Operational
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>EVENTS LOGGED</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{eventsCount.toLocaleString()}</div>
          <div className="text-[10px] text-amber-400">
            Live AI Telemetry
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>ROAD DEFECTS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{defectsCount}</div>
          <div className="text-[10px] text-slate-400">
            Potholes & Waterlogging
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>TRAFFIC ALERTS</span>
            <Car className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{trafficAlertsCount}</div>
          <div className="text-[10px] text-cyan-400">
            Congested Corridors
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>CRITICAL INCIDENTS</span>
            <Siren className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono">{criticalIncidentsCount}</div>
          <div className="text-[10px] text-rose-400">
            Safety Logged
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>INFRASTRUCTURE</span>
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{infraCount}</div>
          <div className="text-[10px] text-slate-400">
            Dividers & Signage
          </div>
        </div>
      </div>

      {/* 3. MAIN COMMAND SPLIT: GIS MAP WORKSTATION (65%) vs INCIDENT QUEUE (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT ~65%: LIVE GIS MAP PREVIEW */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded p-3 flex flex-col space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">LIVE CITY GIS WORKSTATION</span>
              <span className="text-[11px] text-slate-400">({cityConfig.cityName})</span>
            </div>
            <Link 
              to="/gis-map" 
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline"
            >
              Full GIS View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Leaflet Map Workstation */}
          <div className="w-full h-80 rounded overflow-hidden border border-slate-800 relative">
            <MapContainer
              center={cityConfig.center}
              zoom={11}
              style={{ width: '100%', height: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Render Bus Markers */}
              {buses.slice(0, 15).map(bus => (
                <Marker
                  key={bus.id}
                  position={[bus.latitude, bus.longitude]}
                  icon={createCustomIcon(bus.status === 'ONLINE' ? '#2563eb' : '#d97706', 'B')}
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
                  icon={createCustomIcon('#dc2626', '!')}
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

            {/* Map Overlay Legend */}
            <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-slate-800 rounded px-2.5 py-1 text-[10px] text-slate-300 z-[1000] flex items-center space-x-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Active Bus
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Pothole / Defect
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Waterlogging
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT ~35%: CRITICAL INCIDENT QUEUE & OPERATIONAL TELEMETRY */}
        <div className="lg:col-span-4 space-y-3">
          {/* Incident Operations Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-col h-[260px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center space-x-1.5">
                <Siren className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">INCIDENT QUEUE</span>
              </div>
              <span className="text-[9px] text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800 font-mono">
                LIVE
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800/60">
              {events.slice(0, 4).map(evt => (
                <div 
                  key={evt.id} 
                  onClick={() => setSelectedEvent(evt)}
                  className="pt-1.5 hover:bg-slate-800/60 p-1.5 rounded cursor-pointer transition flex items-start justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className={SEVERITY_BADGES[evt.severity] || "bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded font-mono"}>
                        {evt.severity}
                      </span>
                      <span className="text-xs font-bold text-slate-100">{evt.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Bus <span className="text-blue-400 font-mono">{evt.busId}</span> • {evt.location}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {evt.timeAgo || 'Just now'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Edge AI Telemetry */}
          <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Edge AI Telemetry
                </span>
              </div>
              <span className="text-[9px] text-emerald-400 font-mono">ACTIVE</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Camera Streams</div>
                <div className="font-bold text-slate-200 font-mono">{totalBusesCount * 5} Active</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Video Uploaded</div>
                <div className="font-bold text-slate-400 font-mono">0 GB (Filtered)</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Event Packets</div>
                <div className="font-bold text-amber-400 font-mono">{eventsCount.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Bandwidth Saved</div>
                <div className="font-bold text-emerald-400 font-mono">~82.4%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CHARTS ROW: TRAFFIC DENSITY TREND & ROAD DEFECT TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Traffic Density Over Time */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Citywide Traffic Density (24h)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Peak: Index 92 at 17:00</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="densityIndex" stroke="#3b82f6" strokeWidth={2} name="Traffic Index" dot={false} />
                <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={1.5} name="Fleet Speed (km/h)" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Defects Detected Per Day */}
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Road Defects Per Day (Weekly)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Total: {defectsCount} Issues</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defectChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '11px' }}
                />
                <Bar dataKey="potholes" fill="#d97706" name="Potholes" />
                <Bar dataKey="waterlogging" fill="#0284c7" name="Waterlogging" />
                <Bar dataKey="infrastructure" fill="#9333ea" name="Infrastructure" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. RECENT AI EVENTS OPERATIONAL LOG */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Edge AI Detection Log</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Latest Ingested Operations Log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="p-2">Event ID</th>
                <th className="p-2">Type</th>
                <th className="p-2">Sensing Bus</th>
                <th className="p-2">Location</th>
                <th className="p-2">Confidence</th>
                <th className="p-2">Severity</th>
                <th className="p-2">Timestamp</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {events.map((evt) => (
                <tr 
                  key={evt.id}
                  className="hover:bg-slate-800/50 transition cursor-pointer"
                  onClick={() => setSelectedEvent(evt)}
                >
                  <td className="p-2 font-mono font-bold text-blue-400">{evt.id}</td>
                  <td className="p-2 font-semibold text-slate-100">{evt.type}</td>
                  <td className="p-2">
                    <span className="bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[10px]">
                      {evt.busId}
                    </span>
                  </td>
                  <td className="p-2 text-slate-300">{evt.location}</td>
                  <td className="p-2 font-mono font-semibold text-emerald-400">
                    {(evt.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-2">
                    <span className={SEVERITY_BADGES[evt.severity] || "bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded font-mono"}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="p-2 text-slate-400 font-mono text-[10px]">{evt.timestamp}</td>
                  <td className="p-2">
                    <span className="text-[10px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                      {evt.status}
                    </span>
                  </td>
                  <td className="p-2 text-right">
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
