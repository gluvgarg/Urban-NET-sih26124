import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Sparkles, 
  Map, 
  Clock, 
  Download, 
  FileText, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  ORIGIN_DESTINATION_MATRIX, 
  ACTIONABLE_URBAN_INSIGHTS, 
  BUS_CONTRIBUTION_LEADERBOARD,
  REPORT_TYPES
} from '../data/analytics';
import { ROUTE_PERFORMANCE } from '../data/traffic';

export const AnalyticsReports = () => {
  const { showToast } = useApp();
  const [timeFilter, setTimeFilter] = useState('7_DAYS');
  const [selectedReport, setSelectedReport] = useState('ROAD_DEFECTS');
  const [isExporting, setIsExporting] = useState(false);

  const handleGenerateReport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast(`Generated & Downloaded Municipal ${format} Report successfully!`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP HEADER & TIME FILTER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Centralized Urban Intelligence & Municipal Analytics
          </h2>
          <p className="text-xs text-slate-400">Aggregated sensing telemetry from public transport mobile units</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded border border-slate-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-blue-400 ml-1" />
          {['TODAY', '7_DAYS', '30_DAYS', 'CUSTOM'].map(t => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1 rounded font-bold transition ${
                timeFilter === t ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTIONABLE URBAN INSIGHTS (User requested title update) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Actionable Urban Insights
            </span>
          </div>
          <span className="text-xs text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 font-bold">
            AUTOMATED REASONING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACTIONABLE_URBAN_INSIGHTS.map(insight => (
            <div key={insight.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{insight.title}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                  insight.urgency === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {insight.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{insight.summary}</p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>Recommendation: {insight.recommendedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ORIGIN-DESTINATION (OD) MATRIX VISUALIZER (PS Requirement) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Map className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Origin-Destination (OD) Traffic Flow Matrix
            </span>
          </div>
          <span className="text-xs text-slate-400">Peak Hour Trip Distribution (Vehicles / Hr)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs text-slate-300 border border-slate-800">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3 text-left border border-slate-800">Origin \ Destination</th>
                {ORIGIN_DESTINATION_MATRIX.zones.map(z => (
                  <th key={z} className="p-3 border border-slate-800">{z.split(' ')[1]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORIGIN_DESTINATION_MATRIX.matrix.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40">
                  <td className="p-3 text-left font-bold text-slate-200 bg-slate-950 border border-slate-800">
                    {ORIGIN_DESTINATION_MATRIX.zones[rIdx]}
                  </td>
                  {row.map((val, cIdx) => {
                    let bg = "bg-slate-900";
                    if (val > 400) bg = "bg-rose-950/80 text-rose-300 font-bold border border-rose-800";
                    else if (val > 250) bg = "bg-amber-950/60 text-amber-300 font-bold border border-amber-800/60";
                    else if (val > 0) bg = "bg-slate-950 text-slate-300 border border-slate-800";

                    return (
                      <td key={cIdx} className={`p-3 font-mono ${bg}`}>
                        {val === 0 ? '—' : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Traffic Corridors */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Top High-Density Traffic Corridors</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ORIGIN_DESTINATION_MATRIX.topCorridors.map(cor => (
              <div key={cor.rank} className="bg-slate-950 p-3 rounded border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-blue-400">Rank #{cor.rank}: {cor.corridor}</div>
                <div className="text-slate-300 font-mono">{cor.volume}</div>
                <div className="text-[10px] text-amber-400 font-semibold">{cor.flowRate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BUS CONTRIBUTION LEADERBOARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Fleet Sensing Contribution Leaderboard
            </span>
          </div>
          <span className="text-xs text-slate-400">Top 5 Edge AI Sensing Units</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Bus Unit</th>
                <th className="p-3">Route</th>
                <th className="p-3">Total Events Logged</th>
                <th className="p-3">Defects Detected</th>
                <th className="p-3">Incidents Logged</th>
                <th className="p-3 text-right">Edge Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {BUS_CONTRIBUTION_LEADERBOARD.map(bus => (
                <tr key={bus.busId} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-blue-400">{bus.busId}</td>
                  <td className="p-3 text-slate-200">{bus.route}</td>
                  <td className="p-3 font-mono font-bold text-purple-300">{bus.eventsLogged}</td>
                  <td className="p-3 font-mono text-amber-400">{bus.defectsCount}</td>
                  <td className="p-3 font-mono text-rose-400">{bus.incidentsLogged}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400 text-right">{bus.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MUNICIPAL REPORT GENERATOR & MOCK EXPORT TOOL (Merged from page 9) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Municipal Report Generator & Data Export
            </span>
          </div>
          <span className="text-xs text-slate-400">Official Municipal PDF / CSV Documents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REPORT_TYPES.map(rep => (
            <div 
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-4 rounded-lg border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                selectedReport === rep.id 
                  ? 'bg-blue-950/80 border-blue-500 shadow-md' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-white">{rep.title}</div>
                <p className="text-[11px] text-slate-400 mt-1">{rep.desc}</p>
              </div>
              <div className="text-[10px] text-blue-400 font-semibold pt-2 border-t border-slate-800/80">
                {selectedReport === rep.id ? '✓ Selected' : 'Click to select'}
              </div>
            </div>
          ))}
        </div>

        {/* Generate Action Buttons */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Selected Report: <span className="font-bold text-white">{REPORT_TYPES.find(r => r.id === selectedReport)?.title}</span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleGenerateReport('PDF')}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Export Official PDF
            </button>
            <button
              onClick={() => handleGenerateReport('CSV')}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Export Raw CSV Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
