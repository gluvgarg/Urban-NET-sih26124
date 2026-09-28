// GisMapContainer.jsx - GIS Leaflet Map with Real Buses and Events Overlay
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { DefectHeatmapOverlay } from './DefectHeatmapOverlay';
import { BusStatusBadge } from '../common/Badge';

// Leaflet DivIcon for Buses
const createBusIcon = (status) => {
  const isOnline = status === 'ONLINE';
  const bgColor = isOnline ? '#059669' : '#64748b'; // Emerald if online, Slate if offline
  return L.divIcon({
    className: 'custom-bus-marker',
    html: `<div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 3px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">🚌</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const GisMapContainer = ({
  eventsToDisplay = [],
  busesToDisplay = [],
  height = '100%',
  showHeatmap = true,
  showBuses = true,
  showDefectMarkers = true,
  center = [28.6139, 77.2090], // Default Delhi NCR Center
  zoom = 12
}) => {
  return (
    <div className="w-full h-full relative rounded-md overflow-hidden border border-slate-200 shadow-xs" style={{ minHeight: '380px', height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. REAL EVENTS LAYER */}
        <DefectHeatmapOverlay
          events={eventsToDisplay}
          showHeatmap={showHeatmap}
          showMarkers={showDefectMarkers}
          opacity={0.75}
        />

        {/* 2. REAL BUSES LAYER */}
        {showBuses && busesToDisplay?.map((bus) => {
          const lat = bus.location?.lat;
          const lng = bus.location?.lng;
          if (typeof lat !== 'number' || typeof lng !== 'number' || (lat === 0 && lng === 0)) return null;

          return (
            <Marker
              key={bus.busId}
              position={[lat, lng]}
              icon={createBusIcon(bus.status)}
            >
              <Popup>
                <div className="p-1 max-w-xs text-xs space-y-1.5 font-sans">
                  <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1 gap-2">
                    <span className="text-blue-600 font-mono">{bus.busId}</span>
                    <BusStatusBadge status={bus.status} />
                  </div>
                  <div className="text-slate-700 font-medium text-[11px]">Route: {bus.route || 'N/A'}</div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Telemetry Speed</span>
                      <span className="font-mono font-bold text-slate-900">{bus.speed || 0} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Coordinates</span>
                      <span className="font-mono font-bold text-slate-700">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
