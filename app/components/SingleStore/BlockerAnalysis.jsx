import React, { useMemo } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Grid,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    LinearProgress
} from '@mui/material';
import { 
    Block, 
    TrendingUp, 
    TrendingDown,
    Assessment,
    Warning
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function BlockerAnalysis({ storeData, storeId }) {
    const theme = useTheme();

    const analysisData = useMemo(() => {
        if (!storeData || storeData.length === 0) return null;

        // Analiza wszystkich blokerów
        const allBlockers = storeData.reduce((acc, row) => {
            const bloker = row.BlockerName;
            const wplyw = row.Wplyw;
            const trend = row.Trend_analiza;
            
            if (bloker) {
                if (!acc[bloker]) {
                    acc[bloker] = {
                        name: bloker,
                        count: 0,
                        wplyw: {},
                        trend: {},
                        records: []
                    };
                }
                
                acc[bloker].count++;
                acc[bloker].records.push(row);
                
                // Liczymy wpływ
                if (wplyw) {
                    acc[bloker].wplyw[wplyw] = (acc[bloker].wplyw[wplyw] || 0) + 1;
                }
                
                // Liczymy trend
                if (trend) {
                    if (trend.includes('NASILAJACY')) {
                        acc[bloker].trend.nasilajacy = (acc[bloker].trend.nasilajacy || 0) + 1;
                    } else if (trend.includes('MALEJACY')) {
                        acc[bloker].trend.malejacy = (acc[bloker].trend.malejacy || 0) + 1;
                    }
                }
            }
            
            return acc;
        }, {});

        // Sortujemy blokery według częstości
        const sortedBlockers = Object.values(allBlockers)
            .sort((a, b) => b.count - a.count);

        // Statystyki ogólne
        const totalBlockers = Object.keys(allBlockers).length;
        
        // Obliczamy sumy linii z blokerów
        const totalLastOrderLines = storeData.reduce((sum, row) => {
            const lastOrderLines = parseInt(row.Bloker_ostatnie_zam) || 0;
            return sum + lastOrderLines;
        }, 0);
        
        const totalNextOrderLines = storeData.reduce((sum, row) => {
            const nextOrderLines = parseInt(row.Bloker_najblizsze_zam) || 0;
            return sum + nextOrderLines;
        }, 0);
        
        const totalLinesSum = totalLastOrderLines + totalNextOrderLines;
        
        // Najczęstszy bloker
        const topBlocker = sortedBlockers[0];
        
        // Najniebezpieczniejsze blokery (wysoki wpływ)
        const highImpactBlockers = sortedBlockers.filter(bloker => 
            bloker.wplyw.WYSOKI > 0
        );
        
        // Blokery z trendem nasilającym
        const trendingUpBlockers = sortedBlockers.filter(bloker => 
            bloker.trend.nasilajacy > 0
        );

        return {
            allBlockers,
            sortedBlockers,
            totalBlockers,
            totalLastOrderLines,
            totalNextOrderLines,
            totalLinesSum,
            topBlocker,
            highImpactBlockers,
            trendingUpBlockers
        };
    }, [storeData]);

    if (!analysisData) {
        return (
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Brak danych do analizy blokerów
                </Typography>
            </Box>
        );
    }

    const getWplywColor = (wplyw) => {
        switch (wplyw) {
            case 'WYSOKI': return theme.palette.error.main;
            case 'SREDNI': return theme.palette.warning.main;
            case 'NISKI': return theme.palette.info.main;
            case 'ZEROWY': return theme.palette.success.main;
            default: return theme.palette.grey[500];
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                🔍 Analiza Blokerów - Sklep {storeId}
            </Typography>

            {/* Statystyki ogólne */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Assessment sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                {analysisData.totalBlockers}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Różnych Blokerów
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Block sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                                {analysisData.totalLinesSum.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Łączna Suma Linii
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                Ostatnie: {analysisData.totalLastOrderLines.toLocaleString()} | Następne: {analysisData.totalNextOrderLines.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Warning sx={{ fontSize: 40, color: theme.palette.error.main, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                                {analysisData.highImpactBlockers.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Wysokiego Wpływu
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <TrendingUp sx={{ fontSize: 40, color: theme.palette.error.main, mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
                                {analysisData.trendingUpBlockers.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Trend Nasilający
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Najważniejsze alerty */}
            {analysisData.topBlocker && (
                <Alert 
                    severity="warning" 
                    sx={{ mb: 3 }}
                    icon={<Block />}
                >
                    <Typography variant="body1">
                        <strong>Najczęstszy bloker:</strong> {analysisData.topBlocker.name} 
                        ({analysisData.topBlocker.count} wystąpień - {((analysisData.topBlocker.count / analysisData.totalOccurrences) * 100).toFixed(1)}%)
                    </Typography>
                </Alert>
            )}

            {/* Tabela szczegółowa blokerów */}
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        📊 Szczegółowa Analiza Blokerów
                    </Typography>
                    
                    <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Bloker</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Wystąpienia</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>% Udziału</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Wpływ</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trend</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {analysisData.sortedBlockers.slice(0, 15).map((bloker, index) => {
                                    const percentage = ((bloker.count / analysisData.totalOccurrences) * 100).toFixed(1);
                                    const dominantWplyw = Object.entries(bloker.wplyw)
                                        .sort((a, b) => b[1] - a[1])[0];
                                    const hasNasilajacyTrend = bloker.trend.nasilajacy > 0;
                                    
                                    return (
                                        <TableRow key={index} hover>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                    {bloker.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {bloker.count}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {percentage}%
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={parseFloat(percentage)} 
                                                        sx={{ mt: 1, height: 4, borderRadius: 2 }}
                                                    />
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                {dominantWplyw && (
                                                    <Chip 
                                                        label={`${dominantWplyw[0]} (${dominantWplyw[1]})`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: getWplywColor(dominantWplyw[0]) + '20',
                                                            color: getWplywColor(dominantWplyw[0]),
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {hasNasilajacyTrend ? (
                                                    <Chip 
                                                        icon={<TrendingUp />}
                                                        label={`↗ ${bloker.trend.nasilajacy}`}
                                                        size="small"
                                                        color="error"
                                                    />
                                                ) : bloker.trend.malejacy > 0 ? (
                                                    <Chip 
                                                        icon={<TrendingDown />}
                                                        label={`↘ ${bloker.trend.malejacy}`}
                                                        size="small"
                                                        color="success"
                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {analysisData.sortedBlockers.length > 15 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                            Pokazano 15 z {analysisData.sortedBlockers.length} blokerów
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}