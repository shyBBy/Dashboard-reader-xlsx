import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Container, Typography, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router';
import { DataFilters } from '../DataFilters/DataFilters';
import { KPICards } from '../KPICards/KPICards';
import { DynamicDataTable } from '../DynamicDataTable/DynamicDataTableNew';
import { useExcelData } from '../../context/ExcelDataContext';

export const Dashboard = () => {
    const { excelData, hasData, error } = useExcelData();
    const [filters, setFilters] = useState({});
    const navigate = useNavigate();

    // Przekieruj na upload jeśli brak danych
    useEffect(() => {
        if (!hasData) {
            navigate('/upload');
        }
    }, [hasData, navigate]);

    // Funkcja filtrowania danych
    const filteredData = useMemo(() => {
        if (!excelData?.data) {
            return [];
        }

        // Jeśli nie ma żadnych filtrów, zwróć wszystkie dane
        const hasActiveFilters = Object.values(filters).some(value => 
            value !== null && value !== undefined && value !== '' && value !== 'all'
        );
        
        if (!hasActiveFilters) {
            return excelData.data;
        }

        console.log('🔍 Filtrowanie - Aktywne filtry:', filters); // Debug
        console.log('📊 Dane przed filtrowaniem:', excelData.data.length, 'wierszy'); // Debug

        const result = excelData.data.filter(row => {
            // Filtr wyszukiwania - jeśli to liczba, traktuj jako StoreId
            if (filters.search && filters.search.trim() !== '') {
                const searchTerm = filters.search.trim();
                
                // Jeśli wpisano samą liczbę, szukaj po StoreId
                if (/^\d+$/.test(searchTerm)) {
                    if (String(row.StoreId) !== searchTerm) {
                        return false;
                    }
                } else {
                    // Jeśli to tekst, szukaj we wszystkich kolumnach
                    const searchLower = searchTerm.toLowerCase();
                    const matches = Object.values(row).some(value => 
                        String(value || '').toLowerCase().includes(searchLower)
                    );
                    if (!matches) return false;
                }
            }

            // Filtr StoreId
            if (filters.storeId && filters.storeId !== 'all') {
                if (String(row.StoreId) !== String(filters.storeId)) {
                    return false;
                }
            }

            // Filtr BlockerName
            if (filters.blocker && filters.blocker !== 'all') {
                if (row.BlockerName !== filters.blocker) {
                    return false;
                }
            }

            // Filtr Wpływu
            if (filters.wplyw && filters.wplyw !== 'all') {
                if (row.Wplyw !== filters.wplyw) {
                    return false;
                }
            }

            // Filtr Rekomendacji
            if (filters.rekomendacja && filters.rekomendacja !== 'all') {
                if (row.Rekomendacja_dzialania !== filters.rekomendacja) {
                    return false;
                }
            }

            return true;
        });
        
        console.log('✅ Wynik filtrowania:', result.length, 'wierszy'); // Debug
        return result;
    }, [excelData, filters]);

    const handleFiltersChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    // Jeśli nie ma danych, przekieruj na upload (useEffect wyżej)
    if (!hasData) {
        return null; // Nie renderuj nic, useEffect przekieruje
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    📊 Dashboard Analiz Blokerów
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Analizuj dane z pliku: <strong>{excelData.fileName}</strong> ({excelData.totalRows} wierszy)
                </Typography>
            </Box>

            {/* Error handling */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* KPI Cards */}
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
                filteredCount={filteredData.length}
            />

            {/* Tabela danych */}
            <DynamicDataTable
                data={excelData.data}
                headers={excelData.headers}
                filteredData={filteredData}
            />

            {/* Info o filtrach */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2">
                    🔍 <strong>Pokazuję:</strong> {filteredData.length} z {excelData.data.length} rekordów
                </Typography>
            </Box>
        </Container>
    );
};