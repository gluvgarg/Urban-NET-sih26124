import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  Filter, 
  Bus, 
  AlertTriangle, 
  ShieldAlert, 
  Siren, 
  MapPin, 
  X, 
  Zap,
  Radio
} from 'lucide-react';
import { SEVERITY_BADGES } from '../data/events';

const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-map-icon',
    html: `
      <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        ${symbol}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const GisMap = () => {
  const { 
    cityConfig, 
    buses, 
    events, 
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
    <div className="h-[calc(100vh-95px)] flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-3 relative text-xs text-slate-800">
      {/* LEFT CONTROL PANEL */}
      <div className="w-full lg:w-72 bg-white border border-slate-200 rounded-md p-3 flex flex-col space-y-3 shrink-0 overflow-y-auto shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">GIS Map Controls</span>
          </div>
          <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
            SPATIAL ENGINE
          </span>
        </div>

        {/* LAYER TOGGLES */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Map Layers</div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => setActiveLayers(p => ({ ...p, buses: !p.buses }))}
              className={`p-1.5 rounded border text-left flex items-center justify-between transition ${
                activeLayers.buses 
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' 
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5"><Bus className="w-3.5 h-3.5" /> Buses</span>
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            </button>

            <button
              onClick={() => setActiveLayers(p => ({ ...p, defects: !p.defects }))}
              className={`p-1.5 rounded border text-left flex items-center justify-between transition ${
                activeLayers.defects 
                  ? 'bg-amber-50 border-amber-500 text-amber-800 font-semibold' 
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Defects</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </button>

            <button
              onClick={() => setActiveLayers(p => ({ ...p, infrastructure: !p.infrastructure }))}
              className={`p-1.5 rounded border text-left flex items-center justify-between transition ${
                activeLayers.infrastructure 
                  ? 'bg-purple-50 border-purple-500 text-purple-800 font-semibold' 
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Infra</span>
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            </button>

            <button
              onClick={() => setActiveLayers(p => ({ ...p, incidents: !p.incidents }))}
              className={`p-1.5 rounded border text-left flex items-center justify-between transition ${
                activeLayers.incidents 
                  ? 'bg-red-50 border-red-500 text-red-700 font-semibold' 
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Safety</span>
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
            </button>
          </div>
        </div>

        {/* EVENT TYPE FILTER */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Event Type Filter</label>
          <select
            value={mapFilters.eventType}
            onChange={(e) => setMapFilters(p => ({ ...p, eventType: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Severity Level</label>
          <select
            value={mapFilters.severity}
            onChange={(e) => setMapFilters(p => ({ ...p, severity: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* BUS FILTER */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Sensing Bus Unit</label>
          <select
            value={mapFilters.busId}
            onChange={(e) => setMapFilters(p => ({ ...p, busId: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Buses ({buses.length})</option>
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
        <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-600 font-medium">
          <div className="flex justify-between">
            <span>Events Visible:</span>
            <span className="font-bold text-slate-900 font-mono">{filteredEvents.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Bus Sensors:</span>
            <span className="font-bold text-blue-700 font-mono">{buses.filter(b => b.status === 'ONLINE').length} Online</span>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN MAP VIEW */}
      <div className="flex-1 bg-white border border-slate-200 rounded-md overflow-hidden relative shadow-sm">
        <MapContainer
          center={cityConfig.center}
          zoom={cityConfig.zoom}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* BUS MARKERS */}
          {activeLayers.buses && buses.map(bus => (
            <Marker
              key={bus.id}
              position={[bus.latitude, bus.longitude]}
              icon={createCustomIcon(bus.status === 'ONLINE' ? '#2563eb' : '#d97706', 'B')}
            >
              <Popup>
                <div className="text-xs p-1 space-y-1">
                  <div className="font-bold text-blue-700">{bus.id} • {bus.vehicleReg}</div>
                  <div>Route: {bus.routeName}</div>
                  <div>Status: <span className="font-semibold text-emerald-600">{bus.status}</span></div>
                  <div>Edge AI: {bus.edgeAiHealth}</div>
                  <div>Speed: {bus.speed} km/h</div>
                  <div className="pt-1 border-t border-slate-200 text-[10px] font-mono text-blue-600 font-semibold">
                    SOURCE: EDGE AI SENSING UNIT
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* DETECTED EVENTS MARKERS */}
          {filteredEvents.map(evt => {
            const lat = parseFloat(evt.latitude ?? evt.location?.latitude);
            const lng = parseFloat(evt.longitude ?? evt.location?.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            let color = '#f59e0b';
            let iconSymbol = '!';
            if (evt.severity === 'CRITICAL') { color = '#dc2626'; iconSymbol = '🚨'; }
            else if (evt.type === 'POTHOLE' || evt.type === 'Pothole') { color = '#ea580c'; iconSymbol = '🕳️'; }
            else if (evt.type === 'WATERLOGGING' || evt.type === 'Waterlogging') { color = '#0284c7'; iconSymbol = '🌊'; }
            else if (evt.type === 'MISSING_DIVIDER' || evt.type === 'Missing_Divider') { color = '#9333ea'; iconSymbol = '🚧'; }

            return (
              <Marker
                key={evt.id}
                position={[lat, lng]}
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
                    <div className="text-[10px] font-mono font-bold text-blue-700">
                      {/* {isEdge ? 'SOURCE: EDGE AI' : 'SOURCE: DEMO'} */}
                    </div>
                    <button 
                      onClick={() => setSelectedEvent(evt)}
                      className="mt-1 bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold w-full"
                    >
                      View Telemetry →
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* MAP LEGEND OVERLAY */}
        <div className="absolute bottom-3 right-3 bg-white/95 border border-slate-300 rounded p-2 text-xs text-slate-800 z-[1000] space-y-1 shadow-sm font-medium">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-[10px] uppercase tracking-wider font-mono">
            Map Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Transit Bus</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600"></span> Safety Incident</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pothole / Defect</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> Waterlogging</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Infrastructure</span>
          </div>
        </div>

        {/* EVENT DETAIL DRAWER MODAL */}
        {selectedEvent && (
          <div className="absolute top-3 right-3 w-88 bg-white border border-slate-300 rounded-md p-4 shadow-lg z-[1000] text-xs text-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-blue-700">{selectedEvent.id}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  SOURCE: EDGE AI
                </span>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-slate-500 hover:text-slate-900 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-0.5">
              <div className="text-sm font-bold text-slate-900">{selectedEvent.type}</div>
              <div className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> {selectedEvent.location}
              </div>
            </div>

            {/* Evidence Image Snapshot */}
            <div className="relative rounded overflow-hidden border border-slate-200">
              <img 
                src={selectedEvent.evidenceImage} 
                alt="Edge AI Evidence Snapshot"
                className="w-full h-36 object-cover"
              />
              <div className="absolute bottom-1.5 left-1.5 bg-white/95 px-2 py-0.5 rounded text-[9px] text-emerald-700 font-mono font-bold border border-emerald-300">
                Confidence: {((selectedEvent.confidence || 0.94) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Telemetry Breakdown */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div>
                <span className="text-slate-500 text-[9px]">Sensing Bus Unit:</span>
                <div className="font-bold text-blue-700 font-mono">{selectedEvent.busId}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[9px]">Severity Level:</span>
                <div>
                  <span className={SEVERITY_BADGES[selectedEvent.severity] || "bg-slate-200 text-slate-800 text-[9px] px-1.5 py-0.5 rounded font-mono"}>
                    {selectedEvent.severity}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[9px]">Coordinates:</span>
                <div className="font-mono text-slate-700 text-[10px]">{selectedEvent.latitude}, {selectedEvent.longitude}</div>
              </div>
              <div>
                <span className="text-slate-500 text-[9px]">Timestamp:</span>
                <div className="font-mono text-slate-700 text-[10px]">{selectedEvent.timestamp ? selectedEvent.timestamp.replace('T', ' ') : 'Just now'}</div>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
              {selectedEvent.description}
            </p>

            <div className="flex gap-2 pt-1">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded text-xs transition"
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
