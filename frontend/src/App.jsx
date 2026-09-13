import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';
import { Overview } from './pages/Overview';
import { GisMap } from './pages/GisMap';
import { RoadConditions } from './pages/RoadConditions';
import { TrafficIntelligence } from './pages/TrafficIntelligence';
import { Infrastructure } from './pages/Infrastructure';
import { SafetyIncidents } from './pages/SafetyIncidents';
import { BusFleet } from './pages/BusFleet';
import { AnalyticsReports } from './pages/AnalyticsReports';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Overview />} />
            <Route path="gis-map" element={<GisMap />} />
            <Route path="road-conditions" element={<RoadConditions />} />
            <Route path="traffic-intelligence" element={<TrafficIntelligence />} />
            <Route path="infrastructure" element={<Infrastructure />} />
            <Route path="safety-incidents" element={<SafetyIncidents />} />
            <Route path="bus-fleet" element={<BusFleet />} />
            <Route path="analytics-reports" element={<AnalyticsReports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
