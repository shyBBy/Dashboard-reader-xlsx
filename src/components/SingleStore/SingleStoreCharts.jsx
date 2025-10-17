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

        // Top blokery - ostatnie zamówienia
        const blokerLastOrderStats = storeData.reduce((acc, row) => {
            const bloker = row.BlockerName;
            const ostatnieZamLinii = parseInt(row.Bloker_ostatnie_zam) || 0;
            
            if (bloker && ostatnieZamLinii > 0) {
                if (!acc[bloker]) {
                    acc[bloker] = { name: bloker, totalLines: 0 };
                }
                acc[bloker].totalLines += ostatnieZamLinii;
            }
            return acc;
        }, {});

        const topBlokeryLastOrder = Object.values(blokerLastOrderStats)
            .sort((a, b) => b.totalLines - a.totalLines)
            .slice(0, 10);

        // Top blokery - następne zamówienia
        const blokerNextOrderStats = storeData.reduce((acc, row) => {
            const bloker = row.BlockerName;
            const najblizsze_zam_linii = parseInt(row.Bloker_najblizsze_zam) || 0;
            
            if (bloker && najblizsze_zam_linii > 0) {
                if (!acc[bloker]) {
                    acc[bloker] = { name: bloker, totalLines: 0 };
                }
                acc[bloker].totalLines += najblizsze_zam_linii;
            }
            return acc;
        }, {});

        const topBlokeryNextOrder = Object.values(blokerNextOrderStats)
            .sort((a, b) => b.totalLines - a.totalLines)
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
            topBlokeryLastOrder,
            topBlokeryNextOrder,
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
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2],
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center', mb: 2 }}>
                            🎯 Rozkład Wpływu
                        </Typography>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                width={350}
                                height={300}
                                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                slotProps={{
                                    legend: {
                                        direction: 'column',
                                        position: { vertical: 'middle', horizontal: 'right' },
                                        padding: 0,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* Wykres decyzji - Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Box 
                        sx={{ 
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2],
                            height: '400px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center', mb: 2 }}>
                            ✅ Rozkład Decyzji
                        </Typography>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                width={350}
                                height={300}
                                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                                slotProps={{
                                    legend: {
                                        direction: 'column',
                                        position: { vertical: 'middle', horizontal: 'right' },
                                        padding: 0,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* Top blokery - Responsywne wykresy */}
                <Grid item xs={12} lg={6}>
                    <Box 
                        sx={{ 
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2],
                            height: '450px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center', mb: 2 }}>
                            🚫 Top Blokery - Ostatnie Zamówienie
                        </Typography>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <BarChart
                                xAxis={[
                                    { 
                                        scaleType: 'band', 
                                        data: chartData.topBlokeryLastOrder.map(item => 
                                            item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name
                                        ),
                                        tickLabelStyle: {
                                            angle: -45,
                                            textAnchor: 'end',
                                            fontSize: 11,
                                            fill: theme.palette.text.primary
                                        }
                                    }
                                ]}
                                yAxis={[
                                    {
                                        tickLabelStyle: {
                                            fontSize: 11,
                                            fill: theme.palette.text.primary
                                        }
                                    }
                                ]}
                                series={[
                                    { 
                                        data: chartData.topBlokeryLastOrder.map(item => item.totalLines),
                                        color: theme.palette.error.main,
                                        label: 'Linii zablokowanych'
                                    }
                                ]}
                                width={450}
                                height={350}
                                margin={{ top: 40, right: 30, left: 70, bottom: 120 }}
                                tooltip={{
                                    trigger: 'item'
                                }}
                                slotProps={{
                                    legend: {
                                        hidden: true
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Box 
                        sx={{ 
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2],
                            height: '450px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center', mb: 2 }}>
                            📈 Top Blokery - Następne Zamówienie
                        </Typography>
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <BarChart
                                xAxis={[
                                    { 
                                        scaleType: 'band', 
                                        data: chartData.topBlokeryNextOrder.map(item => 
                                            item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name
                                        ),
                                        tickLabelStyle: {
                                            angle: -45,
                                            textAnchor: 'end',
                                            fontSize: 11,
                                            fill: theme.palette.text.primary
                                        }
                                    }
                                ]}
                                yAxis={[
                                    {
                                        tickLabelStyle: {
                                            fontSize: 11,
                                            fill: theme.palette.text.primary
                                        }
                                    }
                                ]}
                                series={[
                                    { 
                                        data: chartData.topBlokeryNextOrder.map(item => item.totalLines),
                                        color: theme.palette.warning.main,
                                        label: 'Linii prognozowanych'
                                    }
                                ]}
                                width={450}
                                height={350}
                                margin={{ top: 40, right: 30, left: 70, bottom: 120 }}
                                tooltip={{
                                    trigger: 'item'
                                }}
                                slotProps={{
                                    legend: {
                                        hidden: true
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>

                {/* Trend dostępności w czasie (jeśli są dane) */}  
                {chartData.dostepnoscTrendData.length > 1 && (
                    <Grid item xs={12}>
                        <Box 
                            sx={{ 
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: 'background.paper',
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: theme.shadows[2],
                                height: '500px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center', mb: 2 }}>
                                📊 Trend Dostępności w Czasie
                            </Typography>
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                <LineChart
                                    xAxis={[
                                        { 
                                            scaleType: 'band', 
                                            data: chartData.dostepnoscTrendData.map(item => item.date),
                                            tickLabelStyle: {
                                                fontSize: 11,
                                                fill: theme.palette.text.primary
                                            }
                                        }
                                    ]}
                                    yAxis={[
                                        { 
                                            min: 0,
                                            max: 100,
                                            label: 'Dostępność (%)',
                                            tickLabelStyle: {
                                                fontSize: 11,
                                                fill: theme.palette.text.primary
                                            }
                                        }
                                    ]}
                                    series={[
                                        {
                                            data: chartData.dostepnoscTrendData.map(item => item.dostepnosc),
                                            color: theme.palette.primary.main,
                                            curve: 'linear',
                                            label: 'Dostępność %'
                                        }
                                    ]}
                                    width={Math.min(1000, window.innerWidth - 100)}
                                    height={380}
                                    margin={{ top: 40, right: 40, left: 80, bottom: 80 }}
                                    tooltip={{
                                        trigger: 'item'
                                    }}
                                    slotProps={{
                                        legend: {
                                            direction: 'row',
                                            position: { vertical: 'top', horizontal: 'middle' },
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}