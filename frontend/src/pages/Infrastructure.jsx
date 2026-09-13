import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  AlertOctagon, 
  X, 
  Send 
} from 'lucide-react';
import { INFRASTRUCTURE_STATS } from '../data/infrastructure';
import { SEVERITY_BADGES } from '../data/events';

export const Infrastructure = () => {
  const { infrastructure, showToast } = useApp();
  const [selectedInfra, setSelectedInfra] = useState(null);

  const handleDispatchWorkOrder = (infraId) => {
    showToast(`Work order dispatched to Municipal Infrastructure Division for ${infraId}`, 'success');
    setSelectedInfra(null);
  };

  const missingDividers = infrastructure.filter(i => i.type?.toLowerCase().includes('divider')).length;
  const missingZebraCrossings = infrastructure.filter(i => i.type?.toLowerCase().includes('zebra')).length;
  const damagedSigns = infrastructure.filter(i => i.type?.toLowerCase().includes('sign')).length;
  const missingSigns = infrastructure.filter(i => i.type?.toLowerCase().includes('missing traffic')).length;

  return (
    <div className="space-y-4 pb-10 text-xs">
      {/* 1. TOP INFRASTRUCTURE DEFICIENCY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>MISSING DIVIDERS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 font-mono">{missingDividers || INFRASTRUCTURE_STATS.missingDividers}</div>
          <div className="text-[10px] text-purple-300 font-mono">Jersey Barriers Broken</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>MISSING ZEBRA CROSSINGS</span>
            <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono">{missingZebraCrossings || INFRASTRUCTURE_STATS.missingZebraCrossings}</div>
          <div className="text-[10px] text-slate-400">Pedestrian Paint Eroded</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>DAMAGED SIGNBOARDS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400 font-mono">{damagedSigns || INFRASTRUCTURE_STATS.damagedSigns}</div>
          <div className="text-[10px] text-slate-400">Overhead Signs Bent</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span>MISSING TRAFFIC SIGNS</span>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono">{missingSigns || INFRASTRUCTURE_STATS.missingSigns}</div>
          <div className="text-[10px] text-rose-400 font-mono">School & Speed Signs</div>
        </div>
      </div>

      {/* 2. INFRASTRUCTURE DEFICIENCY TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded p-3 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">CITY INFRASTRUCTURE DEFICIENCY LOG</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Detected by Edge AI Vision</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="p-2">Issue ID</th>
                <th className="p-2">Type</th>
                <th className="p-2">Location</th>
                <th className="p-2">Bus Unit</th>
                <th className="p-2">Confidence</th>
                <th className="p-2">Severity</th>
                <th className="p-2">Assigned Agency</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {infrastructure.map((infra) => (
                <tr 
                  key={infra.id}
                  onClick={() => setSelectedInfra(infra)}
                  className="hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <td className="p-2 font-mono font-bold text-purple-400">{infra.id}</td>
                  <td className="p-2 font-semibold text-slate-100">{infra.type}</td>
                  <td className="p-2 text-slate-300">{infra.location}</td>
                  <td className="p-2">
                    <span className="bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[10px]">
                      {infra.busId}
                    </span>
                  </td>
                  <td className="p-2 font-mono font-semibold text-emerald-400">
                    {(infra.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-2">
                    <span className={SEVERITY_BADGES[infra.severity] || "bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded font-mono"}>
                      {infra.severity}
                    </span>
                  </td>
                  <td className="p-2 text-slate-300">{infra.assignedAuthority}</td>
                  <td className="p-2">
                    <span className="text-[10px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                      {infra.status}
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInfra(infra);
                      }}
                      className="text-purple-400 hover:text-purple-300 font-semibold text-[11px]"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. INFRASTRUCTURE DETAIL MODAL WITH EVIDENCE */}
      {selectedInfra && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded max-w-lg w-full p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="font-mono text-purple-400 text-xs font-bold">{selectedInfra.id}</span>
                <h3 className="text-sm font-bold text-white">{selectedInfra.type} Inspection</h3>
              </div>
              <button onClick={() => setSelectedInfra(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded overflow-hidden border border-slate-800 relative">
              <img src={selectedInfra.evidenceImage} alt="Infra Evidence" className="w-full h-40 object-cover" />
              <div className="absolute bottom-1.5 left-1.5 bg-slate-950/90 text-emerald-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-emerald-800">
                Confidence: {(selectedInfra.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-xs space-y-1 text-slate-300">
              <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-white">{selectedInfra.location}</span></div>
              <div><span className="text-slate-500">Bus Unit:</span> <span className="font-mono text-blue-400">{selectedInfra.busId}</span></div>
              <div><span className="text-slate-500">Responsible Agency:</span> <span className="font-semibold text-purple-300">{selectedInfra.assignedAuthority}</span></div>
            </div>

            <p className="text-slate-300 text-xs bg-slate-950 p-2 rounded border border-slate-800">
              {selectedInfra.description}
            </p>

            <div className="flex gap-2 pt-1 border-t border-slate-800">
              <button 
                onClick={() => handleDispatchWorkOrder(selectedInfra.id)}
                className="flex-1 bg-purple-700 hover:bg-purple-600 text-white font-bold py-1.5 rounded text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Work Order
              </button>
              <button onClick={() => setSelectedInfra(null)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
