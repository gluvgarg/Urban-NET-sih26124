import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  Droplets, 
  ShieldAlert, 
  CheckCircle2, 
  Wrench, 
  MapPin, 
  Clock, 
  X, 
  UserCheck, 
  Play, 
  CheckSquare,
  Search,
  Filter
} from 'lucide-react';
import { ROAD_DEFECT_STATS } from '../data/defects';
import { SEVERITY_BADGES } from '../data/events';

export const RoadConditions = () => {
  const { defects, selectedDefect, setSelectedDefect, updateDefectStatus } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredDefects = defects.filter(def => {
    if (filterType !== 'ALL' && def.type.toLowerCase() !== filterType.toLowerCase()) return false;
    if (filterStatus !== 'ALL' && def.status.toLowerCase() !== filterStatus.toLowerCase()) return false;
    if (search && !def.location.toLowerCase().includes(search.toLowerCase()) && !def.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP ROAD DEFECT SUMMARY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>TOTAL ROAD ISSUES</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-white">{ROAD_DEFECT_STATS.totalIssues}</div>
          <div className="text-[10px] text-amber-400 font-semibold">Citywide Paving Audit</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>POTHOLES</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-rose-400">{ROAD_DEFECT_STATS.potholes}</div>
          <div className="text-[10px] text-slate-400">Surface Cratering</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>WATERLOGGING</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{ROAD_DEFECT_STATS.waterlogging}</div>
          <div className="text-[10px] text-slate-400">Drainage Accumulation</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>INFRASTRUCTURE</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{ROAD_DEFECT_STATS.infrastructureIssues}</div>
          <div className="text-[10px] text-slate-400">Dividers & Signage</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>RESOLVED TODAY</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{ROAD_DEFECT_STATS.resolvedToday}</div>
          <div className="text-[10px] text-emerald-400 font-semibold">37.7% Work Complete</div>
        </div>
      </div>

      {/* 2. CONTROLS & FILTER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search defect location or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
            >
              <option value="ALL">All Types</option>
              <option value="pothole">Pothole</option>
              <option value="waterlogging">Waterlogging</option>
              <option value="damaged road">Damaged Road</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <span className="font-semibold">Workflow Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="detected">Detected</option>
              <option value="assigned">Assigned</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. ROAD DEFECT DATA TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">MUNICIPAL ROAD MAINTENANCE LOG</span>
          </div>
          <span className="text-xs text-slate-400">Click any row to manage maintenance workflow</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Defect ID</th>
                <th className="p-3">Defect Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Sensing Bus</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Detected At</th>
                <th className="p-3">Workflow Status</th>
                <th className="p-3 text-right">Maintenance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDefects.map((def) => {
                let statusBadge = "bg-amber-950 text-amber-400 border-amber-800";
                if (def.status === 'Assigned') statusBadge = "bg-blue-950 text-blue-400 border-blue-800";
                if (def.status === 'In Progress') statusBadge = "bg-purple-950 text-purple-400 border-purple-800";
                if (def.status === 'Resolved') statusBadge = "bg-emerald-950 text-emerald-400 border-emerald-800";

                return (
                  <tr 
                    key={def.id}
                    onClick={() => setSelectedDefect(def)}
                    className="hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <td className="p-3 font-mono font-bold text-blue-400">{def.id}</td>
                    <td className="p-3 font-semibold text-slate-100">{def.type}</td>
                    <td className="p-3 text-slate-300">{def.location}</td>
                    <td className="p-3">
                      <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-blue-300 font-mono text-[11px]">
                        {def.busId}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-emerald-400">
                      {(def.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="p-3">
                      <span className={SEVERITY_BADGES[def.severity] || "bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded"}>
                        {def.severity}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{def.detectedAt}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded border font-bold ${statusBadge}`}>
                        {def.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDefect(def);
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MAINTENANCE WORKFLOW DETAIL DRAWER MODAL (Requested in PS) */}
      {selectedDefect && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in zoom-in-95">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono text-blue-400 font-bold">{selectedDefect.id}</div>
                <h3 className="text-lg font-black text-white">{selectedDefect.type} Maintenance Record</h3>
              </div>
              <button 
                onClick={() => setSelectedDefect(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workflow Progression Stepper */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Maintenance Lifecycle State Machine
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { state: 'Detected', color: selectedDefect.status === 'Detected' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400' },
                  { state: 'Assigned', color: selectedDefect.status === 'Assigned' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400' },
                  { state: 'In Progress', color: selectedDefect.status === 'In Progress' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400' },
                  { state: 'Resolved', color: selectedDefect.status === 'Resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400' }
                ].map(s => (
                  <div key={s.state} className={`p-2 rounded font-bold transition ${s.color}`}>
                    {s.state}
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Image & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden border border-slate-800 relative">
                <img 
                  src={selectedDefect.evidenceImage} 
                  alt="Defect Evidence" 
                  className="w-full h-44 object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-950/90 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-800">
                  Edge AI Confidence: {(selectedDefect.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                  <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-white">{selectedDefect.location}</span></div>
                  <div><span className="text-slate-500">GPS:</span> <span className="font-mono text-slate-300">{selectedDefect.latitude}, {selectedDefect.longitude}</span></div>
                  <div><span className="text-slate-500">Sensing Bus:</span> <span className="font-mono text-blue-400">{selectedDefect.busId}</span></div>
                  <div><span className="text-slate-500">Assigned Crew:</span> <span className="font-semibold text-amber-400">{selectedDefect.assignedTo}</span></div>
                  <div><span className="text-slate-500">Est Repair Cost:</span> <span className="font-semibold text-emerald-400">{selectedDefect.estimatedCost}</span></div>
                </div>

                <p className="text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 italic">
                  "{selectedDefect.description}"
                </p>
              </div>
            </div>

            {/* Action Buttons for State Transitions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-3 justify-end">
              {selectedDefect.status === 'Detected' && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'Assigned', 'Municipal Asphalt Crew 1')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition"
                >
                  <UserCheck className="w-4 h-4" /> Assign Maintenance Crew
                </button>
              )}

              {(selectedDefect.status === 'Assigned' || selectedDefect.status === 'Detected') && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'In Progress')}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition"
                >
                  <Play className="w-4 h-4" /> Start Paving Work
                </button>
              )}

              {selectedDefect.status !== 'Resolved' && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'Resolved')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition"
                >
                  <CheckSquare className="w-4 h-4" /> Mark as Resolved
                </button>
              )}

              <button 
                onClick={() => setSelectedDefect(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded text-xs transition"
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
