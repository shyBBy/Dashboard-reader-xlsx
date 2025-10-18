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
import useMediaQuery from '@mui/material/useMediaQuery';

export default function SingleStoreCharts({ storeData, storeId }) {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

    const chartData = useMemo(() => {
        if (!storeData || storeData.length === 0) return null;

        // Dane dla wykresu wpływu
        const wplywData = storeData.reduce((acc, row) => {
            const wplyw = row.Wplyw;
            if (wplyw) acc[wplyw] = (acc[wplyw] || 0) + 1;
            return acc;
        }, {});
        const wplywChartData = Object.entries(wplywData).map(([key, value]) => ({
            name: key,
            value: value,
            percentage: ((value / storeData.length) * 100).toFixed(1)
        }));

        // Dane trendu dostępności
        const dostepnoscTrendData = storeData
            .filter(row => row.DOSTEPNOSC_DROGERIA && row.DATE_last_zam)
            .map(row => ({
                date: new Date(row.DATE_last_zam).toLocaleDateString('pl-PL'),
                dostepnosc: parseFloat(row.DOSTEPNOSC_DROGERIA?.replace('%', '') || 0),
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Top blokery – ostatnie zamówienie
        const blokerLastOrderStats = storeData.reduce((acc, row) => {
            const bloker = row.BlockerName;
            const val = parseInt(row.Bloker_ostatnie_zam) || 0;
            if (bloker && val > 0) acc[bloker] = (acc[bloker] || 0) + val;
            return acc;
        }, {});
        const topBlokeryLastOrder = Object.entries(blokerLastOrderStats)
            .map(([name, totalLines]) => ({ name, totalLines }))
            .sort((a, b) => b.totalLines - a.totalLines)
            .slice(0, 10);

        // Top blokery – następne zamówienie
        const blokerNextOrderStats = storeData.reduce((acc, row) => {
            const bloker = row.BlockerName;
            const val = parseInt(row.Bloker_najblizsze_zam) || 0;
            if (bloker && val > 0) acc[bloker] = (acc[bloker] || 0) + val;
            return acc;
        }, {});
        const topBlokeryNextOrder = Object.entries(blokerNextOrderStats)
            .map(([name, totalLines]) => ({ name, totalLines }))
            .sort((a, b) => b.totalLines - a.totalLines)
            .slice(0, 10);

        // Dane decyzji
        const decyzjaData = storeData.reduce((acc, row) => {
            const decyzja = row.Decyzja;
            if (decyzja === 'REKOMENDUJ') acc.rekomenduj++;
            else if (decyzja?.includes('BRAK AKCJI')) acc.brakAkcji++;
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

    // Kolory z theme
    const colors = {
        WYSOKI: theme.palette.error.main,
        SREDNI: theme.palette.warning.main,
        NISKI: theme.palette.info.main,
        ZEROWY: theme.palette.success.main
    };

    const decyzjaColors = [theme.palette.success.main, theme.palette.error.main];

    const barChartWidth = isSmDown ? 320 : isMdDown ? 380 : 450;
    const lineChartWidth = isSmDown ? 320 : isMdDown ? 600 : 920;

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
                {/* Wpływ */}
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
                        <Typography variant="h6" textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                            🎯 Rozkład Wpływu
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    data: chartData.wplywChartData.map((item, i) => ({
                                        id: i,
                                        value: Number(item.value),
                                        label: item.name,
                                        color: colors[item.name] || theme.palette.grey[400]
                                    })),
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: {
                                        innerRadius: 30,
                                        additionalRadius: -30,
                                        color: theme.vars.palette.grey[400],
                                    },
                                    innerRadius: 40,
                                    outerRadius: 100,
                                    valueFormatter: ({ value, label }) => `${label}: ${value} (${chartData.wplywChartData.find((d) => d.name === label)?.percentage ?? 0}%)`,
                                }
                            ]}
                            width={isSmDown ? 280 : 360}
                            height={300}
                        />
                    </Box>
                </Grid>

                {/* Decyzje */}
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
                        <Typography variant="h6" textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                            ✅ Rozkład Decyzji
                        </Typography>
                        <PieChart
                            series={[
                                {
                                    data: chartData.decyzjaChartData.map((item, i) => ({
                                        id: i,
                                        value: Number(item.value),
                                        label: item.name,
                                        color: decyzjaColors[i] || theme.palette.primary.main,
                                    })),
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: {
                                        innerRadius: 30,
                                        additionalRadius: -30,
                                        color: theme.vars.palette.grey[400],
                                    },
                                    innerRadius: 40,
                                    outerRadius: 100,
                                    valueFormatter: ({ value, label }) => `${label}: ${value}`,
                                }
                            ]}
                            width={isSmDown ? 280 : 360}
                            height={300}
                        />
                    </Box>
                </Grid>

                {/* Top blokery */}
                <Grid item xs={12} lg={6}>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[2],
                            height: '450px'
                        }}
                    >
                        <Typography variant="h6" textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                            🚫 Top Blokery – Ostatnie Zamówienie
                        </Typography>
                        <BarChart
                            dataset={chartData.topBlokeryLastOrder}
                            xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                            series={[{
                                dataKey: 'totalLines',
                                color: theme.palette.error.main,
                                label: 'Łączna liczba linii',
                                valueFormatter: ({ value }) => value.toLocaleString('pl-PL'),
                            }]}
                            slotProps={{ legend: { hidden: true } }}
                            margin={{ left: 60, right: 20, top: 20, bottom: 70 }}
                            width={barChartWidth}
                            height={350}
                        />
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
                            height: '450px'
                        }}
                    >
                        <Typography variant="h6" textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                            📈 Top Blokery – Następne Zamówienie
                        </Typography>
                        <BarChart
                            dataset={chartData.topBlokeryNextOrder}
                            xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                            series={[{
                                dataKey: 'totalLines',
                                color: theme.palette.warning.main,
                                label: 'Łączna liczba linii',
                                valueFormatter: ({ value }) => value.toLocaleString('pl-PL'),
                            }]}
                            slotProps={{ legend: { hidden: true } }}
                            margin={{ left: 60, right: 20, top: 20, bottom: 70 }}
                            width={barChartWidth}
                            height={350}
                        />
                    </Box>
                </Grid>

                {/* Trend dostępności */}
                {chartData.dostepnoscTrendData.length > 1 && (
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                backgroundColor: 'background.paper',
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: theme.shadows[2],
                                height: '500px'
                            }}
                        >
                            <Typography variant="h6" textAlign="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                                📊 Trend Dostępności w Czasie
                            </Typography>
                            <LineChart
                                dataset={chartData.dostepnoscTrendData}
                                xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
                                series={[
                                    {
                                        dataKey: 'dostepnosc',
                                        color: theme.palette.primary.main,
                                        label: 'Dostępność %',
                                        curve: 'monotone',
                                        valueFormatter: ({ value }) => `${value.toFixed(1)}%`,
                                    }
                                ]}
                                width={lineChartWidth}
                                height={380}
                                margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
                                slotProps={{
                                    legend: {
                                        direction: 'row',
                                        position: { vertical: 'top', horizontal: 'center' },
                                    },
                                }}
                            />
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
