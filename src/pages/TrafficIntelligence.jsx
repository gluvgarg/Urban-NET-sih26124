import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  TrendingUp, 
  AlertCircle, 
  Gauge, 
  MapPin, 
  Activity, 
  Clock, 
  ShieldAlert 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  VEHICLE_CLASSIFICATION, 
  CONGESTED_ZONES, 
  ROUTE_PERFORMANCE, 
  HOURLY_TRAFFIC_TREND, 
  TRAFFIC_SUMMARY 
} from '../data/traffic';

export const TrafficIntelligence = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP TRAFFIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>VEHICLES DETECTED</span>
            <Car className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{TRAFFIC_SUMMARY.vehiclesDetectedToday.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">+8.4% Fleet Edge Count</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>CURRENT TRAFFIC INDEX</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{TRAFFIC_SUMMARY.trafficIndex} <span className="text-sm text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[10px] text-amber-400 font-semibold">High Morning Peak</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>CONGESTED ZONES</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-400">{TRAFFIC_SUMMARY.congestedZonesCount}</div>
          <div className="text-[10px] text-slate-400">Queue Lengths &gt; 300m</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>AVERAGE FLEET SPEED</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{TRAFFIC_SUMMARY.avgFleetSpeed}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Optimal Flow on Expressways</div>
        </div>
      </div>

      {/* 2. CHARTS SPLIT: VEHICLE CLASSIFICATION & HOURLY DENSITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT ~40%: VEHICLE CLASSIFICATION DONUT & BREAKDOWN */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Edge AI Vehicle Classification
            </span>
            <span className="text-[10px] text-slate-400">5 Categories Detected</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VEHICLE_CLASSIFICATION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {VEHICLE_CLASSIFICATION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Classification Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
            {VEHICLE_CLASSIFICATION.map(item => (
              <div key={item.name} className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-white font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ~60%: HOURLY TRAFFIC DENSITY TREND */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              24-Hour Traffic Volume & Speed Telemetry
            </span>
            <span className="text-[10px] text-blue-400 font-mono">LIVE AGGREGATION</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_TRAFFIC_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2.5} name="Vehicle Count" />
                <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} name="Avg Speed (km/h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. CONGESTED ZONES & ROUTE PERFORMANCE TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Congested Zones Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-white">CONGESTED TRAFFIC CORRIDORS</span>
            </div>
            <span className="text-xs text-slate-400">Current bottlenecks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Corridor Zone</th>
                  <th className="p-2.5">Traffic Index</th>
                  <th className="p-2.5">Avg Speed</th>
                  <th className="p-2.5">Vehicles/hr</th>
                  <th className="p-2.5 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {CONGESTED_ZONES.map((zone, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 font-bold text-slate-100">{zone.zone}</td>
                    <td className="p-2.5 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        zone.trafficIndex > 80 ? 'bg-red-950 text-red-400 border border-red-800' :
                        zone.trafficIndex > 60 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {zone.trafficIndex}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300 font-mono">{zone.avgSpeed}</td>
                    <td className="p-2.5 text-blue-400 font-mono font-semibold">{zone.vehicleCount}</td>
                    <td className="p-2.5 text-right font-mono text-rose-400 font-bold">{zone.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Delay Estimation Table (PS Requirement) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white">PUBLIC ROUTE DELAY ESTIMATION</span>
            </div>
            <span className="text-xs text-slate-400">Transit Fleet Delay Telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Route</th>
                  <th className="p-2.5">Normal Time</th>
                  <th className="p-2.5">Current Time</th>
                  <th className="p-2.5">Delay</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ROUTE_PERFORMANCE.map((route, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 font-bold text-slate-100">{route.route}</td>
                    <td className="p-2.5 text-slate-400 font-mono">{route.normalTime}</td>
                    <td className="p-2.5 text-slate-200 font-mono font-semibold">{route.currentTime}</td>
                    <td className="p-2.5 font-mono font-bold text-rose-400">{route.delay}</td>
                    <td className="p-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        route.status === 'Delayed' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {route.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
