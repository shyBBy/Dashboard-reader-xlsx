import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Store, Assessment, Info, Today, ShoppingCart } from '@mui/icons-material';
import MainKPICard from '../../MainKPICard';
import { 
    calculateAllKPIMetrics, 
    formatDisplayValue, 
    getAvailabilityCardType 
} from '../../../helpers/businessMetrics.helper';

export const KPICards = ({ data, filteredData }) => {
    const baseMetrics = useMemo(() => calculateAllKPIMetrics(data), [data]);

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

    const buildTrend = (currentValue, baseValue) => {
        const base = baseValue ?? 0;
        const current = currentValue ?? 0;

        if (base === 0 && current === 0) {
            return { value: 0, status: 'neutral', label: 'brak zmian' };
        }

        const diff = current - base;
        const percentChange = base === 0 ? 0 : (diff / base) * 100;
        const status = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';

        return {
            value: Math.abs(percentChange).toFixed(1),
            suffix: '%',
            status,
        };
    };

    const buildSparkline = (baseValue, currentValue) => {
        const base = baseValue ?? 0;
        const current = currentValue ?? 0;

        if (base === 0 && current === 0) {
            return [0, 0, 0, 0, 0, 0, 0];
        }

        const steps = 6;
        const result = [];
        for (let i = 0; i <= steps; i += 1) {
            const progress = i / steps;
            const value = base + (current - base) * progress;
            result.push(Number(value.toFixed(2)));
        }
        return result;
    };

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
                    chartColor="primary"
                    trend={buildTrend(metrics.totalStores, baseMetrics.totalStores)}
                    chartData={buildSparkline(baseMetrics.totalStores, metrics.totalStores)}
                />
        
                {/* Średnia dostępność */}
                <MainKPICard
                    title="Dostępność"
                    value={`${metrics.availabilityAvg.toFixed(2)}%`}
                    subtitle="Średnia dostępność w drogeriach"
                    icon={<Assessment />}
                    type={getAvailabilityCardType(metrics.availabilityAvg)}
                    chartColor={getAvailabilityCardType(metrics.availabilityAvg)}
                    trend={buildTrend(metrics.availabilityAvg, baseMetrics.availabilityAvg)}
                    chartData={buildSparkline(baseMetrics.availabilityAvg, metrics.availabilityAvg)}
                />


                {/* 🆕 Sklepy z zamówieniem dzisiaj */}
                <MainKPICard
                    title="Zamówienia dzisiaj"
                    value={formatDisplayValue(metrics.storesWithOrderToday)}
                    subtitle="Sklepy z ostatnim zam. dzisiaj"
                    icon={<Today />}
                    type="primary"
                    chartColor="success"
                    trend={buildTrend(metrics.storesWithOrderToday, baseMetrics.storesWithOrderToday)}
                    chartData={buildSparkline(baseMetrics.storesWithOrderToday, metrics.storesWithOrderToday)}
                />

                {/* 🆕 Suma linii dzisiaj */}
                <MainKPICard
                    title="Suma linii dzisiaj"
                    value={formatDisplayValue(metrics.sumaLiniiToday)}
                    subtitle="Łączna suma linii dla zamówień dzisiaj"
                    icon={<ShoppingCart />}
                    type="error"
                    chartColor="warning"
                    trend={buildTrend(metrics.sumaLiniiToday, baseMetrics.sumaLiniiToday)}
                    chartData={buildSparkline(baseMetrics.sumaLiniiToday, metrics.sumaLiniiToday)}
                />

            </Box>
        </Box>
    );
};