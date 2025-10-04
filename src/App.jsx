import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/Upload/UploadPage';
import InfoPage from './pages/InfoPage';
import SingleStoreView from './views/SingleStoreView';

export default function App() {
  return (
    <Routes>
      {/* Landing page - bez layoutu */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Strony z głównym layoutem (sidebar + appbar) */}
      <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
      <Route path="/upload" element={<MainLayout><UploadPage /></MainLayout>} />
      <Route path="/info" element={<MainLayout><InfoPage /></MainLayout>} />
      <Route path="/sklep/:storeId" element={<MainLayout><SingleStoreView /></MainLayout>} />
      
      {/* 404 - przekierowanie na landing */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
