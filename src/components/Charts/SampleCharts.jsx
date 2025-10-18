import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    BarChart,
    LineChart,
    PieChart,
} from '@mui/x-charts';

export const SampleCharts = () => {
    const theme = useTheme();

    // Dane dla wykresów słupkowych - sprzedaż miesięczna
    const salesData = [
        { month: 'Sty', value: 45000 },
        { month: 'Lut', value: 52000 },
        { month: 'Mar', value: 48000 },
        { month: 'Kwi', value: 61000 },
        { month: 'Maj', value: 55000 },
        { month: 'Cze', value: 67000 },
    ];

    // Dane dla wykresu liniowego - ruch na stronie
    const trafficData = [
        { month: 'Sty', visitors: 1200, pageViews: 3400 },
        { month: 'Lut', visitors: 1800, pageViews: 4200 },
        { month: 'Mar', visitors: 1500, pageViews: 3800 },
        { month: 'Kwi', visitors: 2100, pageViews: 5100 },
        { month: 'Maj', visitors: 1900, pageViews: 4600 },
        { month: 'Cze', visitors: 2400, pageViews: 6200 },
    ];

    // Dane dla wykresu kołowego - kategorie produktów
    const categoryData = [
        { label: 'Elektronika', value: 35, color: '#EC3656FF' },
        { label: 'Odzież', value: 28, color: '#9c9c9c' },
        { label: 'Dom i Ogród', value: 20, color: '#BABABAFF' },
        { label: 'Sport', value: 17, color: '#242424FF' },
    ];

    return (
        <Stack spacing={4}>
            {/* Wykres słupkowy - Sprzedaż miesięczna */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    📊 Sprzedaż miesięczna (PLN)
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                    <BarChart
                        dataset={salesData}
                        xAxis={[{ 
                            scaleType: 'band', 
                            dataKey: 'month'
                        }]}
                        yAxis={[{}]}
                        series={[{
                            dataKey: 'value',
                            label: 'Sprzedaż',
                            color: theme.palette.primary.main,
                            valueFormatter: ({ value }) => `${value.toLocaleString('pl-PL')} zł`,
                        }]}
                        margin={{ left: 70, right: 30, top: 30, bottom: 60 }}
                        sx={{
                            '& .MuiChartsAxis-tickLabel': {
                                fill: `${theme.vars.palette.text.secondary} !important`
                            },
                            '& .MuiChartsAxis-label': {
                                fill: `${theme.vars.palette.text.secondary} !important`
                            },
                            '& .MuiChartsAxis-line': {
                                stroke: `${theme.vars.palette.divider} !important`
                            },
                            '& .MuiChartsAxis-tick': {
                                stroke: `${theme.vars.palette.divider} !important`
                            }
                        }}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'top', horizontal: 'center' },
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Wykres liniowy - Ruch na stronie */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    📈 Ruch na stronie internetowej
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                    <LineChart
                        dataset={trafficData}
                        xAxis={[{ 
                            scaleType: 'band', 
                            dataKey: 'month'
                        }]}
                        yAxis={[{}]}
                        series={[
                            {
                                dataKey: 'visitors',
                                label: 'Odwiedzający',
                                color: theme.palette.primary.main,
                                curve: 'monotone',
                                valueFormatter: ({ value }) => value.toLocaleString('pl-PL'),
                            },
                            {
                                dataKey: 'pageViews',
                                label: 'Wyświetlenia stron',
                                color: theme.palette.secondary.main,
                                curve: 'monotone',
                                valueFormatter: ({ value }) => value.toLocaleString('pl-PL'),
                            }
                        ]}
                        margin={{ left: 70, right: 30, top: 30, bottom: 60 }}
                        sx={{
                            '& .MuiChartsAxis-tickLabel': {
                                fill: `${theme.vars.palette.text.secondary} !important`
                            },
                            '& .MuiChartsAxis-label': {
                                fill: `${theme.vars.palette.text.secondary} !important`
                            },
                            '& .MuiChartsAxis-line': {
                                stroke: `${theme.vars.palette.divider} !important`
                            },
                            '& .MuiChartsAxis-tick': {
                                stroke: `${theme.vars.palette.divider} !important`
                            }
                        }}
                        slotProps={{
                            legend: {
                                direction: 'row',
                                position: { vertical: 'top', horizontal: 'center' },
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Wykres kołowy - Kategorie produktów */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    🥧 Rozkład sprzedaży wg kategorii produktów
                </Typography>
                <Box sx={{ width: '100%', height: 400, display: 'flex', justifyContent: 'center' }}>
                    <PieChart
                        series={[
                            {
                                data: categoryData.map((item) => ({
                                    id: item.label,
                                    value: item.value,
                                    label: item.label,
                                    color: item.color ?? theme.palette.primary.main,
                                })),
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: {
                                    innerRadius: 30,
                                    additionalRadius: -30,
                                    color: theme.vars.palette.grey[400],
                                },
                                valueFormatter: ({ value, label }) => `${label}: ${value}%`,
                                innerRadius: 40,
                                outerRadius: 100,
                            }
                        ]}
                        width={400}
                        height={300}
                        margin={{ right: 200 }}
                        slotProps={{
                            legend: {
                                direction: 'column',
                                position: { vertical: 'middle', horizontal: 'right' },
                                padding: 0,
                                itemGap: 8,
                            }
                        }}
                    />
                </Box>
            </Paper>
        </Stack>
    );
};