// BusFleet.jsx - Bus Fleet Sensing Unit Monitoring System

import React, { useState } from 'react';
import { Bus, Cpu, Camera, MapPin, Search, AlertCircle, Clock, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, StatusBadge } from '../components/common/Badge';

export const BusFleet = () => {
  const { buses, events, setSelectedEvent } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusForModal, setSelectedBusForModal] = useState(null);

  const filteredBuses = buses.filter((b) => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      b.busId.toLowerCase().includes(query) ||
      b.registrationNo.toLowerCase().includes(query) ||
      b.routeName.toLowerCase().includes(query) ||
      b.routeId.toLowerCase().includes(query)
    );
  });

  // Calculate bus events when inspecting a bus
  const busEvents = selectedBusForModal
    ? events.filter(
        (e) => e.busId === selectedBusForModal.busId || (e.detectedBy && e.detectedBy.includes(selectedBusForModal.busId))
      )
    : [];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Public Transit Sensing Fleet</h1>
            <p className="text-xs text-slate-500">Mobile urban sensing units mounted on municipal transit buses</p>
          </div>
          <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
            Active Fleet: <strong className="text-emerald-700">{buses.filter((b) => b.status === 'ACTIVE').length}</strong> / {buses.length} Units
          </div>
        </div>

        {/* Toolbar */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search Bus ID, Registration or Route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span> Edge Online
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span> Maintenance
            </span>
          </div>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Bus ID</th>
                <th className="py-3 px-3">Registration No.</th>
                <th className="py-3 px-3">Route Details</th>
                <th className="py-3 px-3">Fleet Status</th>
                <th className="py-3 px-3">Edge Unit</th>
                <th className="py-3 px-3">Camera Status</th>
                <th className="py-3 px-3">Last Coordinates</th>
                <th className="py-3 px-3">Last Seen</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredBuses.map((bus) => (
                <tr key={bus.busId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{bus.busId}</td>
                  <td className="py-3 px-3 font-mono text-slate-800">{bus.registrationNo}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-900 block">{bus.routeName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">ID: {bus.routeId}</span>
                  </td>
                  <td className="py-3 px-3">
                    {bus.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ACTIVE
                      </span>
                    ) : bus.status === 'MAINTENANCE' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        MAINTENANCE
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        INACTIVE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {bus.edgeStatus === 'ONLINE' ? (
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <Cpu className="w-3.5 h-3.5 mr-1" /> ONLINE
                      </span>
                    ) : bus.edgeStatus === 'DEGRADED' ? (
                      <span className="text-amber-700 font-semibold flex items-center">
                        <Cpu className="w-3.5 h-3.5 mr-1" /> DEGRADED
                      </span>
                    ) : (
                      <span className="text-slate-400 font-semibold flex items-center">
                        <Cpu className="w-3.5 h-3.5 mr-1" /> OFFLINE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {bus.cameraStatus === 'ACTIVE' ? (
                      <span className="text-emerald-700 font-semibold flex items-center">
                        <Camera className="w-3.5 h-3.5 mr-1" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-slate-400 font-semibold flex items-center">
                        <Camera className="w-3.5 h-3.5 mr-1" /> INACTIVE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                    {bus.lastLocation?.lat?.toFixed(4)}, {bus.lastLocation?.lng?.toFixed(4)}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {new Date(bus.lastSeenAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedBusForModal(bus)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] transition-colors border border-slate-200"
                    >
                      View Observations
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bus Observations Drawer / Modal */}
      {selectedBusForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold">{selectedBusForModal.busId}</span>
                <h2 className="text-base font-bold text-white">{selectedBusForModal.routeName}</h2>
              </div>
              <button
                onClick={() => setSelectedBusForModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block">Registration No.</span>
                  <span className="font-mono font-bold text-slate-900">{selectedBusForModal.registrationNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Edge Unit</span>
                  <span className="font-semibold text-emerald-700">{selectedBusForModal.edgeStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Camera Stream</span>
                  <span className="font-semibold text-emerald-700">{selectedBusForModal.cameraStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Detected Events</span>
                  <span className="font-bold text-blue-700">{busEvents.length} Observations</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Observations Captured By {selectedBusForModal.busId}
                </h3>
                {busEvents.length === 0 ? (
                  <p className="text-slate-500 py-4 text-center">No active observations reported by this bus.</p>
                ) : (
                  <div className="space-y-2">
                    {busEvents.map((evt) => (
                      <div
                        key={evt.observationId}
                        onClick={() => {
                          setSelectedBusForModal(null);
                          setSelectedEvent(evt);
                        }}
                        className="p-3 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-blue-700">{evt.observationId}</span>
                            <SeverityBadge severity={evt.severity} />
                          </div>
                          <span className="font-bold text-slate-900 block mt-0.5">{evt.type.replace(/_/g, ' ')}</span>
                          <span className="text-slate-500 text-[11px]">{evt.location?.address}</span>
                        </div>
                        <button className="px-2 py-1 bg-slate-100 text-slate-800 font-semibold rounded text-[11px]">
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedBusForModal(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
