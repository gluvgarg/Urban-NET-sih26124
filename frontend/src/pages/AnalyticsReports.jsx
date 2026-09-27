import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Sparkles, 
  Map, 
  Download, 
  FileText, 
  Calendar, 
  Building2, 
  ArrowRight
} from 'lucide-react';
import { 
  ORIGIN_DESTINATION_MATRIX, 
  ACTIONABLE_URBAN_INSIGHTS, 
  BUS_CONTRIBUTION_LEADERBOARD,
  REPORT_TYPES
} from '../data/analytics';

export const AnalyticsReports = () => {
  const { showToast, busLeaderboard } = useApp();
  const [timeFilter, setTimeFilter] = useState('7_DAYS');
  const [selectedReport, setSelectedReport] = useState('ROAD_DEFECTS');
  const [isExporting, setIsExporting] = useState(false);

  const leaderboardData = busLeaderboard && busLeaderboard.length > 0 ? busLeaderboard : BUS_CONTRIBUTION_LEADERBOARD;

  const handleGenerateReport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast(`Generated & Downloaded Municipal ${format} Report successfully!`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-12 text-xs text-slate-800">
      {/* 1. TOP HEADER & TIME FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-md p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Centralized Urban Intelligence & Municipal Analytics
          </h2>
          <p className="text-xs text-slate-500">Aggregated sensing telemetry from public transport mobile units</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded border border-slate-200 text-xs">
          <Calendar className="w-3.5 h-3.5 text-blue-600 ml-1" />
          {['TODAY', '7_DAYS', '30_DAYS', 'CUSTOM'].map(t => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1 rounded font-bold transition ${
                timeFilter === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ACTIONABLE URBAN INSIGHTS */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Actionable Urban Insights
            </span>
          </div>
          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold font-mono">
            AUTOMATED REASONING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACTIONABLE_URBAN_INSIGHTS.map(insight => (
            <div key={insight.id} className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2 hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{insight.title}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                  insight.urgency === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {insight.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{insight.summary}</p>
              <div className="pt-2 border-t border-slate-200 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                <span>Recommendation: {insight.recommendedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ORIGIN-DESTINATION (OD) MATRIX VISUALIZER */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <Map className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Origin-Destination (OD) Traffic Flow Matrix
            </span>
          </div>
          <span className="text-xs text-slate-500">Peak Hour Trip Distribution (Vehicles / Hr)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs text-slate-800 border border-slate-200">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px]">
              <tr>
                <th className="p-2.5 text-left border border-slate-200">Origin \ Destination</th>
                {ORIGIN_DESTINATION_MATRIX.zones.map(z => (
                  <th key={z} className="p-2.5 border border-slate-200">{z.split(' ')[1]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORIGIN_DESTINATION_MATRIX.matrix.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50">
                  <td className="p-2.5 text-left font-bold text-slate-900 bg-slate-50 border border-slate-200">
                    {ORIGIN_DESTINATION_MATRIX.zones[rIdx]}
                  </td>
                  {row.map((val, cIdx) => {
                    let bg = "bg-white";
                    if (val > 400) bg = "bg-red-50 text-red-700 font-bold border border-red-200";
                    else if (val > 250) bg = "bg-amber-50 text-amber-800 font-bold border border-amber-200";
                    else if (val > 0) bg = "bg-slate-50 text-slate-800 border border-slate-200";

                    return (
                      <td key={cIdx} className={`p-2.5 font-mono ${bg}`}>
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
          <div className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Top High-Density Traffic Corridors</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ORIGIN_DESTINATION_MATRIX.topCorridors.map(cor => (
              <div key={cor.rank} className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-blue-700">Rank #{cor.rank}: {cor.corridor}</div>
                <div className="text-slate-800 font-mono font-semibold">{cor.volume}</div>
                <div className="text-[10px] text-amber-800 font-semibold">{cor.flowRate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. BUS CONTRIBUTION LEADERBOARD */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Fleet Sensing Contribution Leaderboard
            </span>
          </div>
          <span className="text-xs text-slate-500">Top 5 Edge AI Sensing Units</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200 font-mono">
              <tr>
                <th className="p-2.5">Bus Unit</th>
                <th className="p-2.5">Route</th>
                <th className="p-2.5">Total Events Logged</th>
                <th className="p-2.5">Defects Detected</th>
                <th className="p-2.5">Incidents Logged</th>
                <th className="p-2.5 text-right">Edge Uptime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboardData.map(bus => (
                <tr key={bus.busId} className="hover:bg-slate-50 transition">
                  <td className="p-2.5 font-mono font-bold text-blue-700">{bus.busId}</td>
                  <td className="p-2.5 text-slate-800">{bus.route}</td>
                  <td className="p-2.5 font-mono font-bold text-purple-700">{bus.eventsLogged}</td>
                  <td className="p-2.5 font-mono text-amber-800 font-bold">{bus.defectsCount}</td>
                  <td className="p-2.5 font-mono text-red-600 font-bold">{bus.incidentsLogged}</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-700 text-right">{bus.uptime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MUNICIPAL REPORT GENERATOR & EXPORT TOOL */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Municipal Report Generator & Data Export
            </span>
          </div>
          <span className="text-xs text-slate-500">Official Municipal PDF / CSV Documents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REPORT_TYPES.map(rep => (
            <div 
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`p-4 rounded border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                selectedReport === rep.id 
                  ? 'bg-blue-50 border-blue-500 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="font-bold text-xs text-slate-900">{rep.title}</div>
                <p className="text-[11px] text-slate-500 mt-1">{rep.desc}</p>
              </div>
              <div className="text-[10px] text-blue-700 font-semibold pt-2 border-t border-slate-200 font-mono">
                {selectedReport === rep.id ? '✓ Selected' : 'Click to select'}
              </div>
            </div>
          ))}
        </div>

        {/* Generate Action Buttons */}
        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Selected Report: <span className="font-bold text-slate-900">{REPORT_TYPES.find(r => r.id === selectedReport)?.title}</span>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleGenerateReport('PDF')}
              disabled={isExporting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Export Official PDF
            </button>
            <button
              onClick={() => handleGenerateReport('CSV')}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Export Raw CSV Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
