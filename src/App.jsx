import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import InfoPage from './pages/InfoPage';
import SingleStoreView from './views/SingleStoreView';
import ApiTestPanel from './components/ApiTestPanel/ApiTestPanel';
import TestAllComponentsPage from './pages/TestAllComponentsPage';

export default function App() {
  return (
    <Routes>
      {/* Dashboard jako domyślna strona */}
      <Route path="/" element={<MainLayout><DashboardPage /></MainLayout>} />
      
      {/* Pozostałe strony z głównym layoutem */}
      <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
      <Route path="/info" element={<MainLayout><InfoPage /></MainLayout>} />
      <Route path="/api-test" element={<MainLayout><ApiTestPanel /></MainLayout>} />
      <Route path="/sklep/:storeId" element={<MainLayout><SingleStoreView /></MainLayout>} />
      
      {/* Strony bez layoutu (fullscreen) */}
      <Route path="/test-all" element={<TestAllComponentsPage />} />
      <Route path="/landing" element={<LandingPage />} />
      
      {/* 404 - przekierowanie na dashboard */}
      <Route path="*" element={<MainLayout><DashboardPage /></MainLayout>} />
    </Routes>
  );
}
