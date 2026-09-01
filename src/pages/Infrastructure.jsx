import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Eye, 
  MapPin, 
  X, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { MOCK_INFRASTRUCTURE, INFRASTRUCTURE_STATS } from '../data/infrastructure';
import { SEVERITY_BADGES } from '../data/events';

export const Infrastructure = () => {
  const { infrastructure, showToast } = useApp();
  const [selectedInfra, setSelectedInfra] = useState(null);

  const handleDispatchWorkOrder = (infraId) => {
    showToast(`Work order dispatched to Municipal Infrastructure Division for ${infraId}`, 'success');
    setSelectedInfra(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP INFRASTRUCTURE DEFICIENCY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>MISSING DIVIDERS</span>
            <ShieldAlert className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{INFRASTRUCTURE_STATS.missingDividers}</div>
          <div className="text-[10px] text-purple-300 font-semibold">Jersey Barriers Broken</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>MISSING ZEBRA CROSSINGS</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{INFRASTRUCTURE_STATS.missingZebraCrossings}</div>
          <div className="text-[10px] text-slate-400">Pedestrian Paint Eroded</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>DAMAGED SIGNBOARDS</span>
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{INFRASTRUCTURE_STATS.damagedSigns}</div>
          <div className="text-[10px] text-slate-400">Overhead Signs Bent</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase">
            <span>MISSING TRAFFIC SIGNS</span>
            <AlertOctagon className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-400">{INFRASTRUCTURE_STATS.missingSigns}</div>
          <div className="text-[10px] text-rose-400 font-semibold">School & Speed Signs</div>
        </div>
      </div>

      {/* 2. INFRASTRUCTURE DEFICIENCY TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-white">CITY INFRASTRUCTURE DEFICIENCY LOG</span>
          </div>
          <span className="text-xs text-slate-400">Detected by Edge AI multi-camera vision</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Issue ID</th>
                <th className="p-3">Infrastructure Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Detected By</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Assigned Agency</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {infrastructure.map((infra) => (
                <tr 
                  key={infra.id}
                  onClick={() => setSelectedInfra(infra)}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <td className="p-3 font-mono font-bold text-purple-400">{infra.id}</td>
                  <td className="p-3 font-semibold text-slate-100">{infra.type}</td>
                  <td className="p-3 text-slate-300">{infra.location}</td>
                  <td className="p-3">
                    <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-blue-300 font-mono text-[11px]">
                      {infra.busId}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-semibold text-emerald-400">
                    {(infra.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-3">
                    <span className={SEVERITY_BADGES[infra.severity] || "bg-slate-700 text-white text-[10px] px-2 py-0.5 rounded"}>
                      {infra.severity}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{infra.assignedAuthority}</td>
                  <td className="p-3">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                      {infra.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
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
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="font-mono text-purple-400 text-xs font-bold">{selectedInfra.id}</span>
                <h3 className="text-base font-bold text-white">{selectedInfra.type} Inspection</h3>
              </div>
              <button onClick={() => setSelectedInfra(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-lg overflow-hidden border border-slate-800 relative">
              <img src={selectedInfra.evidenceImage} alt="Infra Evidence" className="w-full h-44 object-cover" />
              <div className="absolute bottom-2 left-2 bg-slate-950/90 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
                Detection Confidence: {(selectedInfra.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs space-y-1 text-slate-300">
              <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-white">{selectedInfra.location}</span></div>
              <div><span className="text-slate-500">Sensing Bus:</span> <span className="font-mono text-blue-400">{selectedInfra.busId}</span></div>
              <div><span className="text-slate-500">Responsible Agency:</span> <span className="font-semibold text-purple-300">{selectedInfra.assignedAuthority}</span></div>
            </div>

            <p className="text-slate-300 text-xs bg-slate-950 p-2.5 rounded border border-slate-800">
              {selectedInfra.description}
            </p>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button 
                onClick={() => handleDispatchWorkOrder(selectedInfra.id)}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" /> Dispatch Work Order to Agency
              </button>
              <button onClick={() => setSelectedInfra(null)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded text-xs font-semibold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
