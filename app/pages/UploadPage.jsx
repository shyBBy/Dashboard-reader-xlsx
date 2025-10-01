import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Typography, Box, Paper, Button, Alert, Divider } from '@mui/material';
import { UploadFile, Delete, Dashboard } from '@mui/icons-material';
import { Link } from 'react-router';
import { ExcelUploader } from '../components/ExcelUploader/ExcelUploader';
import { useExcelData } from '../context/ExcelDataContext';

const UploadView = () => {
    const { hasData, loadData, clearData, handleError, fileName, totalRows } = useExcelData();

    const handleDataLoaded = (data) => {
        loadData(data);
    };

    const handleClearData = () => {
        clearData();
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mb: 4 }}>
                <UploadFile sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Zarządzanie danymi Excel
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Wgraj plik Excel z danymi blokerów aby rozpocząć analizę
                </Typography>
            </Paper>

            {/* Status aktualnych danych */}
            {hasData && (
                <Alert 
                    severity="success" 
                    sx={{ mb: 4 }}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleClearData}
                            startIcon={<Delete />}
                        >
                            Usuń dane
                        </Button>
                    }
                >
                    <strong>Dane załadowane:</strong> {fileName} ({totalRows} wierszy)
                </Alert>
            )}

            {/* Upload lub Replace */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {hasData ? '🔄 Zastąp dane nowymi' : '📤 Wgraj dane'}
                </Typography>
                <ExcelUploader 
                    onDataLoaded={handleDataLoaded}
                    onError={handleError}
                />
            </Box>

            {/* Akcje */}
            {hasData && (
                <>
                    <Divider sx={{ my: 4 }} />
                    
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            ✅ Dane gotowe do analizy!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Przejdź do dashboardu aby zobaczyć szczegółowe analizy i wskaźniki
                        </Typography>
                        
                        <Button
                            component={Link}
                            to="/dashboard"
                            variant="contained"
                            size="large"
                            startIcon={<Dashboard />}
                            sx={{ mr: 2 }}
                        >
                            Przejdź do Dashboard
                        </Button>
                        
                        <Button
                            onClick={handleClearData}
                            variant="outlined"
                            color="error"
                            size="large"
                            startIcon={<Delete />}
                        >
                            Usuń dane
                        </Button>
                    </Paper>
                </>
            )}
        </Box>
    );
};

export const UploadPage = () => {
    return (
        <MainLayout>
            <UploadView />
        </MainLayout>
    );
};