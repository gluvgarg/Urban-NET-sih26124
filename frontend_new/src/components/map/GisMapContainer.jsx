// GisMapContainer.jsx - GIS Leaflet Map with custom bus & event markers

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { SeverityBadge, CategoryBadge } from '../common/Badge';

// Helper to create Leaflet DivIcons for Buses and Events
const createCustomIcon = (type, color, label = '') => {
  if (type === 'BUS') {
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background-color: #2563eb; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">🚌</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  }

  // Event Marker
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px;">•</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const getEventColor = (event) => {
  if (event.severity === 'CRITICAL' || event.category === 'SAFETY') return '#dc2626'; // Red
  if (event.category === 'ROAD') return '#ea580c'; // Orange
  if (event.category === 'INFRASTRUCTURE') return '#7c3aed'; // Purple
  if (event.category === 'TRAFFIC') return '#d97706'; // Amber
  return '#2563eb';
};

export const GisMapContainer = ({ eventsToDisplay, busesToDisplay, height = '100%' }) => {
  const { setSelectedEvent } = useApp();

  const centerCoordinates = [28.6139, 77.2090]; // Delhi NCR Center

  return (
    <div className="w-full h-full relative rounded-md overflow-hidden border border-slate-200 shadow-xs" style={{ minHeight: '420px', height }}>
      <MapContainer
        center={centerCoordinates}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Bus Markers */}
        {busesToDisplay?.map((bus) => {
          if (!bus.lastLocation?.lat || !bus.lastLocation?.lng) return null;
          return (
            <Marker
              key={bus.busId}
              position={[bus.lastLocation.lat, bus.lastLocation.lng]}
              icon={createCustomIcon('BUS', '#2563eb', bus.busId)}
            >
              <Popup>
                <div className="p-1 max-w-xs text-xs">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <span className="text-blue-600 font-mono">{bus.busId}</span>
                    <span>({bus.registrationNo})</span>
                  </div>
                  <div className="text-slate-600 mt-1 font-medium">{bus.routeName}</div>
                  <div className="mt-2 text-slate-500 font-mono text-[11px] border-t border-slate-100 pt-1">
                    Speed: {bus.lastLocation.speed} km/h | Edge: {bus.edgeStatus}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render Event Markers */}
        {eventsToDisplay?.map((event) => {
          if (!event.location?.lat || !event.location?.lng) return null;
          const color = getEventColor(event);
          return (
            <Marker
              key={event.observationId}
              position={[event.location.lat, event.location.lng]}
              icon={createCustomIcon('EVENT', color)}
              eventHandlers={{
                click: () => setSelectedEvent(event)
              }}
            >
              <Popup>
                <div className="p-1 max-w-xs text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-700 font-bold">{event.observationId}</span>
                    <SeverityBadge severity={event.severity} />
                  </div>
                  <div className="font-bold text-slate-900">{event.type.replace(/_/g, ' ')}</div>
                  <div className="text-slate-600 text-[11px]">{event.location?.address}</div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-slate-500 font-mono text-[10px]">Bus: {event.busId}</span>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded font-semibold"
                    >
                      Inspect Details
                    </button>
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
