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
    <div className="space-y-4 pb-10 text-xs text-slate-800">
      {/* 1. TOP SUMMARY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>TOTAL ROAD DEFECTS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">{defects.length || ROAD_DEFECT_STATS.totalIssues}</div>
          <div className="text-[10px] text-amber-700 font-mono">Citywide Paving Audit</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>POTHOLES</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="text-xl font-bold text-red-600 font-mono">{potholesCount || ROAD_DEFECT_STATS.potholes}</div>
          <div className="text-[10px] text-slate-500">Surface Cratering</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>WATERLOGGING</span>
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-blue-600 font-mono">{waterloggingCount || ROAD_DEFECT_STATS.waterlogging}</div>
          <div className="text-[10px] text-slate-500">Inundated Corridors</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>INFRASTRUCTURE</span>
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-purple-700 font-mono">{ROAD_DEFECT_STATS.infrastructureIssues}</div>
          <div className="text-[10px] text-slate-500">Dividers & Signage</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3.5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-wider">
            <span>RESOLVED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono">{resolvedCount || ROAD_DEFECT_STATS.resolvedToday}</div>
          <div className="text-[10px] text-emerald-700 font-mono font-medium">Work Completed</div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search location or defect ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-500">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="pothole">Pothole</option>
              <option value="waterlogging">Waterlogging</option>
              <option value="damaged road">Damaged Road</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-700">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none"
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
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">MUNICIPAL ROAD MAINTENANCE LOG</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Click row to update status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200 font-mono">
              <tr>
                <th className="p-2.5">Defect ID</th>
                <th className="p-2.5">Source</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Location</th>
                <th className="p-2.5">Bus Unit</th>
                <th className="p-2.5">Confidence</th>
                <th className="p-2.5">Severity</th>
                <th className="p-2.5">Detected At</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefects.map((def) => {
                let statusBadge = "bg-amber-50 text-amber-800 border-amber-300";
                if (def.status === 'Assigned') statusBadge = "bg-blue-50 text-blue-700 border-blue-200";
                if (def.status === 'In Progress') statusBadge = "bg-purple-50 text-purple-700 border-purple-200";
                if (def.status === 'Resolved') statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";

                return (
                  <tr 
                    key={def.id}
                    onClick={() => setSelectedDefect(def)}
                    className="hover:bg-slate-50 transition cursor-pointer"
                  >
                    <td className="p-2.5 font-mono font-bold text-blue-700">{def.id}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        SOURCE: EDGE AI
                      </span>
                    </td>
                    <td className="p-2.5 font-semibold text-slate-900">{def.type}</td>
                    <td className="p-2.5 text-slate-700">{def.location}</td>
                    <td className="p-2.5">
                      <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-800 font-mono text-[10px]">
                        {def.busId}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-emerald-700">
                      {((def.confidence || 0.94) * 100).toFixed(1)}%
                    </td>
                    <td className="p-2.5">
                      <span className={SEVERITY_BADGES[def.severity] || "bg-slate-200 text-slate-800 text-[9px] px-1.5 py-0.5 rounded font-mono"}>
                        {def.severity}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-500 font-mono text-[10px]">{def.detectedAt || def.lastDetectedAt}</td>
                    <td className="p-2.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-mono font-semibold ${statusBadge}`}>
                        {def.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDefect(def);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded text-[10px] font-semibold border border-slate-300 transition"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-md max-w-xl w-full p-5 shadow-lg space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-blue-700 font-bold">{selectedDefect.id}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    SOURCE: EDGE AI
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{selectedDefect.type} Maintenance Record</h3>
              </div>
              <button 
                onClick={() => setSelectedDefect(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Workflow State Progression
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
                {[
                  { state: 'Detected', active: selectedDefect.status === 'Detected' },
                  { state: 'Assigned', active: selectedDefect.status === 'Assigned' },
                  { state: 'In Progress', active: selectedDefect.status === 'In Progress' },
                  { state: 'Resolved', active: selectedDefect.status === 'Resolved' }
                ].map(s => (
                  <div key={s.state} className={`p-1.5 rounded font-bold border ${s.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}>
                    {s.state}
                  </div>
                ))}
              </div>
            </div>

            {/* Image & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded overflow-hidden border border-slate-200 relative">
                <img 
                  src={selectedDefect.evidenceImage} 
                  alt="Defect Evidence" 
                  className="w-full h-36 object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-white/95 text-emerald-700 text-[9px] font-mono px-1.5 py-0.5 rounded border border-emerald-300 font-bold">
                  Confidence: {((selectedDefect.confidence || 0.94) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="space-y-1.5 text-slate-700">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1 text-[11px]">
                  <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-slate-900">{selectedDefect.location}</span></div>
                  <div><span className="text-slate-500">GPS:</span> <span className="font-mono text-slate-700">{selectedDefect.latitude}, {selectedDefect.longitude}</span></div>
                  <div><span className="text-slate-500">Bus Unit:</span> <span className="font-mono text-blue-700">{selectedDefect.busId}</span></div>
                  <div><span className="text-slate-500">Assigned Crew:</span> <span className="font-semibold text-amber-800">{selectedDefect.assignedTo || 'Unassigned'}</span></div>
                </div>

                <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
                  "{selectedDefect.description}"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
              {selectedDefect.status === 'Detected' && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'Assigned', 'Municipal Asphalt Crew 1')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Assign Crew
                </button>
              )}

              {(selectedDefect.status === 'Assigned' || selectedDefect.status === 'Detected') && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'In Progress')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition"
                >
                  <Play className="w-3.5 h-3.5" /> Start Work
                </button>
              )}

              {selectedDefect.status !== 'Resolved' && (
                <button 
                  onClick={() => updateDefectStatus(selectedDefect.id, 'Resolved')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition"
                >
                  <CheckSquare className="w-3.5 h-3.5" /> Mark Resolved
                </button>
              )}

              <button 
                onClick={() => setSelectedDefect(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded text-xs border border-slate-300"
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
