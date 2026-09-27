// GisMap.jsx - Dual-Mode Live GIS Urban Sensing & Traffic Congestion Heatmap Page
import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Bus, 
  Flame, 
  ShieldAlert, 
  Activity, 
  SplitSquareVertical, 
  Maximize2, 
  Gauge, 
  Car, 
  TrendingUp, 
  MapPin,
  Sliders,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GisMapContainer } from '../components/map/GisMapContainer';
import { CongestionScaleLegend } from '../components/map/CongestionScaleLegend';
import { EventDetailDrawer } from '../components/events/EventDetailDrawer';
import { TRAFFIC_SUMMARY, CONGESTED_ZONES } from '../data/traffic';

export const GisMap = () => {
  const { events, buses } = useApp();

  // Layout View Modes: 'SPLIT' (2 Parts: Defects & Traffic), 'TRAFFIC' (Traffic Heatmap Only), 'DEFECTS' (Potholes Only), 'COMBINED' (Unified GIS)
  const [viewMode, setViewMode] = useState('SPLIT');

  // Layer Toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showBuses, setShowBuses] = useState(true);
  const [showDefectMarkers, setShowDefectMarkers] = useState(true);

  // Filters
  const [trafficFilterLevel, setTrafficFilterLevel] = useState('ALL'); // 'ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  const [defectFilterType, setDefectFilterType] = useState('ALL'); // 'ALL', 'POTHOLE', 'WATERLOGGING', 'ROAD_CRACK'
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [busFilter, setBusFilter] = useState('ALL');

  // Filtered Events for defects / general
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
      if (busFilter !== 'ALL' && e.busId !== busFilter && (!e.detectedBy || !e.detectedBy.includes(busFilter))) return false;
      if (defectFilterType !== 'ALL' && !e.type.toUpperCase().includes(defectFilterType.toUpperCase())) return false;
      return true;
    });
  }, [events, severityFilter, busFilter, defectFilterType]);

  const potholeCount = useMemo(() => {
    return events.filter(e => e.type?.toUpperCase().includes('POTHOLE')).length;
  }, [events]);

  const totalDefectsCount = useMemo(() => {
    return events.filter(e => e.category === 'ROAD' || e.category === 'INFRASTRUCTURE').length;
  }, [events]);

  const busesToDisplay = showBuses ? buses : [];

  return (
    <div className="space-y-4 pb-8">
      {/* 1. TOP HEADER & TELEMETRY KPI BANNER */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Live GIS Urban Sensing & Spatial Congestion Intelligence
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-Layer GIS mapping: Real-time Edge AI Pothole & Road Hazard Detection alongside Dynamic Traffic Congestion Heatmaps.
            </p>
          </div>

          {/* Quick Telemetry Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded border border-red-200">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              <span>City Congestion: <strong>{TRAFFIC_SUMMARY.trafficIndex}/100</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-800 rounded border border-orange-200">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
              <span>Potholes & Defects: <strong>{totalDefectsCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200">
              <Bus className="w-3.5 h-3.5 text-blue-600" />
              <span>Active Sensing Buses: <strong>{busesToDisplay.length}</strong></span>
            </div>
          </div>
        </div>

        {/* 2. VIEW MODE SELECTOR & LAYER CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Main View Mode Tabs */}
          <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-md border border-slate-200 gap-1 text-xs">
            <button
              onClick={() => setViewMode('SPLIT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition ${
                viewMode === 'SPLIT'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              Dual Split View (2 Parts: Defects & Traffic)
            </button>

            <button
              onClick={() => setViewMode('DEFECTS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition ${
                viewMode === 'DEFECTS'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Part 1: Road Defects & Potholes
            </button>

            <button
              onClick={() => setViewMode('TRAFFIC')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition ${
                viewMode === 'TRAFFIC'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Part 2: Traffic Congestion Heatmap
            </button>

            <button
              onClick={() => setViewMode('COMBINED')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-semibold transition ${
                viewMode === 'COMBINED'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Unified GIS Overlay
            </button>
          </div>

          {/* Quick Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2.5 py-1.5 rounded border text-xs font-semibold flex items-center gap-1 transition ${
                showHeatmap ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Heatmap: {showHeatmap ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setShowCorridors(!showCorridors)}
              className={`px-2.5 py-1.5 rounded border text-xs font-semibold flex items-center gap-1 transition ${
                showCorridors ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Corridors: {showCorridors ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setShowBuses(!showBuses)}
              className={`px-2.5 py-1.5 rounded border text-xs font-semibold flex items-center gap-1 transition ${
                showBuses ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              Buses: {showBuses ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* 3. MULTI-LEVEL FILTER CONTROLS BAR */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Traffic Congestion Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-500" />
              Traffic Scale Filter
            </label>
            <select
              value={trafficFilterLevel}
              onChange={(e) => setTrafficFilterLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Traffic Ranges (0 - 100)</option>
              <option value="LOW">🟢 Low Congestion / Smooth Flow (&lt; 40)</option>
              <option value="MEDIUM">🟡 Moderate Traffic Density (40 - 70)</option>
              <option value="HIGH">🟠 High Congestion Flow (70 - 85)</option>
              <option value="CRITICAL">🔴 Critical Bottlenecks / Severe Jam (&gt; 85)</option>
            </select>
          </div>

          {/* Road Defect Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-orange-500" />
              Road Defect Type
            </label>
            <select
              value={defectFilterType}
              onChange={(e) => setDefectFilterType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Defects & Hazards</option>
              <option value="POTHOLE">🕳️ Potholes Only</option>
              <option value="WATERLOGGING">🌊 Waterlogging Issues</option>
              <option value="CRACK">⚠️ Surface Cracks & Stripping</option>
              <option value="DAMAGED">🚧 Damaged Corridors</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">Defect Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Severity</option>
              <option value="HIGH">High Severity</option>
              <option value="MEDIUM">Medium Severity</option>
              <option value="LOW">Low Severity</option>
            </select>
          </div>

          {/* Bus Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">Sensing Bus Unit</label>
            <select
              value={busFilter}
              onChange={(e) => setBusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
            >
              <option value="ALL">All Transit Buses</option>
              {buses.map((b) => (
                <option key={b.busId} value={b.busId}>
                  {b.busId} ({b.routeId})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. MAIN MAP RENDER SECTION */}
      {viewMode === 'SPLIT' ? (
        /* ================= DUAL SPLIT VIEW (2 PARTS) ================= */
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* PART 1: ROAD DEFECTS & POTHOLES SENSING MAP */}
          <div className="bg-white rounded-md border border-slate-200 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse"></span>
                <span className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  Part 1: Road Defects & Potholes Sensing
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-2 py-0.5 bg-orange-50 text-orange-800 rounded border border-orange-200">
                  {filteredEvents.length} Defects Visualized
                </span>
              </div>
            </div>

            <div className="h-[520px]">
              <GisMapContainer
                mapMode="DEFECTS"
                eventsToDisplay={filteredEvents}
                busesToDisplay={busesToDisplay}
                showHeatmap={showHeatmap}
                showDefectMarkers={showDefectMarkers}
                showBuses={showBuses}
                defectFilterType={defectFilterType}
                height="520px"
              />
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Heatmap highlights spatial defect clustering. Click any pin to inspect Edge AI photo evidence.</span>
              <span className="font-mono text-orange-700 font-semibold">{potholeCount} Potholes Active</span>
            </div>
          </div>

          {/* PART 2: TRAFFIC CONGESTION INTELLIGENCE HEATMAP */}
          <div className="bg-white rounded-md border border-slate-200 p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                <span className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  Part 2: Traffic Congestion Heatmap (Scale: Green → Red)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-200">
                  {CONGESTED_ZONES.length} Corridors Tracked
                </span>
              </div>
            </div>

            <div className="h-[520px]">
              <GisMapContainer
                mapMode="TRAFFIC"
                eventsToDisplay={filteredEvents}
                busesToDisplay={busesToDisplay}
                showHeatmap={showHeatmap}
                showCorridors={showCorridors}
                showHotspots={showHotspots}
                showBuses={showBuses}
                trafficFilterLevel={trafficFilterLevel}
                height="520px"
              />
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
              <span>Dynamic continuous scale: 🟢 Green (Low/Fast) → 🟡 Yellow (Moderate) → 🔴 Red (Heavy Jam).</span>
              <span className="font-mono text-blue-700 font-semibold">{TRAFFIC_SUMMARY.avgFleetSpeed} Fleet Speed</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= FULL SCREEN SINGLE VIEW (DEFECTS, TRAFFIC, OR COMBINED) ================= */
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full animate-pulse ${
                viewMode === 'TRAFFIC' ? 'bg-red-600' :
                viewMode === 'DEFECTS' ? 'bg-orange-600' : 'bg-purple-600'
              }`}></span>
              <span className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                {viewMode === 'TRAFFIC' && 'Part 2: Traffic Congestion Intelligence Heatmap (Full View)'}
                {viewMode === 'DEFECTS' && 'Part 1: Road Defects & Pothole Spatial Sensing (Full View)'}
                {viewMode === 'COMBINED' && 'Unified Multi-Layer GIS Map (Potholes + Traffic Congestion + Transit Fleet)'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200">
                {busesToDisplay.length} Buses Online
              </span>
              {viewMode !== 'TRAFFIC' && (
                <span className="px-2.5 py-1 bg-orange-50 text-orange-800 rounded border border-orange-200">
                  {filteredEvents.length} Events Visible
                </span>
              )}
            </div>
          </div>

          <div className="h-[640px]">
            <GisMapContainer
              mapMode={viewMode}
              eventsToDisplay={filteredEvents}
              busesToDisplay={busesToDisplay}
              showHeatmap={showHeatmap}
              showCorridors={showCorridors}
              showHotspots={showHotspots}
              showBuses={showBuses}
              showDefectMarkers={showDefectMarkers}
              trafficFilterLevel={trafficFilterLevel}
              defectFilterType={defectFilterType}
              height="640px"
            />
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE CONGESTION GRADIENT SCALE & LEGEND BAR */}
      <CongestionScaleLegend mode={viewMode} />

      {/* 6. CORRIDOR CONGESTION SUMMARY TABLE */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Live Spatial Traffic Bottlenecks & Speed Telemetry
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Auto-Refreshed via Transit Edge Nodes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {CONGESTED_ZONES.slice(0, 4).map((zone) => {
            const isJam = zone.trafficIndex > 80;
            const isHigh = zone.trafficIndex > 65;
            return (
              <div 
                key={zone.id} 
                className={`p-3 rounded-md border transition ${
                  isJam 
                    ? 'bg-red-50/70 border-red-200 text-red-950' 
                    : isHigh 
                    ? 'bg-orange-50/70 border-orange-200 text-orange-950' 
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-bold text-xs leading-tight">{zone.zone}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    isJam ? 'bg-red-600 text-white' : isHigh ? 'bg-orange-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {zone.trafficIndex}/100
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 mt-1 font-mono">{zone.corridor}</div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-semibold">Speed: {zone.avgSpeed}</span>
                  <span className="font-mono text-blue-700 font-semibold">{zone.vehicleCount} v/h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. EVENT DETAIL DRAWER MODAL */}
      <EventDetailDrawer />
    </div>
  );
};
