import React, { useEffect } from 'react';
import { Box, Typography, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router';
import { DataFilters } from '../DataFilters/DataFilters';
import { KPICards } from '../KPICards/KPICards';
import { DynamicDataTable } from '../DynamicDataTable/DynamicDataTable';
import { useExcelData } from '../../context/ExcelDataContext';
import { useDataFilters } from '../../hooks/useDataFilters.hook';

/**
 * Zrefaktorowany komponent Dashboard - znacznie krótszy dzięki wydzieleniu logiki do hooków
 */
export const Dashboard = () => {
    const { excelData, hasData, error } = useExcelData();
    const navigate = useNavigate();

    // Logika filtrowania przeniesiona do custom hooka
    const {
        filters,
        filteredData,
        handleFiltersChange,
        filteredCount
    } = useDataFilters(excelData?.data);

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
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    📊 Dashboard Analiz Blokerów
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Analizuj dane z pliku: <strong>{excelData.fileName}</strong> ({excelData.totalRows} wierszy)
                </Typography>
            </Box>

            {/* Obsługa błędów */}
            {error && (
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

            {/* Filtry */}
            <DataFilters
                data={excelData.data}
                onFiltersChange={handleFiltersChange}
                selectedFilters={filters}
                filteredCount={filteredCount}
            />

            {/* Tabela danych - teraz używa nowego zrefaktorowanego komponentu */}
            <DynamicDataTable
                data={excelData.data}
                headers={excelData.headers}
                filteredData={filteredData}
            />


        </Box>
    );
};