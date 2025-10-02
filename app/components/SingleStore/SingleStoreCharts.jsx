import React, { useMemo } from 'react';
import { 
    Grid, 
    Typography, 
    Box
} from '@mui/material';
import {
    PieChart,
    BarChart,
    LineChart
} from '@mui/x-charts';
import { useTheme } from '@mui/material/styles';

export default function SingleStoreCharts({ storeData, storeId }) {
    const theme = useTheme();

    const chartData = useMemo(() => {
        if (!storeData || storeData.length === 0) return null;

        // Data dla wykres wpływu
        const wplywData = storeData.reduce((acc, row) => {
            const wplyw = row.Wplyw;
            if (wplyw) {
                acc[wplyw] = (acc[wplyw] || 0) + 1;
            }
            return acc;
        }, {});

        const wplywChartData = Object.entries(wplywData).map(([key, value]) => ({
            name: key,
            value: value,
            percentage: ((value / storeData.length) * 100).toFixed(1)
        }));

        // Data dla wykres dostępności w czasie (jeśli są daty)
        const dostepnoscTrendData = storeData
            .filter(row => row.DOSTEPNOSC_DROGERIA && row.DATE_last_zam)
            .map(row => ({
                date: new Date(row.DATE_last_zam).toLocaleDateString('pl-PL'),
                dostepnosc: parseFloat(row.DOSTEPNOSC_DROGERIA?.replace('%', '') || 0),
                bloker: row.BlockerName || 'Brak'
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Top blokery
        const blokerStats = storeData.reduce((acc, row) => {
            const bloker = row.BlockerName;
            if (bloker) {
                acc[bloker] = (acc[bloker] || 0) + 1;
            }
            return acc;
        }, {});

        const topBlokery = Object.entries(blokerStats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Analiza decyzji
        const decyzjaData = storeData.reduce((acc, row) => {
            const decyzja = row.Decyzja;
            if (decyzja === 'REKOMENDUJ') {
                acc.rekomenduj++;
            } else if (decyzja && decyzja.includes('BRAK AKCJI')) {
                acc.brakAkcji++;
            }
            return acc;
        }, { rekomenduj: 0, brakAkcji: 0 });

        const decyzjaChartData = [
            { name: 'Rekomenduj', value: decyzjaData.rekomenduj },
            { name: 'Brak Akcji', value: decyzjaData.brakAkcji }
        ];

        return {
            wplywChartData,
            dostepnoscTrendData,
            topBlokery,
            decyzjaChartData
        };
    }, [storeData]);

    if (!chartData) {
        return (
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Brak danych do wykresów
                </Typography>
            </Box>
        );
    }

    const colors = {
        WYSOKI: theme.palette.error.main,
        SREDNI: theme.palette.warning.main,
        NISKI: theme.palette.info.main,
        ZEROWY: theme.palette.success.main
    };

    const decyzjaColors = [theme.palette.success.main, theme.palette.error.main];

    return (
        <Box>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    mb: 4, 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #06b6d4, #8b5cf6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                }}
            >
                📈 Wykresy dla Sklepu {storeId}
            </Typography>
            
            <Grid container spacing={3}>
                {/* Wykres wpływu - Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Box 
                        sx={{ 
                            p: 3,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            height: '100%'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                            🎯 Rozkład Wpływu
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    data: chartData.wplywChartData.map((item, index) => ({
                                        id: index,
                                        value: item.value,
                                        label: `${item.name}: ${item.percentage}%`,
                                        color: colors[item.name] || theme.palette.grey[500]
                                    }))
                                }
                            ]}
                            width={400}
                            height={300}
                            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        />
                    </Box>
                </Grid>

                {/* Wykres decyzji - Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Box 
                        sx={{ 
                            p: 3,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            height: '100%'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                            ✅ Rozkład Decyzji
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    data: chartData.decyzjaChartData.map((item, index) => ({
                                        id: index,
                                        value: item.value,
                                        label: `${item.name}: ${item.value}`,
                                        color: decyzjaColors[index]
                                    }))
                                }
                            ]}
                            width={400}
                            height={300}
                            margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        />
                    </Box>
                </Grid>

                {/* Top blokery - Bar Chart */}
                <Grid item xs={12}>
                    <Box 
                        sx={{ 
                            p: 3,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            height: '100%'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                            🚫 Top 10 Blokerów
                        </Typography>
                        <BarChart
                            xAxis={[
                                { 
                                    scaleType: 'band', 
                                    data: chartData.topBlokery.map(item => item.name),
                                    tickLabelStyle: {
                                        angle: -45,
                                        textAnchor: 'end',
                                        fontSize: 12
                                    }
                                }
                            ]}
                            series={[
                                { 
                                    data: chartData.topBlokery.map(item => item.count),
                                    color: theme.palette.primary.main
                                }
                            ]}
                            width={800}
                            height={400}
                            margin={{ top: 20, right: 30, left: 60, bottom: 100 }}
                        />
                    </Box>
                </Grid>

                {/* Trend dostępności w czasie (jeśli są dane) */}  
                {chartData.dostepnoscTrendData.length > 1 && (
                    <Grid item xs={12}>
                        <Box 
                            sx={{ 
                                p: 3,
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                height: '100%'
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                                📊 Trend Dostępności w Czasie
                            </Typography>
                            <LineChart
                                xAxis={[
                                    { 
                                        scaleType: 'band', 
                                        data: chartData.dostepnoscTrendData.map(item => item.date)
                                    }
                                ]}
                                yAxis={[
                                    { 
                                        min: 0,
                                        max: 100,
                                        label: 'Dostępność (%)'
                                    }
                                ]}
                                series={[
                                    {
                                        data: chartData.dostepnoscTrendData.map(item => item.dostepnosc),
                                        color: theme.palette.primary.main,
                                        curve: 'linear'
                                    }
                                ]}
                                width={800}
                                height={400}
                                margin={{ top: 20, right: 30, left: 80, bottom: 60 }}
                            />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}