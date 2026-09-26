import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Siren, 
  ShieldAlert, 
  Car, 
  Users, 
  Navigation, 
  Eye, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Send,
  Play,
  ArrowRight
} from 'lucide-react';
import { SAFETY_STATS } from '../data/incidents';
import { SEVERITY_BADGES } from '../data/events';

const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-incident-icon',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        ${symbol}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const SafetyIncidents = () => {
  const { incidents, acknowledgeIncident, escalateIncident, showToast } = useApp();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [vehicleTrackingView, setVehicleTrackingView] = useState(null);

  const openVehicleTracking = (incident) => {
    setVehicleTrackingView(incident);
    setSelectedIncident(null);
  };

  return (
    <div className="space-y-4 pb-12 text-xs text-slate-800">
      {/* 1. TOP SAFETY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>CRITICAL INCIDENTS</span>
            <Siren className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-bold text-red-600 font-mono">{SAFETY_STATS.criticalIncidents}</div>
          <div className="text-[10px] text-red-600 font-medium">Immediate Priority</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>HIT & RUN CASES</span>
            <Car className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-bold text-red-600 font-mono">{SAFETY_STATS.hitAndRunCases}</div>
          <div className="text-[10px] text-slate-500">License Plates Extracted</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>RASH DRIVING ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">{SAFETY_STATS.rashDrivingAlerts}</div>
          <div className="text-[10px] text-slate-500">Speed & Lane Weaving</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>PEDESTRIAN ALERTS</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">{SAFETY_STATS.pedestrianRiskAlerts}</div>
          <div className="text-[10px] text-slate-500">School Zone Risk</div>
        </div>
      </div>

      {/* 2. SAFETY INCIDENTS LOG TABLE */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <Siren className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">PUBLIC SAFETY INCIDENT LOG</span>
          </div>
          <span className="text-[11px] text-slate-500">Click any row to investigate or track offending vehicle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
              <tr>
                <th className="p-2.5">Incident ID</th>
                <th className="p-2.5">Source</th>
                <th className="p-2.5">Incident Type</th>
                <th className="p-2.5">Sensing Bus</th>
                <th className="p-2.5">Location</th>
                <th className="p-2.5">Severity</th>
                <th className="p-2.5">Offending Plate</th>
                <th className="p-2.5">Confidence</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.map((inc) => {
                const plateNo = inc.offendingVehicleReg || (inc.offendingVehicle ? inc.offendingVehicle.registrationNo : null);
                return (
                  <tr 
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className="hover:bg-slate-50 transition cursor-pointer"
                  >
                    <td className="p-2.5 font-mono font-bold text-red-700">{inc.id}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        SOURCE: EDGE AI
                      </span>
                    </td>
                    <td className="p-2.5 font-semibold text-slate-900">{inc.type}</td>
                    <td className="p-2.5">
                      <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-blue-700 font-mono text-[10px]">
                        {inc.busId}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700">{inc.location}</td>
                    <td className="p-2.5">
                      <span className={SEVERITY_BADGES[inc.severity] || "bg-slate-200 text-slate-800 text-[9px] px-1.5 py-0.5 rounded font-mono"}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-2.5">
                      {plateNo ? (
                        <span className="font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded text-[11px]">
                          {plateNo}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[10px]">N/A</span>
                      )}
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-emerald-700">
                      {((inc.confidence || 0.94) * 100).toFixed(1)}%
                    </td>
                    <td className="p-2.5 text-slate-500 font-mono text-[10px]">{inc.timestamp}</td>
                    <td className="p-2.5">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                        {inc.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right space-x-2">
                      {inc.offendingVehicle && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openVehicleTracking(inc);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded text-[10px] transition shadow-sm"
                        >
                          Track Trajectory 🎯
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. DETAILED INVESTIGATION MODAL */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-md max-w-2xl w-full p-5 shadow-lg space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-red-700 text-xs font-bold">{selectedIncident.id}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    SOURCE: EDGE AI
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedIncident.type} Investigation Panel</h3>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-slate-800 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded overflow-hidden border border-slate-200 relative">
                <img src={selectedIncident.evidenceImage} alt="Incident Evidence" className="w-full h-44 object-cover" />
                <div className="absolute bottom-2 left-2 bg-white/95 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-300 font-bold">
                  OCR Confidence: {((selectedIncident.confidence || 0.94) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                <div><span className="text-slate-500">Sensing Bus Unit:</span> <span className="font-mono text-blue-700 font-bold">{selectedIncident.busId}</span></div>
                <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-slate-900">{selectedIncident.location}</span></div>
                <div><span className="text-slate-500">Timestamp:</span> <span className="font-mono text-slate-600">{selectedIncident.timestamp}</span></div>
                {(selectedIncident.offendingVehicleReg || selectedIncident.offendingVehicle) && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">Offending Vehicle:</span>
                    <div className="text-base font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 inline-block">
                      {selectedIncident.offendingVehicleReg || selectedIncident.offendingVehicle?.registrationNo}
                    </div>
                    {selectedIncident.offendingVehicle?.makeModel && (
                      <div className="text-[11px] text-slate-600">
                        {selectedIncident.offendingVehicle.makeModel} • Speed: <strong className="text-red-700">{selectedIncident.offendingVehicle.speedDetected}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-slate-700 text-xs bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
              {selectedIncident.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 justify-end">
              {selectedIncident.offendingVehicle && (
                <button 
                  onClick={() => openVehicleTracking(selectedIncident)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition"
                >
                  <Navigation className="w-3.5 h-3.5" /> Trajectory Map
                </button>
              )}
              <button 
                onClick={() => escalateIncident(selectedIncident.id)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded text-xs transition"
              >
                Escalate to Police
              </button>
              <button 
                onClick={() => acknowledgeIncident(selectedIncident.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded text-xs transition"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VEHICLE TRACKING VIEW (Leaflet Trajectory Map for Hit-and-Run) */}
      {vehicleTrackingView && vehicleTrackingView.offendingVehicle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-md max-w-5xl w-full h-[85vh] flex flex-col shadow-xl overflow-hidden text-slate-800">
            {/* Header */}
            <div className="p-3.5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                  🎯
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    HIT-AND-RUN VEHICLE TRAJECTORY TRACKING — <span className="text-amber-400 font-mono">{vehicleTrackingView.offendingVehicle.registrationNo}</span>
                  </h3>
                  <p className="text-[10px] text-slate-300 font-mono">
                    Extracted by Edge AI Sensors • OCR Confidence: {((vehicleTrackingView.offendingVehicle.regConfidence || 0.94) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setVehicleTrackingView(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map & Telemetry Split */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left Map View */}
              <div className="flex-1 relative bg-slate-100">
                <MapContainer
                  center={[vehicleTrackingView.latitude, vehicleTrackingView.longitude]}
                  zoom={14}
                  style={{ width: '100%', height: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />

                  {/* Render Trajectory Polyline */}
                  <Polyline 
                    positions={vehicleTrackingView.offendingVehicle.trajectory.map(t => [t.lat, t.lng])} 
                    color="#dc2626" 
                    weight={4}
                    dashArray="6, 8"
                  />

                  {/* Render Trajectory Points */}
                  {vehicleTrackingView.offendingVehicle.trajectory.map((point, i) => (
                    <Marker
                      key={i}
                      position={[point.lat, point.lng]}
                      icon={createCustomIcon(i === 1 ? '#dc2626' : '#2563eb', i === 1 ? '💥' : `${i + 1}`)}
                    >
                      <Popup>
                        <div className="text-xs p-1">
                          <div className="font-bold text-slate-900">Waypoint {i + 1} ({point.time})</div>
                          <div>Speed: {point.speed} km/h</div>
                          <div>Sensor: {point.sensor}</div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Right Telemetry Sidebar */}
              <div className="w-full lg:w-80 bg-slate-50 border-l border-slate-200 p-4 overflow-y-auto space-y-4 text-xs text-slate-800">
                <div className="bg-white p-3 rounded border border-slate-200 space-y-2 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Vehicle Profile</div>
                  <div><span className="text-slate-500">Reg Plate:</span> <span className="font-mono font-bold text-amber-800 text-sm bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300 ml-1">{vehicleTrackingView.offendingVehicle.registrationNo}</span></div>
                  <div><span className="text-slate-500">Class:</span> <span className="font-semibold text-slate-900">{vehicleTrackingView.offendingVehicle.makeModel}</span></div>
                  <div><span className="text-slate-500">Escape Velocity:</span> <span className="font-mono text-red-700 font-bold">{vehicleTrackingView.offendingVehicle.speedDetected}</span></div>
                  <div><span className="text-slate-500">Escape Direction:</span> <span className="text-slate-700">{vehicleTrackingView.offendingVehicle.direction}</span></div>
                </div>

                {/* Trajectory Sequence */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Multi-Bus Detection Sequence</div>
                  <div className="space-y-2 divide-y divide-slate-200 bg-white p-3 rounded border border-slate-200 shadow-sm">
                    {vehicleTrackingView.offendingVehicle.trajectory.map((point, idx) => (
                      <div key={idx} className="pt-2 text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold">
                          <span className="text-blue-700">{point.sensor}</span>
                          <span className="font-mono text-slate-500">{point.time}</span>
                        </div>
                        <div className="text-slate-600">Speed: <span className="text-slate-900 font-mono font-bold">{point.speed} km/h</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    escalateIncident(vehicleTrackingView.id);
                    setVehicleTrackingView(null);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-xs transition shadow-sm"
                >
                  Broadcast Intercept Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
