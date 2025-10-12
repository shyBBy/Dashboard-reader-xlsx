import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataFilters } from './DataFilters/DataFilters';
import { KPICards } from './KPICards/KPICards';
import { DynamicDataTable } from './DynamicDataTable/DynamicDataTable';
import { DetailedViewToggle } from './DetailedViewToggle/DetailedViewToggle';
import { useExcelData } from '../../context/ExcelDataContext';
import { useDataFilters } from '../../hooks/useDataFilters.hook';
import { getVisibleHeaders, getColumnStats } from '../../helpers/columnVisibility.helper';

/**
 * Zrefaktorowany komponent Dashboard - znacznie krótszy dzięki wydzieleniu logiki do hooków
 */
export const Dashboard = () => {
    const { excelData, hasData, error } = useExcelData();
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

    // Przekieruj na upload jeśli brak danych
    useEffect(() => {
        if (!hasData) {
            navigate('/upload');
        }
    }, [hasData, navigate]);

    // Jeśli nie ma danych, nie renderuj nic (useEffect przekieruje)
    if (!hasData) {
        return null;
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