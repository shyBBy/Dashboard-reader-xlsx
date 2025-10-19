import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Alert, Divider, CircularProgress } from '@mui/material';
import { Warning, Store, Assessment, Today, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DataFilters } from './DataFilters/DataFilters';
import { DynamicDataTable } from './DynamicDataTable/DynamicDataTable';
import { DetailedViewToggle } from './DetailedViewToggle/DetailedViewToggle';
import { useApiData } from '../../context/ApiDataContext';
import { useDataFilters } from '../../hooks/useDataFilters.hook';
import { getVisibleHeaders, getColumnStats } from '../../helpers/columnVisibility.helper';
import ErrorCard from '../ErrorCard';
import MetricsSection from '../Metrics/MetricsSection';
import {
    calculateAllKPIMetrics,
    formatDisplayValue,
    getAvailabilityCardType
} from '../../helpers/businessMetrics.helper';

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

    const dashboardMetricItems = useMemo(() => {
        if (!excelData?.data || excelData.data.length === 0) {
            return [];
        }

        const baseMetrics = calculateAllKPIMetrics(excelData.data);
        const scopedDataset = Array.isArray(filteredData) && filteredData.length > 0 ? filteredData : excelData.data;
        const scopedMetrics = calculateAllKPIMetrics(scopedDataset);

        const buildPercentageTrend = (currentValue, baseValue, label = 'vs całość') => {
            const base = Number(baseValue) || 0;
            const current = Number(currentValue) || 0;

            if (!base && !current) {
                return { direction: 'neutral', value: '0.0', suffix: '%', label };
            }

            if (!base) {
                const direction = current >= 0 ? 'up' : 'down';
                return {
                    direction,
                    prefix: current >= 0 ? '+' : '-',
                    value: Math.abs(current).toLocaleString('pl-PL'),
                    suffix: '',
                    label: 'nowa wartość',
                };
            }

            const diff = current - base;
            const percentChange = (diff / base) * 100;
            const direction = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral';
            return {
                direction,
                prefix: percentChange > 0 ? '+' : percentChange < 0 ? '-' : '',
                value: Math.abs(percentChange).toFixed(1),
                suffix: '%',
                label,
            };
        };

        const buildDeltaTrend = (currentValue, baseValue, { label = 'vs całość', suffix = ' p.p.' } = {}) => {
            const base = Number(baseValue) || 0;
            const current = Number(currentValue) || 0;
            const diff = current - base;
            const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
            return {
                direction,
                prefix: diff > 0 ? '+' : diff < 0 ? '-' : '',
                value: Math.abs(diff).toFixed(1),
                suffix,
                label,
            };
        };

        const buildSparkline = (startValue, endValue) => {
            const start = Number(startValue) || 0;
            const end = Number(endValue) || 0;
            if (!start && !end) {
                return [0, 0, 0, 0, 0, 0, 0];
            }
            const steps = 6;
            return Array.from({ length: steps + 1 }, (_, index) => {
                const progress = index / steps;
                return Number((start + (end - start) * progress).toFixed(2));
            });
        };

        const availabilityIntent = getAvailabilityCardType(scopedMetrics.availabilityAvg);

        return [
            {
                id: 'dashboard-total-stores',
                overline: 'Sklepy',
                title: 'Sklepy w danych',
                value: formatDisplayValue(scopedMetrics.totalStores),
                helperText: 'unikalne sklepy w zestawie',
                icon: <Store fontSize="inherit" />,
                intent: 'primary',
                trend: buildPercentageTrend(scopedMetrics.totalStores, baseMetrics.totalStores),
                sparkline: { data: buildSparkline(baseMetrics.totalStores, scopedMetrics.totalStores), color: 'primary' },
            },
            {
                id: 'dashboard-availability',
                overline: 'Dostępność',
                title: 'Średnia dostępność',
                value: `${Number(scopedMetrics.availabilityAvg || 0).toFixed(2)}%`,
                helperText: 'średnia dostępność w drogeriach',
                icon: <Assessment fontSize="inherit" />,
                intent: availabilityIntent,
                trend: buildDeltaTrend(scopedMetrics.availabilityAvg, baseMetrics.availabilityAvg, { label: 'vs całość', suffix: ' p.p.' }),
                sparkline: { data: buildSparkline(baseMetrics.availabilityAvg, scopedMetrics.availabilityAvg), color: availabilityIntent },
            },
            {
                id: 'dashboard-orders-today',
                overline: 'Zamówienia',
                title: 'Zamówienia dzisiaj',
                value: formatDisplayValue(scopedMetrics.storesWithOrderToday),
                helperText: 'sklepy z zamówieniem dzisiaj',
                icon: <Today fontSize="inherit" />,
                intent: 'success',
                trend: buildPercentageTrend(scopedMetrics.storesWithOrderToday, baseMetrics.storesWithOrderToday),
                sparkline: { data: buildSparkline(baseMetrics.storesWithOrderToday, scopedMetrics.storesWithOrderToday), color: 'success' },
            },
            {
                id: 'dashboard-lines-today',
                overline: 'Linie',
                title: 'Suma linii dzisiaj',
                value: formatDisplayValue(scopedMetrics.sumaLiniiToday),
                helperText: 'łączna liczba linii zamówień dzisiaj',
                icon: <ShoppingCart fontSize="inherit" />,
                intent: 'warning',
                trend: buildPercentageTrend(scopedMetrics.sumaLiniiToday, baseMetrics.sumaLiniiToday),
                sparkline: { data: buildSparkline(baseMetrics.sumaLiniiToday, scopedMetrics.sumaLiniiToday), color: 'warning' },
            },
        ];
    }, [excelData?.data, filteredData]);

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
            <ErrorCard
                title="Błąd połączenia z API"
                message={error || 'Nie można połączyć się z serwerem Python FastAPI. Sprawdź czy backend działa poprawnie.'}
                type="error"
                onRetry={() => window.location.reload()}
            />
        );
    }

    // Jeśli nie ma danych ale API działa
    if (!hasData) {
        return (
            <ErrorCard
                title="Brak danych"
                message="API działa poprawnie, ale nie zwróciło żadnych danych o blokerach. Sprawdź czy baza danych zawiera dane."
                type="warning"
                icon={Warning}
                onRetry={() => window.location.reload()}
            />
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

            {dashboardMetricItems.length > 0 && (
                <MetricsSection
                    title="Kluczowe metryki"
                    subtitle={excelData?.fileName ? `Źródło: ${excelData.fileName}` : undefined}
                    items={dashboardMetricItems}
                    minCardWidth={260}
                />
            )}

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