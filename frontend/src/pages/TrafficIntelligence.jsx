import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  TrendingUp, 
  AlertCircle, 
  Gauge, 
  MapPin, 
  Clock 
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
  Cell 
} from 'recharts';
import { 
  VEHICLE_CLASSIFICATION, 
  CONGESTED_ZONES, 
  ROUTE_PERFORMANCE, 
  HOURLY_TRAFFIC_TREND, 
  TRAFFIC_SUMMARY 
} from '../data/traffic';

export const TrafficIntelligence = () => {
  const { 
    trafficSummary, 
    congestedZones, 
    hourlyTrafficTrend 
  } = useApp();

  const summary = trafficSummary || TRAFFIC_SUMMARY;
  const zonesList = congestedZones && congestedZones.length > 0 ? congestedZones : CONGESTED_ZONES;
  const hourlyData = hourlyTrafficTrend && hourlyTrafficTrend.length > 0 ? hourlyTrafficTrend : HOURLY_TRAFFIC_TREND;

  return (
    <div className="space-y-4 pb-10 text-xs text-slate-800">
      {/* 1. TOP TRAFFIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>VEHICLES DETECTED</span>
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {typeof summary.vehiclesDetectedToday === 'number' 
              ? summary.vehiclesDetectedToday.toLocaleString() 
              : (summary.vehiclesDetectedToday || '18,420')}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">+8.4% Fleet Edge Count</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>CURRENT TRAFFIC INDEX</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-800 font-mono">
            {summary.trafficIndex} <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <div className="text-[10px] text-amber-800 font-medium">Peak Corridor Density</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>CONGESTED ZONES</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-bold text-red-600 font-mono">{summary.congestedZonesCount}</div>
          <div className="text-[10px] text-slate-500">Queue Lengths &gt; 300m</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>AVERAGE FLEET SPEED</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono">{summary.avgFleetSpeed}</div>
          <div className="text-[10px] text-emerald-700 font-medium">Optimal Flow on Expressways</div>
        </div>
      </div>

      {/* 2. CHARTS SPLIT: VEHICLE CLASSIFICATION & HOURLY DENSITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT ~40%: VEHICLE CLASSIFICATION DONUT & BREAKDOWN */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Edge AI Vehicle Classification
            </span>
            <span className="text-[10px] text-slate-500 font-mono">5 Categories</span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={VEHICLE_CLASSIFICATION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {VEHICLE_CLASSIFICATION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '11px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Classification Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-3">
            {VEHICLE_CLASSIFICATION.map(item => (
              <div key={item.name} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-slate-900 font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT ~60%: HOURLY TRAFFIC DENSITY TREND */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              24-Hour Traffic Volume & Speed Telemetry
            </span>
            <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              LIVE AGGREGATION
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '11px', color: '#0f172a' }} />
                <Line type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} name="Vehicle Count" />
                <Line type="monotone" dataKey="speed" stroke="#059669" strokeWidth={1.5} name="Avg Speed (km/h)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. CONGESTED ZONES & ROUTE PERFORMANCE TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Congested Zones Table */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">CONGESTED TRAFFIC CORRIDORS</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Current Bottlenecks</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200 font-mono">
                <tr>
                  <th className="p-2.5">Corridor Zone</th>
                  <th className="p-2.5">Traffic Index</th>
                  <th className="p-2.5">Avg Speed</th>
                  <th className="p-2.5">Vehicles/hr</th>
                  <th className="p-2.5 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {zonesList.map((zone, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 font-bold text-slate-900">{zone.zone}</td>
                    <td className="p-2.5 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                        zone.trafficIndex > 80 ? 'bg-red-50 text-red-700 border-red-200' :
                        zone.trafficIndex > 60 ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {zone.trafficIndex}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700 font-mono">{zone.avgSpeed}</td>
                    <td className="p-2.5 text-blue-700 font-mono font-semibold">{zone.vehicleCount}</td>
                    <td className="p-2.5 text-right font-mono text-red-600 font-bold">{zone.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Delay Estimation Table */}
        <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">PUBLIC ROUTE DELAY ESTIMATION</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Transit Fleet Telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200 font-mono">
                <tr>
                  <th className="p-2.5">Route</th>
                  <th className="p-2.5">Normal Time</th>
                  <th className="p-2.5">Current Time</th>
                  <th className="p-2.5">Delay</th>
                  <th className="p-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ROUTE_PERFORMANCE.map((route, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-2.5 font-bold text-slate-900">{route.route}</td>
                    <td className="p-2.5 text-slate-500 font-mono">{route.normalTime}</td>
                    <td className="p-2.5 text-slate-800 font-mono font-semibold">{route.currentTime}</td>
                    <td className="p-2.5 font-mono font-bold text-red-600">{route.delay}</td>
                    <td className="p-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                        route.status === 'Delayed' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
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
