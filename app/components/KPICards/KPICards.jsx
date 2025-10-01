import React, { useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Stack
} from '@mui/material';
import {
    Store,
    Warning,
    TrendingUp,
    Assessment,
    CheckCircle,
    Error,
    Info
} from '@mui/icons-material';

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
                trendsCount: { nasilajacy: 0, malejacy: 0, stabilny: 0 }
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
        
        // Oblicz średnią dostępność (konwertuj procentowe stringi na liczby)
        const availabilityValues = dataToAnalyze
            .map(row => {
                const dostepnosc = row.DOSTEPNOSC_DROGERIA;
                if (typeof dostepnosc === 'string' && dostepnosc.includes('%')) {
                    return parseFloat(dostepnosc.replace('%', '').replace(',', '.'));
                }
                return parseFloat(dostepnosc) || 0;
            })
            .filter(val => !isNaN(val));
        
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

        return {
            totalStores: uniqueStores,
            totalBlockers,
            highImpactBlockers: highImpact,
            lowImpactBlockers: lowImpact,
            recomendedActions: recommended,
            availabilityAvg: Math.round(availabilityAvg * 100) / 100,
            trendsCount
        };
    }, [data, filteredData]);

    const KPICard = ({ title, value, subtitle, icon: Icon, color = 'primary', progress, trend }) => (
        <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h4" color={`${color}.main`} fontWeight="bold">
                            {value}
                        </Typography>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            {title}
                        </Typography>
                    </Box>
                    {Icon && (
                        <Icon sx={{ fontSize: 40, color: `${color}.main`, opacity: 0.7 }} />
                    )}
                </Stack>
                
                {subtitle && (
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        {subtitle}
                    </Typography>
                )}
                
                {progress !== undefined && (
                    <Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            color={color}
                            sx={{ mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {progress.toFixed(1)}%
                        </Typography>
                    </Box>
                )}
                
                {trend && (
                    <Chip 
                        label={trend}
                        size="small"
                        color={trend.includes('wzrost') ? 'success' : trend.includes('spadek') ? 'error' : 'default'}
                        sx={{ mt: 1 }}
                    />
                )}
            </CardContent>
        </Card>
    );

    if (!data || data.length === 0) {
        return (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    Brak danych do wyświetlenia
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Wgraj plik Excel aby zobaczyć metryki
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                📊 Kluczowe wskaźniki (KPI)
            </Typography>
            
            <Grid container spacing={3}>
                {/* Liczba sklepów */}
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Sklepy"
                        value={metrics.totalStores}
                        subtitle="Unikalne sklepy w danych"
                        icon={Store}
                        color="primary"
                    />
                </Grid>

                {/* Łączna liczba blockerów */}
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Blockery łącznie"
                        value={metrics.totalBlockers}
                        subtitle="Wszystkie zidentyfikowane problemy"
                        icon={Warning}
                        color="warning"
                    />
                </Grid>

                {/* Blockery wysokiej wagi */}
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Wysokie ryzyko"
                        value={metrics.highImpactBlockers}
                        subtitle="Blockery WYSOKIE i ŚREDNIE"
                        icon={Error}
                        color="error"
                        progress={metrics.totalBlockers > 0 ? (metrics.highImpactBlockers / metrics.totalBlockers) * 100 : 0}
                    />
                </Grid>

                {/* Rekomendowane akcje */}
                <Grid item xs={12} sm={6} md={3}>
                    <KPICard
                        title="Rekomendacje"
                        value={metrics.recomendedActions}
                        subtitle="Wymagające działania"
                        icon={CheckCircle}
                        color="success"
                        progress={metrics.totalBlockers > 0 ? (metrics.recomendedActions / metrics.totalBlockers) * 100 : 0}
                    />
                </Grid>

                {/* Średnia dostępność */}
                <Grid item xs={12} sm={6} md={4}>
                    <KPICard
                        title="Dostępność"
                        value={`${metrics.availabilityAvg}%`}
                        subtitle="Średnia dostępność w drogeriach"
                        icon={Assessment}
                        color={metrics.availabilityAvg >= 95 ? 'success' : metrics.availabilityAvg >= 90 ? 'warning' : 'error'}
                        progress={metrics.availabilityAvg}
                    />
                </Grid>

                {/* Trendy nasilające */}
                <Grid item xs={12} sm={6} md={4}>
                    <KPICard
                        title="Trendy nasilające"
                        value={metrics.trendsCount.nasilajacy}
                        subtitle="Problemy się pogłębiają"
                        icon={TrendingUp}
                        color="error"
                        progress={metrics.totalBlockers > 0 ? (metrics.trendsCount.nasilajacy / metrics.totalBlockers) * 100 : 0}
                    />
                </Grid>

                {/* Blockery niskiej wagi */}
                <Grid item xs={12} sm={6} md={4}>
                    <KPICard
                        title="Niskie ryzyko"
                        value={metrics.lowImpactBlockers}
                        subtitle="Blockery NISKIE i ZEROWE"
                        icon={Info}
                        color="info"
                        progress={metrics.totalBlockers > 0 ? (metrics.lowImpactBlockers / metrics.totalBlockers) * 100 : 0}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};