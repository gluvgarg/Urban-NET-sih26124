// TrafficHeatmapOverlay.jsx - High Performance Canvas Heatmap & Corridor Overlay for Traffic Congestion
import React, { useEffect, useRef } from 'react';
import { useMap, CircleMarker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import { TRAFFIC_HEATMAP_POINTS, TRAFFIC_CORRIDORS, CONGESTED_ZONES, getCongestionColor } from '../../data/traffic';
import { Gauge, TrendingUp, AlertTriangle, Car, ShieldCheck } from 'lucide-react';

export const TrafficHeatmapOverlay = ({ 
  showHeatmap = true, 
  showCorridors = true, 
  showHotspotMarkers = true,
  opacity = 0.8,
  filterLevel = 'ALL' // 'ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
}) => {
  const map = useMap();
  const canvasRef = useRef(null);

  // Filtered heatmap points
  const filteredPoints = TRAFFIC_HEATMAP_POINTS.filter(pt => {
    if (filterLevel === 'ALL') return true;
    if (filterLevel === 'LOW' && pt.index < 40) return true;
    if (filterLevel === 'MEDIUM' && pt.index >= 40 && pt.index < 70) return true;
    if (filterLevel === 'HIGH' && pt.index >= 70 && pt.index < 85) return true;
    if (filterLevel === 'CRITICAL' && pt.index >= 85) return true;
    return false;
  });

  const filteredZones = CONGESTED_ZONES.filter(z => {
    if (filterLevel === 'ALL') return true;
    if (filterLevel === 'LOW' && z.trafficIndex < 40) return true;
    if (filterLevel === 'MEDIUM' && z.trafficIndex >= 40 && z.trafficIndex < 70) return true;
    if (filterLevel === 'HIGH' && z.trafficIndex >= 70 && z.trafficIndex < 85) return true;
    if (filterLevel === 'CRITICAL' && z.trafficIndex >= 85) return true;
    return false;
  });

  useEffect(() => {
    if (!showHeatmap) {
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
      return;
    }

    // Create or locate overlay canvas
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = L.DomUtil.create('canvas', 'leaflet-traffic-heatmap-canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '350';
      canvas.style.opacity = opacity;
      canvas.style.transition = 'opacity 0.2s ease-in-out';
      map.getPanes().overlayPane.appendChild(canvas);
      canvasRef.current = canvas;
    }

    const drawHeatmap = () => {
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

      // Base radius scaled dynamically by map zoom level
      const zoom = map.getZoom();
      const radius = Math.max(30, 48 * Math.pow(1.15, zoom - 12));

      filteredPoints.forEach(pt => {
        if (!bounds.contains([pt.lat, pt.lng])) return;

        const containerPoint = map.latLngToContainerPoint([pt.lat, pt.lng]);
        const ptRadius = radius * (0.8 + (pt.index / 100) * 0.5);

        const gradient = ctx.createRadialGradient(
          containerPoint.x,
          containerPoint.y,
          0,
          containerPoint.x,
          containerPoint.y,
          ptRadius
        );

        // Color interpolation based on Traffic Congestion Index (0 = Green, 50 = Yellow/Amber, 100 = Crimson Red)
        if (pt.index >= 85) {
          // Critical / Severe Jam
          gradient.addColorStop(0, 'rgba(220, 38, 38, 0.85)');
          gradient.addColorStop(0.3, 'rgba(239, 68, 68, 0.65)');
          gradient.addColorStop(0.7, 'rgba(249, 115, 22, 0.35)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        } else if (pt.index >= 70) {
          // High Congestion
          gradient.addColorStop(0, 'rgba(239, 68, 68, 0.75)');
          gradient.addColorStop(0.4, 'rgba(249, 115, 22, 0.55)');
          gradient.addColorStop(0.8, 'rgba(234, 179, 8, 0.25)');
          gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
        } else if (pt.index >= 45) {
          // Moderate Traffic
          gradient.addColorStop(0, 'rgba(234, 179, 8, 0.75)');
          gradient.addColorStop(0.4, 'rgba(245, 158, 11, 0.50)');
          gradient.addColorStop(0.8, 'rgba(132, 204, 22, 0.20)');
          gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
        } else {
          // Low Congestion / Smooth Flow (Green)
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.75)');
          gradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.45)');
          gradient.addColorStop(0.8, 'rgba(5, 150, 105, 0.20)');
          gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(containerPoint.x, containerPoint.y, ptRadius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawHeatmap();

    map.on('move', drawHeatmap);
    map.on('zoom', drawHeatmap);
    map.on('resize', drawHeatmap);
    map.on('viewreset', drawHeatmap);

    return () => {
      map.off('move', drawHeatmap);
      map.off('zoom', drawHeatmap);
      map.off('resize', drawHeatmap);
      map.off('viewreset', drawHeatmap);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
        canvasRef.current = null;
      }
    };
  }, [map, showHeatmap, opacity, filterLevel, filteredPoints]);

  return (
    <>
      {/* Major Road Corridors with Traffic Flow Polylines */}
      {showCorridors && TRAFFIC_CORRIDORS.map((corridor) => (
        <Polyline
          key={corridor.id}
          positions={corridor.coordinates}
          pathOptions={{
            color: corridor.color,
            weight: corridor.trafficIndex > 75 ? 6 : 4,
            opacity: 0.85,
            dashArray: corridor.trafficIndex > 75 ? '6, 6' : undefined,
            lineCap: 'round',
            lineJoin: 'round'
          }}
        >
          <Popup>
            <div className="p-1 max-w-xs text-xs space-y-1.5 font-sans">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1">
                <span className="font-bold text-slate-900 leading-tight">{corridor.name}</span>
                <span 
                  className="px-2 py-0.5 rounded font-mono font-bold text-[10px] text-white shrink-0"
                  style={{ backgroundColor: corridor.color }}
                >
                  {corridor.trafficLevel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Congestion Index</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{corridor.trafficIndex}/100</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Avg Corridor Speed</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{corridor.avgSpeed}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Polyline>
      ))}

      {/* Interactive Congestion Hotspot Pins */}
      {showHotspotMarkers && filteredZones.map((zone) => {
        const color = getCongestionColor(zone.trafficIndex);
        return (
          <CircleMarker
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.trafficIndex > 80 ? 10 : 8}
            pathOptions={{
              color: '#ffffff',
              fillColor: color,
              fillOpacity: 0.95,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-1 max-w-xs text-xs space-y-2 font-sans">
                <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-1.5">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block leading-tight">{zone.zone}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{zone.corridor}</span>
                  </div>
                  <span 
                    className="px-2 py-0.5 rounded font-mono font-bold text-[10px] text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: color }}
                  >
                    {zone.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  <div className="bg-slate-50 p-1 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[9px] uppercase font-semibold">Index</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{zone.trafficIndex}/100</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[9px] uppercase font-semibold">Avg Speed</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">{zone.avgSpeed}</span>
                  </div>
                  <div className="bg-slate-50 p-1 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[9px] uppercase font-semibold">Vehicles/hr</span>
                    <span className="font-mono font-bold text-blue-700 text-xs">{zone.vehicleCount}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[10px] space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Queue Length:</span>
                    <span className="font-mono font-semibold text-slate-900">{zone.queueLength}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Peak Trend:</span>
                    <span className="font-mono font-semibold text-red-600">{zone.trend} vs baseline</span>
                  </div>
                </div>

                {zone.recommendedAction && (
                  <div className="p-1.5 bg-blue-50 border border-blue-200 rounded text-[10px] text-blue-900 flex items-start space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span><strong>AI Action:</strong> {zone.recommendedAction}</span>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
};
