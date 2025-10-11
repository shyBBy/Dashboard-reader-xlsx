import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
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
import MainKPICard from '../../MainKPICard';

export const KPICards = ({ data, filteredData }) => {
    const metrics = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                totalStores: 0,
                totalBlockers: 0,
                highImpactBlockers: 0,
                lowImpactBlockers: 0,
                recomendedActions: 0,
                availabilityAvg: 0,
                trendsCount: { nasilajacy: 0, malejacy: 0, stabilny: 0 },
                storesWithOrderToday: 0,
                sumaLiniiToday: 0
            };
        }

        const dataToAnalyze = filteredData || data;
        
        const uniqueStores = new Set(dataToAnalyze.map(row => row.StoreId)).size;
        const totalBlockers = dataToAnalyze.length;
        
        const highImpact = dataToAnalyze.filter(row => 
            row.Wplyw === 'WYSOKI' || row.Wplyw === 'SREDNI'
        ).length;
        
        const lowImpact = dataToAnalyze.filter(row => 
            row.Wplyw === 'NISKI' || row.Wplyw === 'ZEROWY'
        ).length;
        
        const recommended = dataToAnalyze.filter(row => 
            row.Decyzja === 'REKOMENDUJ'
        ).length;
        
        // Oblicz średnią dostępność
        const availabilityValues = dataToAnalyze
            .map(row => {
                // Spróbuj obu wariantów nazwy kolumny (case-insensitive)
                const dostepnosc = row.Dostepnosc_drogeria || row.DOSTEPNOSC_DROGERIA || row.dostepnosc_drogeria;
                if (typeof dostepnosc === 'string') {
                    return parseFloat(dostepnosc.replace('%', '').replace(',', '.'));
                } else if (typeof dostepnosc === 'number') {
                    if (dostepnosc <= 1) {
                        return dostepnosc * 100; // Format dziesiętny (0.90 = 90%)
                    }
                    return dostepnosc; // Format procentowy (90)
                }
                return 0;
            })
            .filter(val => !isNaN(val) && val > 0);
        
        const availabilityAvg = availabilityValues.length > 0 
            ? availabilityValues.reduce((sum, val) => sum + val, 0) / availabilityValues.length 
            : 0;

        // Analiza trendów
        const trendsCount = dataToAnalyze.reduce((acc, row) => {
            const trend = row.Trend_analiza;
            if (trend && trend.includes('NASILAJACY')) acc.nasilajacy++;
            else if (trend && trend.includes('MALEJACY')) acc.malejacy++;
            else acc.stabilny++;
            return acc;
        }, { nasilajacy: 0, malejacy: 0, stabilny: 0 });

        // 📅 NOWE KPI: Wartości pre-obliczone w SAS (SUMA_LINII_ZAM_DZIS, LICZBA_SKLEPOW_DZIS)
        // Każdy wiersz ma tę samą wartość globalną, więc wystarczy pobrać z pierwszego wiersza
        
        // Debug - sprawdź co jest w pierwszym wierszu
        if (dataToAnalyze.length > 0) {
            console.log('🔍 DEBUG - Pierwszy wiersz (nowe kolumny):', {
                LICZBA_SKLEPOW_DZIS: dataToAnalyze[0].LICZBA_SKLEPOW_DZIS,
                SUMA_LINII_ZAM_DZIS: dataToAnalyze[0].SUMA_LINII_ZAM_DZIS,
                allKeys: Object.keys(dataToAnalyze[0])
            });
        }
        
        const storesWithOrderToday = dataToAnalyze.length > 0 
            ? parseInt(dataToAnalyze[0].LICZBA_SKLEPOW_DZIS) || 0 
            : 0;
        
        const sumaLiniiToday = dataToAnalyze.length > 0 
            ? parseInt(dataToAnalyze[0].SUMA_LINII_ZAM_DZIS) || 0 
            : 0;
        
        console.log('📊 KPI Values:', {
            storesWithOrderToday,
            sumaLiniiToday
        });

        return {
            totalStores: uniqueStores,
            totalBlockers,
            highImpactBlockers: highImpact,
            lowImpactBlockers: lowImpact,
            recomendedActions: recommended,
            availabilityAvg: Math.round(availabilityAvg * 100) / 100,
            trendsCount,
            // Nowe metryki
            storesWithOrderToday,
            sumaLiniiToday: Math.round(sumaLiniiToday)
        };
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
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    mb: 4, 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #6366f1, #06b6d4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                }}
            >
                📊 Kluczowe wskaźniki (KPI)
            </Typography>
            
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                justifyContent: 'space-between'
            }}>
                {/* Liczba sklepów */}
                <MainKPICard
                    title="Sklepy"
                    value={metrics.totalStores.toLocaleString()}
                    subtitle="Unikalne sklepy w danych"
                    icon={<Store />}
                    type="primary"
                />

                {/* Łączna liczba blockerów */}
                <MainKPICard
                    title="Blockery łącznie"
                    value={metrics.totalBlockers.toLocaleString()}
                    subtitle="Wszystkie zidentyfikowane problemy"
                    icon={<Warning />}
                    type="warning"
                />

                {/* Blockery wysokiej wagi */}
                <MainKPICard
                    title="Wysokie ryzyko"
                    value={metrics.highImpactBlockers.toLocaleString()}
                    subtitle="Blockery WYSOKIE i ŚREDNIE"
                    icon={<Error />}
                    type="error"
                    progress={metrics.totalBlockers > 0 ? (metrics.highImpactBlockers / metrics.totalBlockers) * 100 : 0}
                />

                {/* Rekomendowane akcje */}
                <MainKPICard
                    title="Rekomendacje"
                    value={metrics.recomendedActions.toLocaleString()}
                    subtitle="Wymagające działania"
                    icon={<CheckCircle />}
                    type="success"
                    progress={metrics.totalBlockers > 0 ? (metrics.recomendedActions / metrics.totalBlockers) * 100 : 0}
                />

                {/* Średnia dostępność */}
                <MainKPICard
                    title="Dostępność"
                    value={`${metrics.availabilityAvg.toFixed(2)}%`}
                    subtitle="Średnia dostępność w drogeriach"
                    icon={<Assessment />}
                    type={metrics.availabilityAvg >= 96.7 ? 'success' : metrics.availabilityAvg >= 92 ? 'info' : metrics.availabilityAvg >= 89 ? 'warning' : 'error'}
                    progress={metrics.availabilityAvg}
                />

                {/* Trendy nasilające */}
                <MainKPICard
                    title="Trendy nasilające"
                    value={metrics.trendsCount.nasilajacy.toLocaleString()}
                    subtitle="Problemy się pogłębiają"
                    icon={<TrendingUp />}
                    type="error"
                    progress={metrics.totalBlockers > 0 ? (metrics.trendsCount.nasilajacy / metrics.totalBlockers) * 100 : 0}
                />

                {/* 🆕 Sklepy z zamówieniem dzisiaj */}
                <MainKPICard
                    title="Zamówienia dzisiaj"
                    value={metrics.storesWithOrderToday.toLocaleString()}
                    subtitle="Sklepy z ostatnim zam. dzisiaj"
                    icon={<Today />}
                    type="primary"
                    progress={metrics.totalStores > 0 ? (metrics.storesWithOrderToday / metrics.totalStores) * 100 : 0}
                />

                {/* 🆕 Suma linii dzisiaj */}
                <MainKPICard
                    title="Suma linii dzisiaj"
                    value={metrics.sumaLiniiToday.toLocaleString()}
                    subtitle="Łączna suma linii dla zamówień dzisiaj"
                    icon={<ShoppingCart />}
                    type="success"
                />

                {/* Blockery niskiej wagi */}
                <MainKPICard
                    title="Niskie ryzyko"
                    value={metrics.lowImpactBlockers.toLocaleString()}
                    subtitle="Blockery NISKIE i ZEROWE"
                    icon={<Info />}
                    type="info"
                    progress={metrics.totalBlockers > 0 ? (metrics.lowImpactBlockers / metrics.totalBlockers) * 100 : 0}
                />
            </Box>
        </Box>
    );
};