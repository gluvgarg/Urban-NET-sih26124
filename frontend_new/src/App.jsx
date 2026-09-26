// App.jsx - Application Router & Main Entry

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';
import { Overview } from './pages/Overview';
import { GisMap } from './pages/GisMap';
import { Events } from './pages/Events';
import { BusFleet } from './pages/BusFleet';
import { AnalyticsReports } from './pages/AnalyticsReports';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Overview />} />
            <Route path="map" element={<GisMap />} />
            <Route path="events" element={<Events />} />
            <Route path="fleet" element={<BusFleet />} />
            <Route path="analytics" element={<AnalyticsReports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
