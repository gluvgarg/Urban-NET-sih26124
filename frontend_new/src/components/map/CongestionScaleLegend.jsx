// CongestionScaleLegend.jsx - Interactive Heatmap Legend with Color Gradients & Scale
import React from 'react';
import { Layers, Activity, Flame, ShieldAlert, Bus } from 'lucide-react';

export const CongestionScaleLegend = ({ 
  mode = 'SPLIT', // 'SPLIT', 'TRAFFIC', 'DEFECTS', 'COMBINED'
  onFilterChange,
  currentFilter = 'ALL'
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-md border border-slate-200 shadow-sm text-xs space-y-3 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-xs">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span>GIS Heatmap & Density Legend</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Edge-AI Sensing</span>
      </div>

      {/* Traffic Congestion Continuous Color Scale */}
      {(mode === 'SPLIT' || mode === 'TRAFFIC' || mode === 'COMBINED') && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              Traffic Congestion Index
            </span>
            <span className="text-[10px] text-slate-500 font-mono">0 (Low) → 100 (High)</span>
          </div>

          {/* Continuous Gradient Bar */}
          <div className="h-3.5 w-full rounded-full overflow-hidden shadow-inner border border-slate-300 relative bg-linear-to-r from-emerald-500 via-amber-400 via-orange-500 to-red-600"></div>

          {/* Scale Labels */}
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-600 pt-0.5">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Low Flow (&lt; 35)
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              Moderate (35-70)
            </span>
            <span className="flex items-center gap-1 font-semibold text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
              High / Jam (&gt; 70)
            </span>
          </div>
        </div>
      )}

      {/* Road Defects & Potholes Legend */}
      {(mode === 'SPLIT' || mode === 'DEFECTS' || mode === 'COMBINED') && (
        <div className="space-y-1.5 border-t border-slate-100 pt-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
              Road Defects & Pothole Sensing
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Severity</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="flex items-center gap-1.5 bg-red-50 text-red-800 p-1.5 rounded border border-red-200">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 shadow-xs"></span>
              <div>
                <div className="font-bold">Critical</div>
                <div className="text-[9px] text-red-600 font-mono">Deep Pothole</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-800 p-1.5 rounded border border-orange-200">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 shadow-xs"></span>
              <div>
                <div className="font-bold">High</div>
                <div className="text-[9px] text-orange-600 font-mono">Waterlogging</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 p-1.5 rounded border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-xs"></span>
              <div>
                <div className="font-bold">Moderate</div>
                <div className="text-[9px] text-amber-600 font-mono">Surface Crack</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Sensing Fleet Marker */}
      <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded border border-slate-200 text-[11px] text-slate-700">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shadow-xs">🚌</span>
          <span className="font-medium">Public Transit Bus (Edge AI Telemetry Unit)</span>
        </div>
        <span className="text-[10px] font-mono text-blue-700 font-semibold">10 Hz GPS</span>
      </div>
    </div>
  );
};
