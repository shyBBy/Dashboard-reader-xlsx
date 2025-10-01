import React, { useMemo } from 'react';
import { 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Chip,
    useTheme,
    LinearProgress
} from '@mui/material';
import { 
    Store, 
    TrendingUp, 
    Warning, 
    CheckCircle, 
    Block,
    Assessment,
    LocalShipping,
    Inventory
} from '@mui/icons-material';

export default function SingleStoreKPICards({ storeData, storeId }) {
    const theme = useTheme();

    const kpiData = useMemo(() => {
        if (!storeData || storeData.length === 0) return null;

        // Podstawowe statystyki
        const totalRecords = storeData.length;
        
        // Analiza wpływu
        const wplywStats = storeData.reduce((acc, row) => {
            const wplyw = row.Wplyw;
            if (wplyw === 'WYSOKI') acc.wysoki++;
            else if (wplyw === 'SREDNI') acc.sredni++;
            else if (wplyw === 'NISKI') acc.niski++;
            else if (wplyw === 'ZEROWY') acc.zerowy++;
            return acc;
        }, { wysoki: 0, sredni: 0, niski: 0, zerowy: 0 });

        // Analiza decyzji
        const decyzjaStats = storeData.reduce((acc, row) => {
            const decyzja = row.Decyzja;
            if (decyzja === 'REKOMENDUJ') acc.rekomenduj++;
            else if (decyzja && decyzja.includes('BRAK AKCJI')) acc.brakAkcji++;
            return acc;
        }, { rekomenduj: 0, brakAkcji: 0 });

        // Analiza dostępności
        const dostepnoscStats = storeData.reduce((acc, row) => {
            const dostepnosc = parseFloat(row.DOSTEPNOSC_DROGERIA?.replace('%', '') || 0);
            acc.total += dostepnosc;
            acc.count++;
            if (dostepnosc >= 95) acc.excellent++;
            else if (dostepnosc >= 90) acc.good++;
            else acc.poor++;
            return acc;
        }, { total: 0, count: 0, excellent: 0, good: 0, poor: 0 });

        const avgDostepnosc = dostepnoscStats.count > 0 ? 
            (dostepnoscStats.total / dostepnoscStats.count).toFixed(1) : 0;

        // Analiza blokerów
        const uniqueBlockers = [...new Set(storeData.map(row => row.BlockerName).filter(Boolean))];
        
        // Trend analiza
        const trendStats = storeData.reduce((acc, row) => {
            const trend = row.Trend_analiza;
            if (trend && trend.includes('NASILAJACY')) acc.nasilajacy++;
            else if (trend && trend.includes('MALEJACY')) acc.malejacy++;
            return acc;
        }, { nasilajacy: 0, malejacy: 0 });

        return {
            totalRecords,
            wplywStats,
            decyzjaStats,
            dostepnoscStats,
            avgDostepnosc,
            uniqueBlockers: uniqueBlockers.length,
            trendStats
        };
    }, [storeData]);

    if (!kpiData) {
        return (
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Brak danych KPI
                </Typography>
            </Box>
        );
    }

    const kpiCards = [
        {
            title: 'Wszystkie Rekordy',
            value: kpiData.totalRecords,
            icon: <Assessment />,
            color: theme.palette.primary.main,
            bgColor: theme.palette.primary.light + '20'
        },
        {
            title: 'Średnia Dostępność',
            value: `${kpiData.avgDostepnosc}%`,
            icon: <Inventory />,
            color: kpiData.avgDostepnosc >= 95 ? theme.palette.success.main : 
                   kpiData.avgDostepnosc >= 90 ? theme.palette.warning.main : 
                   theme.palette.error.main,
            bgColor: kpiData.avgDostepnosc >= 95 ? theme.palette.success.light + '20' : 
                     kpiData.avgDostepnosc >= 90 ? theme.palette.warning.light + '20' : 
                     theme.palette.error.light + '20',
            progress: parseFloat(kpiData.avgDostepnosc)
        },
        {
            title: 'Wysoki Wpływ',
            value: kpiData.wplywStats.wysoki,
            icon: <Warning />,
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light + '20',
            subtitle: `z ${kpiData.totalRecords} rekordów`
        },
        {
            title: 'Rekomendacje',
            value: kpiData.decyzjaStats.rekomenduj,
            icon: <CheckCircle />,
            color: theme.palette.success.main,
            bgColor: theme.palette.success.light + '20',
            subtitle: `${((kpiData.decyzjaStats.rekomenduj / kpiData.totalRecords) * 100).toFixed(1)}%`
        },
        {
            title: 'Unique Blokery',
            value: kpiData.uniqueBlockers,
            icon: <Block />,
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light + '20',
            subtitle: 'różnych powodów'
        },
        {
            title: 'Trend Nasilający',
            value: kpiData.trendStats.nasilajacy,
            icon: <TrendingUp />,
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light + '20',
            subtitle: 'problemów rośnie'
        }
    ];

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                📊 KPI Sklepu {storeId}
            </Typography>
            
            <Grid container spacing={3}>
                {kpiCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                        <Card 
                            elevation={3}
                            sx={{ 
                                height: '100%',
                                background: `linear-gradient(135deg, ${card.bgColor}, rgba(255,255,255,0.9))`,
                                border: `2px solid ${card.color}20`,
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[8],
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box 
                                        sx={{ 
                                            p: 1.5, 
                                            borderRadius: 2, 
                                            backgroundColor: card.color + '20',
                                            color: card.color,
                                            mr: 2
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ fontWeight: 'medium' }}
                                    >
                                        {card.title}
                                    </Typography>
                                </Box>
                                
                                <Typography 
                                    variant="h4" 
                                    component="div" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: card.color,
                                        mb: 1
                                    }}
                                >
                                    {card.value}
                                </Typography>
                                
                                {card.subtitle && (
                                    <Typography variant="body2" color="text.secondary">
                                        {card.subtitle}
                                    </Typography>
                                )}
                                
                                {card.progress !== undefined && (
                                    <Box sx={{ mt: 2 }}>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={Math.min(card.progress, 100)} 
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: card.color + '20',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: card.color
                                                }
                                            }}
                                        />
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dodatkowe szczegółowe statystyki */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            📈 Rozkład Wpływu
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                label={`Wysoki: ${kpiData.wplywStats.wysoki}`} 
                                color="error" 
                                size="small" 
                            />
                            <Chip 
                                label={`Średni: ${kpiData.wplywStats.sredni}`} 
                                color="warning" 
                                size="small" 
                            />
                            <Chip 
                                label={`Niski: ${kpiData.wplywStats.niski}`} 
                                color="info" 
                                size="small" 
                            />
                            <Chip 
                                label={`Zerowy: ${kpiData.wplywStats.zerowy}`} 
                                color="success" 
                                size="small" 
                            />
                        </Box>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            🎯 Jakość Dostępności
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip 
                                label={`Doskonała (≥95%): ${kpiData.dostepnoscStats.excellent}`} 
                                color="success" 
                                size="small" 
                            />
                            <Chip 
                                label={`Dobra (90-94%): ${kpiData.dostepnoscStats.good}`} 
                                color="warning" 
                                size="small" 
                            />
                            <Chip 
                                label={`Słaba (<90%): ${kpiData.dostepnoscStats.poor}`} 
                                color="error" 
                                size="small" 
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}