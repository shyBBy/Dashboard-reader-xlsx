import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Divider, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataFilters } from './DataFilters/DataFilters';
import { KPICards } from './KPICards/KPICards';
import { DynamicDataTable } from './DynamicDataTable/DynamicDataTable';
import { DetailedViewToggle } from './DetailedViewToggle/DetailedViewToggle';
import { useApiData } from '../../context/ApiDataContext';
import { useDataFilters } from '../../hooks/useDataFilters.hook';
import { getVisibleHeaders, getColumnStats } from '../../helpers/columnVisibility.helper';

/**
 * Zrefaktorowany komponent Dashboard - znacznie krótszy dzięki wydzieleniu logiki do hooków
 */
export const Dashboard = () => {
    const { excelData, hasData, error, isLoading, isApiConnected } = useApiData();
    const navigate = useNavigate();
    
    // State dla widoku szczegółowego (domyślnie wyłączony)
    const [detailedView, setDetailedView] = useState(false);

    // Logika filtrowania przeniesiona do custom hooka
    const {
        filters,
        filteredData,
        handleFiltersChange,
        filteredCount
    } = useDataFilters(excelData?.data);
    
    // Oblicz widoczne nagłówki na podstawie trybu widoku
    const visibleHeaders = getVisibleHeaders(excelData?.headers, detailedView);
    const columnStats = getColumnStats(excelData?.headers, detailedView);

    // Nie przekierowuj na upload - teraz dane przychodzą z API
    // useEffect(() => {
    //     if (!hasData) {
    //         navigate('/upload');
    //     }
    // }, [hasData, navigate]);

    // Loading state
    if (isLoading) {
        return (
            <Box sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                flexDirection: 'column',
                gap: 3,
                textAlign: 'center',
                backgroundColor: 'background.default'
            }}>
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress 
                        size={80} 
                        thickness={4}
                        sx={{
                            color: (theme) => theme.palette.primary.main,
                            animation: 'pulse 2s infinite'
                        }}
                    />
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '2rem'
                        }}
                    >
                        📊
                    </Typography>
                </Box>
                
                <Box>
                    <Typography variant="h5" color="text.primary" gutterBottom>
                        Trwa pobieranie danych
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        {isApiConnected ? 'Pobieranie blokerów i sklepów z API...' : 'Łączenie z serwerem Python FastAPI...'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                        Proszę czekać, to może chwilę potrwać
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Error state - gdy API nie działa
    if (!isApiConnected || error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Błąd połączenia z API
                    </Typography>
                    <Typography variant="body2">
                        {error || 'Nie można połączyć się z serwerem Python FastAPI'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Sprawdź czy serwer działa na: <code>http://localhost:8000</code>
                    </Typography>
                </Alert>
            </Box>
        );
    }

    // Jeśli nie ma danych ale API działa
    if (!hasData) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Brak danych
                    </Typography>
                    <Typography variant="body2">
                        API działa, ale nie zwróciło żadnych danych o blokerach
                    </Typography>
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
            {/* Nagłówek */}
            {/* <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    📊 Dashboard Analiz Blokerów
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Analizuj dane z pliku: <strong>{excelData.fileName}</strong> ({excelData.totalRows} wierszy)
                </Typography>
            </Box> */}

            {/* Obsługa błędów - ukryj błędy localStorage */}
            {error && !error.includes('localStorage') && !error.includes('Storage') && !error.includes('quota') && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Karty KPI */}
            <KPICards 
                data={excelData.data}
                filteredData={filteredData}
            />

            <Divider sx={{ my: 4 }} />

            {/* Toggle widoku szczegółowego - NAD filtrami */}
            <DetailedViewToggle
                detailedView={detailedView}
                onToggle={setDetailedView}
                columnStats={columnStats}
            />

            {/* Filtry */}
            <DataFilters
                data={excelData.data}
                onFiltersChange={handleFiltersChange}
                selectedFilters={filters}
                filteredCount={filteredCount}
            />

            {/* Tabela danych - z filtrowanymi nagłówkami */}
            <DynamicDataTable
                data={excelData.data}
                headers={visibleHeaders}
                filteredData={filteredData}
            />


        </Box>
    );
};