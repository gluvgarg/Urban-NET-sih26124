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
import { MOCK_INCIDENTS, SAFETY_STATS } from '../data/incidents';
import { SEVERITY_BADGES } from '../data/events';

const createCustomIcon = (color, symbol) => {
  return L.divIcon({
    className: 'custom-incident-icon',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2.5px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
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
    <div className="space-y-6 pb-12">
      {/* 1. TOP SAFETY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>CRITICAL INCIDENTS</span>
            <Siren className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-400">{SAFETY_STATS.criticalIncidents}</div>
          <div className="text-[10px] text-rose-400 font-semibold">Immediate Priority</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>HIT & RUN CASES</span>
            <Car className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-500">{SAFETY_STATS.hitAndRunCases}</div>
          <div className="text-[10px] text-slate-400">License Plates Extracted</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>RASH DRIVING ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-400">{SAFETY_STATS.rashDrivingAlerts}</div>
          <div className="text-[10px] text-slate-400">Speed & Lane Weaving</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>PEDESTRIAN ALERTS</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{SAFETY_STATS.pedestrianRiskAlerts}</div>
          <div className="text-[10px] text-slate-400">School Zone Risk</div>
        </div>
      </div>

      {/* 2. SAFETY INCIDENTS LOG TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Siren className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-bold text-white">PUBLIC SAFETY INCIDENT LOG</span>
          </div>
          <span className="text-xs text-slate-400">Click any row to investigate or track offending vehicle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Incident ID</th>
                <th className="p-3">Incident Type</th>
                <th className="p-3">Sensing Bus</th>
                <th className="p-3">Location</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Offending Plate</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.map((inc) => (
                <tr 
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <td className="p-3 font-mono font-bold text-rose-400">{inc.id}</td>
                  <td className="p-3 font-semibold text-slate-100">{inc.type}</td>
                  <td className="p-3">
                    <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-blue-300 font-mono text-[11px]">
                      {inc.busId}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{inc.location}</td>
                  <td className="p-3">
                    <span className={SEVERITY_BADGES[inc.severity] || "bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded"}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3">
                    {inc.offendingVehicle ? (
                      <span className="font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[11px]">
                        {inc.offendingVehicle.registrationNo}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[10px]">N/A</span>
                    )}
                  </td>
                  <td className="p-3 font-mono font-semibold text-emerald-400">
                    {(inc.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{inc.timestamp}</td>
                  <td className="p-3">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                      {inc.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {inc.offendingVehicle && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openVehicleTracking(inc);
                        }}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-2.5 py-1 rounded text-[11px] transition shadow"
                      >
                        Track Vehicle 🎯
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. DETAILED INVESTIGATION MODAL */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-rose-400 text-xs font-bold">{selectedIncident.id}</span>
                <h3 className="text-lg font-black text-white">{selectedIncident.type} Investigation Panel</h3>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden border border-slate-800 relative">
                <img src={selectedIncident.evidenceImage} alt="Incident Evidence" className="w-full h-44 object-cover" />
                <div className="absolute bottom-2 left-2 bg-slate-950/90 text-rose-400 text-[10px] font-mono px-2 py-0.5 rounded">
                  OCR Confidence: {(selectedIncident.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-3 rounded border border-slate-800">
                <div><span className="text-slate-500">Sensing Bus:</span> <span className="font-mono text-blue-400 font-bold">{selectedIncident.busId}</span></div>
                <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-white">{selectedIncident.location}</span></div>
                <div><span className="text-slate-500">Timestamp:</span> <span className="font-mono text-slate-300">{selectedIncident.timestamp}</span></div>
                {selectedIncident.offendingVehicle && (
                  <>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-slate-500">Offending Vehicle:</span>
                      <div className="text-base font-mono font-black text-amber-400">{selectedIncident.offendingVehicle.registrationNo}</div>
                      <div className="text-[10px] text-slate-400">{selectedIncident.offendingVehicle.makeModel} • Speed: {selectedIncident.offendingVehicle.speedDetected}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="text-slate-300 text-xs bg-slate-950 p-3 rounded border border-slate-800 leading-relaxed">
              {selectedIncident.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800 justify-end">
              {selectedIncident.offendingVehicle && (
                <button 
                  onClick={() => openVehicleTracking(selectedIncident)}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition"
                >
                  <Navigation className="w-4 h-4" /> Open Vehicle Trajectory Map
                </button>
              )}
              <button 
                onClick={() => escalateIncident(selectedIncident.id)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded text-xs transition"
              >
                Escalate to Traffic Police
              </button>
              <button 
                onClick={() => acknowledgeIncident(selectedIncident.id)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded text-xs transition"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VEHICLE TRACKING VIEW (Leaflet Trajectory Map for Hit-and-Run) */}
      {vehicleTrackingView && vehicleTrackingView.offendingVehicle && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center font-bold text-white">
                  🎯
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    HIT-AND-RUN VEHICLE TRAJECTORY TRACKING — <span className="text-amber-400 font-mono">{vehicleTrackingView.offendingVehicle.registrationNo}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Extracted by Edge AI Sensors • OCR Confidence: {(vehicleTrackingView.offendingVehicle.regConfidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setVehicleTrackingView(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Map & Telemetry Split */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
              {/* Left Map View */}
              <div className="flex-1 relative bg-slate-950">
                <MapContainer
                  center={[vehicleTrackingView.latitude, vehicleTrackingView.longitude]}
                  zoom={14}
                  style={{ width: '100%', height: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap"
                  />

                  {/* Render Trajectory Polyline */}
                  <Polyline 
                    positions={vehicleTrackingView.offendingVehicle.trajectory.map(t => [t.lat, t.lng])} 
                    color="#ef4444" 
                    weight={4}
                    dashArray="6, 8"
                  />

                  {/* Render Trajectory Points */}
                  {vehicleTrackingView.offendingVehicle.trajectory.map((point, i) => (
                    <Marker
                      key={i}
                      position={[point.lat, point.lng]}
                      icon={createCustomIcon(i === 1 ? '#dc2626' : '#3b82f6', i === 1 ? '💥' : `${i + 1}`)}
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
              <div className="w-full lg:w-80 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto space-y-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle Profile</div>
                  <div><span className="text-slate-400">Reg Plate:</span> <span className="font-mono font-black text-amber-400 text-sm">{vehicleTrackingView.offendingVehicle.registrationNo}</span></div>
                  <div><span className="text-slate-400">Class:</span> <span className="font-semibold text-white">{vehicleTrackingView.offendingVehicle.makeModel}</span></div>
                  <div><span className="text-slate-400">Escape Velocity:</span> <span className="font-mono text-rose-400 font-bold">{vehicleTrackingView.offendingVehicle.speedDetected}</span></div>
                  <div><span className="text-slate-400">Escape Direction:</span> <span className="text-slate-200">{vehicleTrackingView.offendingVehicle.direction}</span></div>
                </div>

                {/* Trajectory Sequence */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Multi-Bus Detection Sequence</div>
                  <div className="space-y-2 divide-y divide-slate-800">
                    {vehicleTrackingView.offendingVehicle.trajectory.map((point, idx) => (
                      <div key={idx} className="pt-2 text-[11px] space-y-0.5">
                        <div className="flex justify-between font-bold">
                          <span className="text-blue-400">{point.sensor}</span>
                          <span className="font-mono text-slate-400">{point.time}</span>
                        </div>
                        <div className="text-slate-400">Speed: <span className="text-white font-mono">{point.speed} km/h</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    escalateIncident(vehicleTrackingView.id);
                    setVehicleTrackingView(null);
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded text-xs transition shadow"
                >
                  Broadcast Intercept Order to Traffic Police
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
