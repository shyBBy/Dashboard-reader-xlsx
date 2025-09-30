import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Typography, Box } from '@mui/material';

export function meta() {
  return [
    { title: "Analytics - Dashboard Reader XLSX" },
    { name: "description", content: "Analizy danych z Excel" },
  ];
}

export default function Analytics() {
  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Analityki</Typography>
        <Typography variant="body1">Tutaj będą analizy...</Typography>
      </Box>
    </MainLayout>
  );
}