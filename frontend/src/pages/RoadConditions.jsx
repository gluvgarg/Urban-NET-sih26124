import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, 
  Droplets, 
  ShieldAlert, 
  CheckCircle2, 
  Wrench, 
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

  const potholesCount = defects.filter(d => d.type === 'Pothole' || d.type === 'POTHOLE').length;
  const waterloggingCount = defects.filter(d => d.type === 'Waterlogging' || d.type === 'WATERLOGGING').length;
  const resolvedCount = defects.filter(d => d.status === 'Resolved').length;

  return (
    <div className="space-y-4 pb-10 text-xs">
      {/* 1. TOP SUMMARY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>TOTAL ROAD DEFECTS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{defects.length || ROAD_DEFECT_STATS.totalIssues}</div>
          <div className="text-[10px] text-amber-400 font-mono">Citywide Paving Audit</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>POTHOLES</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono">{potholesCount || ROAD_DEFECT_STATS.potholes}</div>
          <div className="text-[10px] text-slate-400">Surface Cratering</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>WATERLOGGING</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400 font-mono">{waterloggingCount || ROAD_DEFECT_STATS.waterlogging}</div>
          <div className="text-[10px] text-slate-400">Inundated Corridors</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>INFRASTRUCTURE</span>
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300 font-mono">{ROAD_DEFECT_STATS.infrastructureIssues}</div>
          <div className="text-[10px] text-slate-400">Dividers & Signage</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>RESOLVED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{resolvedCount || ROAD_DEFECT_STATS.resolvedToday}</div>
          <div className="text-[10px] text-emerald-400 font-mono">Work Completed</div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search location or defect ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-400">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="pothole">Pothole</option>
              <option value="waterlogging">Waterlogging</option>
              <option value="damaged road">Damaged Road</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-300">
            <span className="font-semibold text-slate-400">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
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
      <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">MUNICIPAL ROAD MAINTENANCE LOG</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Click row to update status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800 font-mono">
              <tr>
                <th className="p-2">Defect ID</th>
                <th className="p-2">Type</th>
                <th className="p-2">Location</th>
                <th className="p-2">Bus Unit</th>
                <th className="p-2">Confidence</th>
                <th className="p-2">Severity</th>
                <th className="p-2">Detected At</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredDefects.map((def) => {
                let statusBadge = "bg-amber-950 text-amber-400 border-amber-800";
                if (def.status === 'Assigned') statusBadge = "bg-blue-950 text-blue-400 border-blue-800";
                if (def.status === 'In Progress') statusBadge = "bg-purple-950 text-purple-400 border-purple-800";
                if (def.status === 'Resolved') statusBadge = "bg-emerald-950 text-emerald-400 border-emerald-800";

                return (
                  <tr 
                    key={def.id}
                    onClick={() => setSelectedDefect(def)}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <td className="p-2 font-mono font-bold text-blue-400">{def.id}</td>
                    <td className="p-2 font-semibold text-slate-100">{def.type}</td>
                    <td className="p-2 text-slate-300">{def.location}</td>
                    <td className="p-2">
                      <span className="bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[10px]">
                        {def.busId}
                      </span>
                    </td>
                    <td className="p-2 font-mono font-semibold text-emerald-400">
                      {(def.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="p-2">
                      <span className={SEVERITY_BADGES[def.severity] || "bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded font-mono"}>
                        {def.severity}
                      </span>
                    </td>
                    <td className="p-2 text-slate-400 font-mono text-[10px]">{def.detectedAt || def.lastDetectedAt}</td>
                    <td className="p-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-mono font-semibold ${statusBadge}`}>
                        {def.status}
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDefect(def);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded text-[10px] font-semibold border border-slate-700 transition"
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

      {/* 4. MAINTENANCE WORKFLOW DETAIL DRAWER MODAL */}
      {selectedDefect && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded max-w-xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <div className="text-xs font-mono text-blue-400 font-bold">{selectedDefect.id}</div>
                <h3 className="text-sm font-bold text-white">{selectedDefect.type} Maintenance Record</h3>
              </div>
              <button 
                onClick={() => setSelectedDefect(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper */}
            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Workflow State Progression
              </div>
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-mono">
                {[
                  { state: 'Detected', active: selectedDefect.status === 'Detected' },
                  { state: 'Assigned', active: selectedDefect.status === 'Assigned' },
                  { state: 'In Progress', active: selectedDefect.status === 'In Progress' },
                  { state: 'Resolved', active: selectedDefect.status === 'Resolved' }
                ].map(s => (
                  <div key={s.state} className={`p-1.5 rounded font-bold ${s.active ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                    {s.state}
                  </div>
                ))}
              </div>
            </div>

            {/* Image & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded overflow-hidden border border-slate-800 relative">
                <img 
                  src={selectedDefect.evidenceImage} 
                  alt="Defect Evidence" 
                  className="w-full h-36 object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-slate-950/90 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-emerald-800">
                  Confidence: {(selectedDefect.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1 text-[11px]">
                  <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-white">{selectedDefect.location}</span></div>
                  <div><span className="text-slate-500">GPS:</span> <span className="font-mono text-slate-300">{selectedDefect.latitude}, {selectedDefect.longitude}</span></div>
                  <div><span className="text-slate-500">Bus Unit:</span> <span className="font-mono text-blue-400">{selectedDefect.busId}</span></div>
                  <div><span className="text-slate-500">Assigned Crew:</span> <span className="font-semibold text-amber-400">{selectedDefect.assignedTo || 'Unassigned'}</span></div>
                </div>

                <p className="text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  "{selectedDefect.description}"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2 justify-end">
              {selectedDefect.status === 'Detected' && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'Assigned', 'Municipal Asphalt Crew 1')}
                  className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Assign Crew
                </button>
              )}

              {(selectedDefect.status === 'Assigned' || selectedDefect.status === 'Detected') && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'In Progress')}
                  className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition"
                >
                  <Play className="w-3.5 h-3.5" /> Start Work
                </button>
              )}

              {selectedDefect.status !== 'Resolved' && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'Resolved')}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition"
                >
                  <CheckSquare className="w-3.5 h-3.5" /> Mark Resolved
                </button>
              )}

              <button 
                onClick={() => setSelectedDefect(null)}
                className="bg-slate-800 text-slate-300 font-semibold px-3 py-1.5 rounded text-xs"
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
