// AnalyticsReports.jsx - Sensing Analytics & Intelligence Page using Real Backend Data

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Layers, Bus } from 'lucide-react';
import { fetchAnalyticsSummary } from '../services/api/analyticsApi';

export const AnalyticsReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchAnalyticsSummary();
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError('Central server unavailable');
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-md border border-slate-200 p-12 text-center text-xs text-slate-500 font-mono">
        Aggregating Backend Sensing Analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-md border border-slate-200 p-12 text-center text-xs text-red-600 font-bold">
        {error || 'Analytics unavailable'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Urban Sensing Intelligence & Analytics</h1>
            <p className="text-xs text-slate-500">SIH26124 Problem Statement Analytics derived strictly from real backend database</p>
          </div>
          <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
            Source: <strong className="text-slate-900">Real Backend Database</strong>
          </div>
        </div>
      </div>

      {/* Grid 1: Events Timeline Stream (if available) & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Stream (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Observations Timeline Stream</h2>
              <p className="text-xs text-slate-500">Real observations captured grouped by timestamp</p>
            </div>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="h-72">
            {data.eventsOverTime.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                N/A (No temporal event data recorded in backend)
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.eventsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="ROAD" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRoad)" />
                  <Area type="monotone" dataKey="INFRASTRUCTURE" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorInfra)" />
                  <Area type="monotone" dataKey="TRAFFIC" stroke="#f97316" fillOpacity={1} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Breakdown BarChart (1 col) */}
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Observations By Category</h2>
            <p className="text-xs text-slate-500">Distribution across domain categories</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.eventsByCategory} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} width={95} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.eventsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid 2: Deduplication Detection Counts & Fleet Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deduplication & Detection Counts BarChart */}
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Top Deduplicated Issues</h2>
              <p className="text-xs text-slate-500">Detection count accumulated across bus passes</p>
            </div>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="h-64">
            {data.repeatedObservations.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                N/A (No repeated observations)
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.repeatedObservations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="observationId" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="detectionCount" name="Detection Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Fleet Sensing Activity */}
        <div className="bg-white rounded-md border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Fleet Sensing Unit Activity</h2>
              <p className="text-xs text-slate-500">Real events captured per bus unit</p>
            </div>
            <Bus className="w-4 h-4 text-blue-600" />
          </div>
          <div className="h-64">
            {data.fleetSensingActivity.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                N/A (No bus activity recorded)
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.fleetSensingActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="busId" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="eventsDetected" name="Observations Captured" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
