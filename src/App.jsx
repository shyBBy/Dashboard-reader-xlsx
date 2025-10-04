import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../app/layouts/MainLayout';
import LandingPage from '../app/pages/LandingPage';
import { DashboardPage } from '../app/pages/DashboardPage';
import { UploadPage } from '../app/pages/Upload/UploadPage';
import InfoPage from '../app/pages/InfoPage';

// Import dla pojedynczego sklepu
import SingleStoreView from '../app/views/SingleStoreView';

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
