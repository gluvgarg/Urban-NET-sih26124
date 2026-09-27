import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bus, 
  Wifi, 
  Cpu, 
  Video, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  HardDrive, 
  Activity,
  Layers,
  Search
} from 'lucide-react';
import { FLEET_SUMMARY } from '../data/buses';

export const BusFleet = () => {
  const { buses, selectedBus, setSelectedBus } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredBuses = buses.filter(b => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (search && !b.id.toLowerCase().includes(search.toLowerCase()) && !b.routeName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4 pb-10 text-xs text-slate-800">
      {/* 1. TOP BUS FLEET STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>TOTAL SENSING BUSES</span>
            <Bus className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">{FLEET_SUMMARY.total}</div>
          <div className="text-[10px] text-blue-700 font-semibold">Mobile AI Sensing Fleet</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>ONLINE SENSORS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono">{FLEET_SUMMARY.online}</div>
          <div className="text-[10px] text-emerald-700 font-medium">84.0% Active Telemetry</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>WARNING / DEGRADED</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-800 font-mono">{FLEET_SUMMARY.warning}</div>
          <div className="text-[10px] text-slate-500">Degraded Camera / GPS</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>OFFLINE UNITS</span>
            <Bus className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-bold text-red-600 font-mono">{FLEET_SUMMARY.offline}</div>
          <div className="text-[10px] text-slate-500">Depot Maintenance</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>EVENTS LOGGED TODAY</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-purple-700 font-mono">{FLEET_SUMMARY.eventsTodayTotal}</div>
          <div className="text-[10px] text-slate-500">Total Transmitted</div>
        </div>
      </div>

      {/* 2. BUS FLEET MONITORING TABLE */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <Bus className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">PUBLIC TRANSPORT MOBILE SENSING UNITS</span>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <input 
              type="text"
              placeholder="Search bus ID or route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-3 py-1 text-xs text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ONLINE">Online Only</option>
              <option value="WARNING">Warning Only</option>
              <option value="OFFLINE">Offline Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
              <tr>
                <th className="p-2.5">Bus ID</th>
                <th className="p-2.5">Reg Plate</th>
                <th className="p-2.5">Assigned Route</th>
                <th className="p-2.5">Fleet Status</th>
                <th className="p-2.5">5-Camera Array</th>
                <th className="p-2.5">Edge AI Health</th>
                <th className="p-2.5">Network</th>
                <th className="p-2.5">Events Today</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBuses.map((bus) => {
                let statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (bus.status === 'WARNING') statusBadge = "bg-amber-50 text-amber-800 border-amber-200";
                if (bus.status === 'OFFLINE') statusBadge = "bg-slate-100 text-slate-600 border-slate-200";

                return (
                  <tr 
                    key={bus.id}
                    onClick={() => setSelectedBus(bus)}
                    className="hover:bg-slate-50 transition cursor-pointer"
                  >
                    <td className="p-2.5 font-mono font-bold text-blue-700">{bus.id}</td>
                    <td className="p-2.5 font-mono text-slate-700">{bus.vehicleReg}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{bus.routeId}</td>
                    <td className="p-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${statusBadge}`}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center space-x-1">
                        {['front', 'rear', 'left', 'right', 'cabin'].map(cam => (
                          <span 
                            key={cam} 
                            title={`${cam.toUpperCase()}: ${bus.cameraStatus[cam]}`}
                            className={`w-2 h-2 rounded-full ${
                              bus.cameraStatus[cam] === 'ACTIVE' ? 'bg-emerald-600' :
                              bus.cameraStatus[cam] === 'DEGRADED' ? 'bg-amber-500' : 'bg-red-600'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-slate-500 font-mono ml-1">5/5 Array</span>
                      </div>
                    </td>
                    <td className="p-2.5 font-mono text-xs">
                      <span className={bus.edgeAiHealth === 'OPTIMAL' ? 'text-emerald-700 font-semibold' : 'text-amber-800 font-semibold'}>
                        ● {bus.edgeAiHealth}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-600">{bus.network}</td>
                    <td className="p-2.5 font-mono font-bold text-purple-700">{bus.eventsToday}</td>
                    <td className="p-2.5 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBus(bus);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-[11px]"
                      >
                        Inspect Cameras →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. BUS DETAIL & 5-CAMERA SIMULATED PROTOTYPE FEED MODAL */}
      {selectedBus && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-md max-w-4xl w-full p-5 shadow-lg space-y-4 max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-3">
                <Bus className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedBus.id} ({selectedBus.vehicleReg}) — Telemetry Inspection
                  </h3>
                  <p className="text-xs text-slate-500">{selectedBus.routeName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBus(null)} className="text-slate-400 hover:text-slate-800 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hardware Telemetry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Edge AI Load:</span>
                <div className="font-mono text-emerald-700 font-bold">CPU: {selectedBus.cpuLoad}% | GPU: {selectedBus.gpuUsage}%</div>
              </div>
              <div>
                <span className="text-slate-500">Network Telemetry:</span>
                <div className="font-mono text-blue-700 font-bold">{selectedBus.network}</div>
              </div>
              <div>
                <span className="text-slate-500">Speed / Heading:</span>
                <div className="font-mono text-slate-800">{selectedBus.speed} km/h • {selectedBus.heading}°</div>
              </div>
              <div>
                <span className="text-slate-500">Last Central Sync:</span>
                <div className="font-mono text-purple-700">{selectedBus.lastSync}</div>
              </div>
            </div>

            {/* SIMULATED EDGE AI PROTOTYPE FEED (5-CAMERA ARRAY) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>Onboard Edge AI 5-Camera Array Telemetry</span>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono font-semibold">
                  SOURCE: EDGE AI
                </span>
              </div>

              {/* 5 Cameras Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { name: 'Front Camera (Road Defect / Pothole AI)', img: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&auto=format&fit=crop&q=80', status: selectedBus.cameraStatus.front },
                  { name: 'Rear Camera (Hit-and-Run / License OCR)', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&auto=format&fit=crop&q=80', status: selectedBus.cameraStatus.rear },
                  { name: 'Left Lateral (Zebra / Signboard AI)', img: 'https://images.unsplash.com/photo-1506521782020-18925f46c0be?w=400&auto=format&fit=crop&q=80', status: selectedBus.cameraStatus.left },
                  { name: 'Right Lateral (Divider Detection)', img: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=400&auto=format&fit=crop&q=80', status: selectedBus.cameraStatus.right },
                  { name: 'Passenger Cabin (Safety Telemetry)', img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&auto=format&fit=crop&q=80', status: selectedBus.cameraStatus.cabin }
                ].map((cam, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded overflow-hidden relative">
                    <img src={cam.img} alt={cam.name} className="w-full h-28 object-cover" />
                    
                    {/* Simulated Bounding Box Overlay */}
                    <div className="absolute top-3 left-4 w-20 h-12 border-2 border-emerald-600 bg-emerald-500/20 rounded flex items-start p-1 text-[9px] font-mono text-emerald-800 font-bold">
                      DEFECT_94%
                    </div>

                    <div className="p-2 bg-slate-50 flex items-center justify-between text-[11px] border-t border-slate-200">
                      <span className="font-semibold text-slate-800 truncate">{cam.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${
                        cam.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {cam.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500">Firmware: <span className="font-mono text-slate-800 font-bold">{selectedBus.firmwareVersion}</span></span>
              <button onClick={() => setSelectedBus(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded">
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
