import React, { useMemo } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
    Store,
    Warning,
    TrendingUp,
    Assessment,
    CheckCircle,
    Error,
    Info,
    Today,
    ShoppingCart
} from '@mui/icons-material';
import BlockIcon from '@mui/icons-material/Block';
import MainKPICard from '../../MainKPICard';
import { 
    calculateAllKPIMetrics, 
    formatDisplayValue, 
    calculatePercentage, 
    getAvailabilityCardType 
} from '../../../helpers/businessMetrics.helper';

export const KPICards = ({ data, filteredData }) => {
    const theme = useTheme();
    
    const metrics = useMemo(() => {
        const dataToAnalyze = filteredData || data;
        
        // Debug logging dla nowych kolumn (zachowuję na razie)
        if (dataToAnalyze && dataToAnalyze.length > 0) {
            console.log('🔍 DEBUG - Pierwszy wiersz (nowe kolumny):', {
                LICZBA_SKLEPOW_DZIS: dataToAnalyze[0].LICZBA_SKLEPOW_DZIS,
                SUMA_LINII_ZAM_DZIS: dataToAnalyze[0].SUMA_LINII_ZAM_DZIS,
                allKeys: Object.keys(dataToAnalyze[0])
            });
        }
        
        // Wykorzystaj helper do obliczenia wszystkich metryk jednym wywołaniem
        const calculatedMetrics = calculateAllKPIMetrics(dataToAnalyze);
        
        console.log('📊 KPI Values:', {
            storesWithOrderToday: calculatedMetrics.storesWithOrderToday,
            sumaLiniiToday: calculatedMetrics.sumaLiniiToday
        });

        return calculatedMetrics;
    }, [data, filteredData]);

    // Jeśli brak danych, pokaż komunikat
    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    Brak danych do wyświetlenia
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Wgraj plik Excel aby zobaczyć metryki
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 4 }}>

            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: 3
            }}>
                {/* Liczba sklepów */}
                <MainKPICard
                    title="Sklepy"
                    value={formatDisplayValue(metrics.totalStores)}
                    subtitle="Unikalne sklepy w danych"
                    icon={<Store />}
                    type="primary"
                />
        
                {/* Średnia dostępność */}
                <MainKPICard
                    title="Dostępność"
                    value={`${metrics.availabilityAvg.toFixed(2)}%`}
                    subtitle="Średnia dostępność w drogeriach"
                    icon={<Assessment />}
                    type={getAvailabilityCardType(metrics.availabilityAvg)}
                    progress={metrics.availabilityAvg}
                />


                {/* 🆕 Sklepy z zamówieniem dzisiaj */}
                <MainKPICard
                    title="Zamówienia dzisiaj"
                    value={formatDisplayValue(metrics.storesWithOrderToday)}
                    subtitle="Sklepy z ostatnim zam. dzisiaj"
                    icon={<Today />}
                    type="primary"
                    progress={calculatePercentage(metrics.storesWithOrderToday, metrics.totalStores)}
                />

                {/* 🆕 Suma linii dzisiaj */}
                <MainKPICard
                    title="Suma linii dzisiaj"
                    value={formatDisplayValue(metrics.sumaLiniiToday)}
                    subtitle="Łączna suma linii dla zamówień dzisiaj"
                    icon={<BlockIcon />}
                    type="error"
                />

            </Box>
        </Box>
    );
};