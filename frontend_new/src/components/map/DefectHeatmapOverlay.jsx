// DefectHeatmapOverlay.jsx - Event Density Heatmap + Event Markers for Real Backend Data
import React, { useEffect, useRef } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../common/Badge';
import { Eye } from 'lucide-react';

const createDefectMarkerIcon = (type, severity, category) => {
  let bgColor = '#2563eb'; // Default blue
  let emoji = '📍';

  if (severity === 'CRITICAL') {
    bgColor = '#dc2626';
  } else if (severity === 'HIGH') {
    bgColor = '#ea580c';
  } else if (severity === 'MEDIUM') {
    bgColor = '#d97706';
  } else {
    bgColor = '#2563eb';
  }

  const typeUpper = (type || '').toUpperCase();
  const categoryUpper = (category || '').toUpperCase();

  if (typeUpper.includes('WATERLOGGING')) emoji = '🌊';
  else if (typeUpper.includes('POTHOLE') || typeUpper.includes('DAMAGED')) emoji = '🕳️';
  else if (typeUpper.includes('HIT_AND_RUN') || categoryUpper === 'SAFETY') emoji = '🚨';
  else if (categoryUpper === 'INFRASTRUCTURE') emoji = '🏗️';
  else if (typeUpper.includes('TRAFFIC') || categoryUpper === 'TRAFFIC') emoji = '🚦';

  return L.divIcon({
    className: 'custom-defect-marker',
    html: `<div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-size: 13px; cursor: pointer; transition: transform 0.15s ease;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const DefectHeatmapOverlay = ({
  events = [],
  showHeatmap = true,
  showMarkers = true,
  opacity = 0.75
}) => {
  const map = useMap();
  const canvasRef = useRef(null);
  const { setSelectedEvent } = useApp();

  const validEvents = events.filter((e) => {
    return Boolean(e.location && typeof e.location.lat === 'number' && typeof e.location.lng === 'number' && (e.location.lat !== 0 || e.location.lng !== 0));
  });

  useEffect(() => {
    if (!showHeatmap) {
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
      return;
    }

    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = L.DomUtil.create('canvas', 'leaflet-defect-heatmap-canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '340';
      canvas.style.opacity = opacity;
      canvas.style.transition = 'opacity 0.2s ease-in-out';
      map.getPanes().overlayPane.appendChild(canvas);
      canvasRef.current = canvas;
    }

    const drawDefectHeat = () => {
      if (!canvas || !map) return;
      const size = map.getSize();
      const bounds = map.getBounds();
      const topLeft = map.containerPointToLayerPoint([0, 0]);

      L.DomUtil.setPosition(canvas, topLeft);
      canvas.width = size.x;
      canvas.height = size.y;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, size.x, size.y);

      const zoom = map.getZoom();
      const radius = Math.max(35, 50 * Math.pow(1.15, zoom - 12));

      validEvents.forEach((evt) => {
        const { lat, lng } = evt.location;
        if (!bounds.contains([lat, lng])) return;

        const p = map.latLngToContainerPoint([lat, lng]);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);

        if (evt.severity === 'CRITICAL') {
          grad.addColorStop(0, 'rgba(220, 38, 38, 0.85)');
          grad.addColorStop(0.4, 'rgba(234, 88, 12, 0.55)');
          grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
        } else if (evt.severity === 'HIGH') {
          grad.addColorStop(0, 'rgba(234, 88, 12, 0.8)');
          grad.addColorStop(0.4, 'rgba(245, 158, 11, 0.5)');
          grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
        } else {
          grad.addColorStop(0, 'rgba(59, 130, 246, 0.7)');
          grad.addColorStop(0.4, 'rgba(96, 165, 250, 0.4)');
          grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawDefectHeat();

    map.on('move', drawDefectHeat);
    map.on('zoom', drawDefectHeat);
    map.on('resize', drawDefectHeat);
    map.on('viewreset', drawDefectHeat);

    return () => {
      map.off('move', drawDefectHeat);
      map.off('zoom', drawDefectHeat);
      map.off('resize', drawDefectHeat);
      map.off('viewreset', drawDefectHeat);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
        canvasRef.current = null;
      }
    };
  }, [map, showHeatmap, opacity, validEvents]);

  return (
    <>
      {showMarkers && validEvents.map((event) => (
        <Marker
          key={event.observationId}
          position={[event.location.lat, event.location.lng]}
          icon={createDefectMarkerIcon(event.type, event.severity, event.category)}
          eventHandlers={{
            click: () => setSelectedEvent(event)
          }}
        >
          <Popup>
            <div className="p-1 max-w-xs text-xs space-y-2 font-sans">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 gap-2">
                <span className="font-mono text-blue-700 font-bold">{event.observationId}</span>
                <div className="flex items-center space-x-1">
                  <CategoryBadge category={event.category} />
                  <SeverityBadge severity={event.severity} />
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-900 text-sm">{event.type.replace(/_/g, ' ')}</div>
                <div className="text-slate-600 text-[11px] mt-0.5 font-mono">
                  Sensed by: <strong className="text-slate-800">{event.busId}</strong>
                </div>
              </div>

              {event.type === 'HIT_AND_RUN' && event.vehicleNumber && (
                <div className="text-[11px] text-slate-600">
                  Vehicle No.: <strong className="text-red-700 font-mono">
                    {event.vehicleNumber}
                  </strong>
                </div>
              )}

              {event.evidence?.imageUrl && (
                <div className="rounded overflow-hidden border border-slate-200 h-24 w-full relative">
                  <img
                    src={event.evidence.imageUrl}
                    alt={event.type}
                    className="w-full h-full object-cover"
                  />
                  {event.confidence !== undefined && (
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                      AI Conf: {Math.round(event.confidence * 100)}%
                    </span>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                <StatusBadge status={event.status} />
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  Inspect
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
