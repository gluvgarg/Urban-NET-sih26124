import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { 
  Filter, 
  MapPin, 
  Bus, 
  AlertTriangle, 
  ShieldAlert, 
  Siren, 
  Layers, 
  Eye, 
  X, 
  CheckCircle2, 
  Clock, 
  Zap, 
  SlidersHorizontal 
} from 'lucide-react';
import { SEVERITY_BADGES } from '../data/events';

const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">
        ${symbol}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const GisMap = () => {
  const { 
    cityConfig, 
    buses, 
    events, 
    defects, 
    infrastructure, 
    incidents, 
    selectedEvent, 
    setSelectedEvent,
    mapFilters,
    setMapFilters 
  } = useApp();

  const [activeLayers, setActiveLayers] = useState({
    buses: true,
    defects: true,
    infrastructure: true,
    incidents: true
  });

  // Filter Events Logic
  const filteredEvents = events.filter(evt => {
    if (mapFilters.eventType !== 'ALL' && evt.type !== mapFilters.eventType) return false;
    if (mapFilters.severity !== 'ALL' && evt.severity !== mapFilters.severity) return false;
    if (mapFilters.busId !== 'ALL' && evt.busId !== mapFilters.busId) return false;
    return true;
  });

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 relative">
      {/* LEFT FILTER & CONTROL PANEL */}
      <div className="w-full lg:w-80 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col space-y-4 shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">GIS Map Controls</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">LIVE SPATIAL</span>
        </div>

        {/* LAYER TOGGLES */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Map Layers</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setActiveLayers(p => ({ ...p, buses: !p.buses }))}
              className={`p-2 rounded border text-left flex items-center justify-between transition ${
                activeLayers.buses 
                  ? 'bg-blue-950/80 border-blue-600 text-blue-300 font-semibold' 
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5"><Bus className="w-3.5 h-3.5" /> Buses (50)</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </button>

            <button
              onClick={() => setActiveLayers(p => ({ ...p, defects: !p.defects }))}
              className={`p-2 rounded border text-left flex items-center justify-between transition ${
                activeLayers.defects 
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300 font-semibold' 
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Defects</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </button>

            <button
              onClick={() => setActiveLayers(p => ({ ...p, infrastructure: !p.infrastructure }))}
              className={`p-2 rounded border text-left flex items-center justify-between transition ${
                activeLayers.infrastructure 
                  ? 'bg-purple-950/80 border-purple-600 text-purple-300 font-semibold' 
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Infra</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </button>

            <button
              onClick={() => setActiveLayers(p => ({ ...p, incidents: !p.incidents }))}
              className={`p-2 rounded border text-left flex items-center justify-between transition ${
                activeLayers.incidents 
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300 font-semibold' 
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Safety</span>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            </button>
          </div>
        </div>

        {/* EVENT TYPE FILTER */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Event Type Filter</label>
          <select
            value={mapFilters.eventType}
            onChange={(e) => setMapFilters(p => ({ ...p, eventType: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="POTHOLE">Pothole</option>
            <option value="DAMAGED_ROAD">Damaged Road</option>
            <option value="WATERLOGGING">Waterlogging</option>
            <option value="MISSING_DIVIDER">Missing Divider</option>
            <option value="MISSING_ZEBRA_CROSSING">Missing Zebra Crossing</option>
            <option value="DAMAGED_SIGNBOARD">Damaged Signboard</option>
            <option value="TRAFFIC_BOTTLENECK">Traffic Bottleneck</option>
            <option value="HIT_AND_RUN">Hit and Run Incident</option>
            <option value="RASH_DRIVING">Rash Driving</option>
          </select>
        </div>

        {/* SEVERITY FILTER */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Severity Level</label>
          <select
            value={mapFilters.severity}
            onChange={(e) => setMapFilters(p => ({ ...p, severity: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* BUS FILTER */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sensing Bus Unit</label>
          <select
            value={mapFilters.busId}
            onChange={(e) => setMapFilters(p => ({ ...p, busId: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Buses (50)</option>
            <option value="BUS_01">BUS_01 (Route 101)</option>
            <option value="BUS_07">BUS_07 (Route 402)</option>
            <option value="BUS_12">BUS_12 (Route 204)</option>
            <option value="BUS_17">BUS_17 (Route 101)</option>
            <option value="BUS_23">BUS_23 (Route 305)</option>
            <option value="BUS_31">BUS_31 (Route 101)</option>
            <option value="BUS_42">BUS_42 (Route 509)</option>
          </select>
        </div>

        {/* SUMMARY STATS */}
        <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Filtered Events Visible:</span>
            <span className="font-bold text-white">{filteredEvents.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Active Bus Sensors:</span>
            <span className="font-bold text-blue-400">42 Online</span>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN MAP VIEW */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl relative">
        <MapContainer
          center={cityConfig.center}
          zoom={cityConfig.zoom}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap & CartoDB"
          />

          {/* BUS MARKERS */}
          {activeLayers.buses && buses.map(bus => (
            <Marker
              key={bus.id}
              position={[bus.latitude, bus.longitude]}
              icon={createCustomIcon(bus.status === 'ONLINE' ? '#2563eb' : '#f59e0b', '🚌')}
            >
              <Popup>
                <div className="text-xs p-1 space-y-1">
                  <div className="font-bold text-blue-600">{bus.id} • {bus.vehicleReg}</div>
                  <div>Route: {bus.routeName}</div>
                  <div>Status: <span className="font-semibold text-emerald-600">{bus.status}</span></div>
                  <div>Edge AI: {bus.edgeAiHealth}</div>
                  <div>Speed: {bus.speed} km/h</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* DETECTED EVENTS MARKERS */}
          {filteredEvents.map(evt => {
            let color = '#f59e0b';
            let iconSymbol = '!';
            if (evt.severity === 'CRITICAL') { color = '#dc2626'; iconSymbol = '🚨'; }
            else if (evt.type === 'POTHOLE') { color = '#ea580c'; iconSymbol = '🕳️'; }
            else if (evt.type === 'WATERLOGGING') { color = '#0284c7'; iconSymbol = '🌊'; }
            else if (evt.type === 'MISSING_DIVIDER') { color = '#9333ea'; iconSymbol = '🚧'; }

            return (
              <Marker
                key={evt.id}
                position={[evt.latitude, evt.longitude]}
                icon={createCustomIcon(color, iconSymbol)}
                eventHandlers={{
                  click: () => setSelectedEvent(evt)
                }}
              >
                <Popup>
                  <div className="text-xs p-1 space-y-1">
                    <div className="font-bold text-slate-900">{evt.id} — {evt.type}</div>
                    <div>Location: {evt.location}</div>
                    <div>Confidence: {(evt.confidence * 100).toFixed(1)}%</div>
                    <div>Bus: {evt.busId}</div>
                    <button 
                      onClick={() => setSelectedEvent(evt)}
                      className="mt-1 bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold w-full"
                    >
                      View Evidence & Telemetry →
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* MAP LEGEND OVERLAY */}
        <div className="absolute bottom-4 right-4 bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-2xl text-xs text-slate-300 z-[1000] space-y-1.5">
          <div className="font-bold text-white border-b border-slate-800 pb-1 text-[11px] uppercase tracking-wider">
            Map Legend
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Transit Bus</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Critical Safety</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pothole / Defect</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Waterlogging</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Infrastructure</span>
          </div>
        </div>

        {/* EVENT DETAIL DRAWER MODAL */}
        {selectedEvent && (
          <div className="absolute top-4 right-4 w-96 bg-slate-900/95 border border-slate-700 rounded-xl p-5 shadow-2xl z-[1000] text-xs text-slate-200 space-y-4 backdrop-blur-md animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="font-mono font-bold text-blue-400">{selectedEvent.id}</span>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-base font-black text-white">{selectedEvent.type}</div>
              <div className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {selectedEvent.location}
              </div>
            </div>

            {/* Evidence Image Snapshot */}
            <div className="relative rounded-lg overflow-hidden border border-slate-800">
              <img 
                src={selectedEvent.evidenceImage} 
                alt="Edge AI Evidence Snapshot"
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono font-semibold">
                AI Confidence: {(selectedEvent.confidence * 100).toFixed(1)}%
              </div>
            </div>

            {/* Telemetry Breakdown */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded border border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px]">Sensing Bus ID:</span>
                <div className="font-bold text-blue-400 font-mono">{selectedEvent.busId}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Severity Level:</span>
                <div>
                  <span className={SEVERITY_BADGES[selectedEvent.severity] || "bg-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded"}>
                    {selectedEvent.severity}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">GPS Coordinates:</span>
                <div className="font-mono text-slate-300 text-[11px]">{selectedEvent.latitude}, {selectedEvent.longitude}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Timestamp:</span>
                <div className="font-mono text-slate-300 text-[11px]">{selectedEvent.timestamp.split('T')[1] || selectedEvent.timestamp}</div>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
              {selectedEvent.description}
            </p>

            <div className="flex gap-2 pt-1">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded text-xs transition"
              >
                Acknowledge Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
