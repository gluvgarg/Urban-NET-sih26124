// EventDetailDrawer.jsx - Detailed drawer for inspecting and updating real Edge AI observations

import React from 'react';
import { X, MapPin, Bus, Clock, ShieldCheck, Layers } from 'lucide-react';
import { SeverityBadge, StatusBadge, CategoryBadge, HandlingBadge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const EventDetailDrawer = () => {
  const { selectedEvent, setSelectedEvent, updateEventStatus } = useApp();

  if (!selectedEvent) return null;

  const event = selectedEvent;

  const formattedModel = typeof event.model === 'object' && event.model !== null
    ? `${event.model.name || 'YOLOv8'} ${event.model.version ? 'v' + event.model.version : ''}`
    : (event.model || 'YOLOv8-Edge');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-blue-400 font-bold">{event.observationId}</span>
              <HandlingBadge handling={event.handling} />
            </div>
            <h2 className="text-base font-bold text-white mt-1">{event.type?.replace(/_/g, ' ')}</h2>
          </div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Severity Bar */}
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Current Status</span>
              <div className="mt-1">
                <StatusBadge status={event.status} />
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Severity Level</span>
              <div className="mt-1">
                <SeverityBadge severity={event.severity} />
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Category</span>
              <div className="mt-1">
                <CategoryBadge category={event.category} />
              </div>
            </div>
          </div>

          {/* Workflow Status Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
              Update Observation Workflow Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => updateEventStatus(event.observationId, st)}
                  className={`px-2 py-1.5 rounded text-xs font-semibold border text-center transition-colors cursor-pointer ${
                    event.status === st
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Evidence Frame */}
          {event.evidence?.imageUrl && (
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
                Edge Camera Evidence Snapshot
              </label>
              <div className="rounded-md border border-slate-200 overflow-hidden bg-slate-900">
                <img
                  src={event.evidence.imageUrl}
                  alt={event.type}
                  className="w-full h-48 object-cover"
                />
                <div className="px-3 py-2 bg-slate-900 text-slate-300 text-xs flex justify-between items-center font-mono">
                  <span>Model: {formattedModel}</span>
                  <span>Conf: {event.confidence !== undefined ? `${Math.round(event.confidence * 100)}%` : 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Technical Details Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Observation Details & Deduplication
            </h3>
            <div className="bg-white rounded-md border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Coordinates
                </span>
                <span className="font-mono text-slate-700">
                  {event.location?.lat !== undefined && event.location?.lng !== undefined
                    ? `${event.location.lat.toFixed(4)}, ${event.location.lng.toFixed(4)}`
                    : 'N/A'}
                </span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center">
                  <Bus className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Sensing Bus ID
                </span>
                <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {event.busId}
                </span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center">
                  <Layers className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Total Observations
                </span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {event.detectionCount || 1} times
                </span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Captured At
                </span>
                <span className="font-mono text-slate-700">
                  {event.capturedAt ? new Date(event.capturedAt).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Edge AI Model
                </span>
                <span className="font-mono text-slate-700">{formattedModel}</span>
              </div>
              {Array.isArray(event.detectedBy) && event.detectedBy.length > 0 && (
                <div className="p-3 flex justify-between items-center">
                  <span className="text-slate-500">Detected By Fleet</span>
                  <span className="font-mono text-slate-700">{event.detectedBy.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedEvent(null)}
            className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-900 transition-colors cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
