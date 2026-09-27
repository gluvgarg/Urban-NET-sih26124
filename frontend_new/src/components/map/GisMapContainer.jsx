// GisMapContainer.jsx - GIS Leaflet Map with Traffic Congestion Heatmaps, Road Defect Layers, and Fleet Tracking
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { TrafficHeatmapOverlay } from './TrafficHeatmapOverlay';
import { DefectHeatmapOverlay } from './DefectHeatmapOverlay';

// Helper to create Leaflet DivIcons for Buses
const createBusIcon = (busId) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: #2563eb; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 3px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">🚌</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const GisMapContainer = ({
  eventsToDisplay = [],
  busesToDisplay = [],
  height = '100%',
  mapMode = 'COMBINED', // 'TRAFFIC', 'DEFECTS', 'COMBINED'
  showHeatmap = true,
  showCorridors = true,
  showHotspots = true,
  showBuses = true,
  showDefectMarkers = true,
  trafficFilterLevel = 'ALL',
  defectFilterType = 'ALL',
  center = [28.6139, 77.2090], // Delhi NCR Center
  zoom = 12
}) => {
  const { setSelectedEvent } = useApp();

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

        {/* 1. TRAFFIC CONGESTION HEATMAP & CORRIDOR LAYER */}
        {(mapMode === 'TRAFFIC' || mapMode === 'COMBINED') && (
          <TrafficHeatmapOverlay
            showHeatmap={showHeatmap}
            showCorridors={showCorridors}
            showHotspotMarkers={showHotspots}
            opacity={0.8}
            filterLevel={trafficFilterLevel}
          />
        )}

        {/* 2. ROAD DEFECTS & POTHOLE SENSING LAYER */}
        {(mapMode === 'DEFECTS' || mapMode === 'COMBINED') && (
          <DefectHeatmapOverlay
            events={eventsToDisplay}
            showHeatmap={showHeatmap}
            showMarkers={showDefectMarkers}
            opacity={0.75}
            filterType={defectFilterType}
          />
        )}

        {/* 3. TRANSIT BUSES LAYER */}
        {showBuses && busesToDisplay?.map((bus) => {
          if (!bus.lastLocation?.lat || !bus.lastLocation?.lng) return null;
          return (
            <Marker
              key={bus.busId}
              position={[bus.lastLocation.lat, bus.lastLocation.lng]}
              icon={createBusIcon(bus.busId)}
            >
              <Popup>
                <div className="p-1 max-w-xs text-xs space-y-1.5 font-sans">
                  <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-1">
                    <span className="text-blue-600 font-mono">{bus.busId}</span>
                    <span className="text-slate-600 text-[11px]">({bus.registrationNo})</span>
                  </div>
                  <div className="text-slate-700 font-medium text-[11px]">{bus.routeName}</div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Telemetry Speed</span>
                      <span className="font-mono font-bold text-slate-900">{bus.lastLocation.speed} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Edge AI Vision</span>
                      <span className="font-mono font-bold text-emerald-600 uppercase">{bus.edgeStatus || 'Active'}</span>
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
