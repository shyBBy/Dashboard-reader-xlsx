import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Typography, Box } from '@mui/material';

export function meta() {
  return [
    { title: "Charts - Dashboard Reader XLSX" },
    { name: "description", content: "Generuj wykresy z danych Excel" },
  ];
}

export default function Charts() {
  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Wykresy</Typography>
        <Typography variant="body1">Tutaj będą wykresy...</Typography>
      </Box>
    </MainLayout>
  );
}