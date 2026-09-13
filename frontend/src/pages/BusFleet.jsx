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
    <div className="space-y-6 pb-12">
      {/* 1. TOP BUS FLEET STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>TOTAL SENSING BUSES</span>
            <Bus className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{FLEET_SUMMARY.total}</div>
          <div className="text-[10px] text-blue-400 font-semibold">Mobile AI Sensing Fleet</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>ONLINE SENSORS</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{FLEET_SUMMARY.online}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">84.0% Active Telemetry</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>WARNING / DEGRADED</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{FLEET_SUMMARY.warning}</div>
          <div className="text-[10px] text-slate-400">Degraded Camera / GPS</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>OFFLINE UNITS</span>
            <Bus className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-400">{FLEET_SUMMARY.offline}</div>
          <div className="text-[10px] text-slate-400">Depot Maintenance</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>EVENTS LOGGED TODAY</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{FLEET_SUMMARY.eventsTodayTotal}</div>
          <div className="text-[10px] text-slate-400">Total Transmitted</div>
        </div>
      </div>

      {/* 2. BUS FLEET MONITORING TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Bus className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">PUBLIC TRANSPORT MOBILE SENSING UNITS</span>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <input 
              type="text"
              placeholder="Search bus ID or route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-xs text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="ONLINE">Online Only</option>
              <option value="WARNING">Warning Only</option>
              <option value="OFFLINE">Offline Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Bus ID</th>
                <th className="p-3">Reg Plate</th>
                <th className="p-3">Assigned Route</th>
                <th className="p-3">Fleet Status</th>
                <th className="p-3">5-Camera Array</th>
                <th className="p-3">Edge AI Health</th>
                <th className="p-3">Network</th>
                <th className="p-3">Events Today</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBuses.map((bus) => {
                let statusBadge = "bg-emerald-950 text-emerald-400 border-emerald-800";
                if (bus.status === 'WARNING') statusBadge = "bg-amber-950 text-amber-400 border-amber-800";
                if (bus.status === 'OFFLINE') statusBadge = "bg-slate-800 text-slate-500 border-slate-700";

                return (
                  <tr 
                    key={bus.id}
                    onClick={() => setSelectedBus(bus)}
                    className="hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <td className="p-3 font-mono font-bold text-blue-400">{bus.id}</td>
                    <td className="p-3 font-mono text-slate-300">{bus.vehicleReg}</td>
                    <td className="p-3 font-semibold text-slate-100">{bus.routeId}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${statusBadge}`}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        {['front', 'rear', 'left', 'right', 'cabin'].map(cam => (
                          <span 
                            key={cam} 
                            title={`${cam.toUpperCase()}: ${bus.cameraStatus[cam]}`}
                            className={`w-2 h-2 rounded-full ${
                              bus.cameraStatus[cam] === 'ACTIVE' ? 'bg-emerald-400' :
                              bus.cameraStatus[cam] === 'DEGRADED' ? 'bg-amber-400' : 'bg-red-500'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-slate-400 font-mono ml-1">5/5 Array</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs">
                      <span className={bus.edgeAiHealth === 'OPTIMAL' ? 'text-emerald-400' : 'text-amber-400'}>
                        ● {bus.edgeAiHealth}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-400">{bus.network}</td>
                    <td className="p-3 font-mono font-bold text-purple-400">{bus.eventsToday}</td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBus(bus);
                        }}
                        className="text-blue-400 hover:text-blue-300 font-semibold text-[11px]"
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
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <Bus className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-lg font-black text-white">
                    {selectedBus.id} ({selectedBus.vehicleReg}) — Telemetry Inspection
                  </h3>
                  <p className="text-xs text-slate-400">{selectedBus.routeName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBus(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Hardware Telemetry Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500">Edge AI Load:</span>
                <div className="font-mono text-emerald-400 font-bold">CPU: {selectedBus.cpuLoad}% | GPU: {selectedBus.gpuUsage}%</div>
              </div>
              <div>
                <span className="text-slate-500">Network Telemetry:</span>
                <div className="font-mono text-blue-400 font-bold">{selectedBus.network}</div>
              </div>
              <div>
                <span className="text-slate-500">Speed / Heading:</span>
                <div className="font-mono text-slate-200">{selectedBus.speed} km/h • {selectedBus.heading}°</div>
              </div>
              <div>
                <span className="text-slate-500">Last Central Sync:</span>
                <div className="font-mono text-purple-400">{selectedBus.lastSync}</div>
              </div>
            </div>

            {/* SIMULATED EDGE AI PROTOTYPE FEED (5-CAMERA ARRAY) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Video className="w-4 h-4 text-purple-400" />
                  <span>Simulated Edge AI Prototype Feed (5-Camera Array)</span>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 font-mono">
                  PROTOTYPE SIMULATION
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
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative group">
                    <img src={cam.img} alt={cam.name} className="w-full h-28 object-cover opacity-80" />
                    
                    {/* Simulated Bounding Box Overlay */}
                    <div className="absolute top-4 left-6 w-20 h-14 border-2 border-emerald-400 bg-emerald-500/10 rounded flex items-start p-1 text-[9px] font-mono text-emerald-400 font-bold">
                      DEFECT_94%
                    </div>

                    <div className="p-2 bg-slate-950 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-300 truncate">{cam.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        cam.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {cam.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Firmware: <span className="text-mono text-slate-200">{selectedBus.firmwareVersion}</span></span>
              <button onClick={() => setSelectedBus(null)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded">
                Close Telemetry Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
