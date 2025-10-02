import React, { useMemo } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    List,
    ListItem,
    ListItemText,
    Chip,
    Avatar,
    Divider,
    Alert,
    Badge,
    LinearProgress
} from '@mui/material';
import { 
    Schedule, 
    DateRange,
    Block,
    TrendingUp,
    Warning,
    Info
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function NextOrderBlockers({ storeData, storeId }) {
    const theme = useTheme();

    const nextOrderData = useMemo(() => {
        if (!storeData || storeData.length === 0) return null;

        // Filtrujemy dane które mają informacje o następnym zamówieniu
        const nextOrderRecords = storeData.filter(row => 
            row.DATE_next_zam || row.BlockerName
        );

        if (nextOrderRecords.length === 0) return null;

        // Grupujemy blokery według nazwy i analizujemy Bloker_najblizsze_zam
        const blockerGroups = storeData.reduce((acc, row) => {
            const blokerName = row.BlockerName;
            const najblizsze_zam_linii = parseInt(row.Bloker_najblizsze_zam) || 0;
            const wplyw = row.Wplyw;
            const date = row.DATE_next_zam;
            const dostepnosc = row.DOSTEPNOSC_DROGERIA;
            const trend = row.Trend_analiza;
            const decyzja = row.Decyzja;
            
            if (blokerName && najblizsze_zam_linii > 0) {
                if (!acc[blokerName]) {
                    acc[blokerName] = {
                        name: blokerName,
                        totalLines: 0,
                        records: [],
                        wplyw: {},
                        dates: [],
                        dostepnosc: [],
                        trends: [],
                        decyzje: [],
                        priority: 0
                    };
                }
                
                // Dodajemy liczbę linii
                acc[blokerName].totalLines += najblizsze_zam_linii;
                acc[blokerName].records.push(row);
                
                if (wplyw) {
                    acc[blokerName].wplyw[wplyw] = (acc[blokerName].wplyw[wplyw] || 0) + 1;
                }
                
                if (date) {
                    acc[blokerName].dates.push(new Date(date));
                }
                
                if (dostepnosc !== undefined) {
                    const dostepnoscVal = typeof dostepnosc === 'string' ? 
                        parseFloat(dostepnosc.replace('%', '')) : 
                        parseFloat(dostepnosc) || 0;
                    acc[blokerName].dostepnosc.push(dostepnoscVal);
                }
                
                if (trend) {
                    acc[blokerName].trends.push(trend);
                }
                
                if (decyzja) {
                    acc[blokerName].decyzje.push(decyzja);
                }
            }
            
            return acc;
        }, {});

        // Obliczamy średnią liczbę linii na rekord
        Object.values(blockerGroups).forEach(bloker => {
            bloker.avgLines = Math.round(bloker.totalLines / bloker.records.length);
        });

        // Sortujemy według liczby linii (najważniejsze)
        const sortedBlockers = blockerGroups && Object.keys(blockerGroups).length > 0 ? 
            Object.values(blockerGroups).sort((a, b) => b.totalLines - a.totalLines) : 
            [];

        // Statystyki
        const totalNextOrderBlockers = Object.keys(blockerGroups).length;
        const totalNextOrderLines = sortedBlockers.length > 0 ? 
            sortedBlockers.reduce((sum, bloker) => sum + bloker.totalLines, 0) : 0;
        
        // Najbliższa data następnego zamówienia
        const allDates = nextOrderRecords
            .map(row => row.DATE_next_zam)
            .filter(Boolean)
            .map(date => new Date(date))
            .sort((a, b) => a - b);
        
        const nextOrderDate = allDates[0];
        
        // Blokery z rekomendacją
        const recommendedBlockers = sortedBlockers.filter(bloker => 
            bloker.decyzje.some(dec => dec === 'REKOMENDUJ')
        );
        
        // Blokery z trendem nasilającym
        const trendingUpBlockers = sortedBlockers.filter(bloker => 
            bloker.trends.some(trend => trend && trend.includes('NASILAJACY'))
        );

        return {
            blockerGroups,
            sortedBlockers,
            totalNextOrderBlockers,
            totalNextOrderLines,
            nextOrderDate,
            recommendedBlockers: recommendedBlockers.length,
            trendingUpBlockers: trendingUpBlockers.length
        };
    }, [storeData]);

    if (!nextOrderData) {
        return (
            <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Schedule sx={{ mr: 1, color: theme.palette.warning.main }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            🔮 Blokery - Następne Zamówienie
                        </Typography>
                    </Box>
                    <Alert severity="info" icon={<Info />}>
                        Brak danych o blokerach z następnego zamówienia
                    </Alert>
                </CardContent>
            </Card>
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

    const getWplywIcon = (wplyw) => {
        switch (wplyw) {
            case 'WYSOKI': return '🔴';
            case 'SREDNI': return '🟡';
            case 'NISKI': return '🔵';
            case 'ZEROWY': return '🟢';
            default: return '⚫';
        }
    };

    const hasRecommendation = (bloker) => {
        return bloker.decyzje.some(dec => dec === 'REKOMENDUJ');
    };

    const hasTrendingUp = (bloker) => {
        return bloker.trends.some(trend => trend && trend.includes('NASILAJACY'));
    };

    return (
        <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Schedule sx={{ mr: 2, color: theme.palette.warning.main, fontSize: 30 }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            🔮 Blokery - Następne Zamówienie
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {nextOrderData.totalNextOrderBlockers} różnych blokerów, {nextOrderData.totalNextOrderLines} linii całkowicie
                        </Typography>
                    </Box>
                </Box>

                {/* Informacje o następnym zamówieniu */}
                <Box sx={{ mb: 3 }}>
                    {nextOrderData.nextOrderDate && (
                        <Alert severity="warning" sx={{ mb: 2 }} icon={<DateRange />}>
                            <Typography variant="body2">
                                <strong>Następne zamówienie:</strong> {nextOrderData.nextOrderDate.toLocaleDateString('pl-PL')}
                            </Typography>
                        </Alert>
                    )}
                    
                    {/* Statystyki podsumowujące */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip 
                            label={`💡 Rekomendowanych: ${nextOrderData.recommendedBlockers}`}
                            color="success"
                            size="small"
                        />
                        <Chip 
                            label={`📈 Trend ↗: ${nextOrderData.trendingUpBlockers}`}
                            color="error"
                            size="small"
                        />
                    </Box>
                </Box>

                {/* Lista blokerów */}
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {nextOrderData.sortedBlockers && nextOrderData.sortedBlockers.length > 0 ? 
                        nextOrderData.sortedBlockers.map((bloker, index) => {
                        const dominantWplyw = Object.entries(bloker.wplyw)
                            .sort((a, b) => b[1] - a[1])[0];
                        
                        const avgDostepnoscBloker = bloker.dostepnosc.length > 0 ? 
                            (bloker.dostepnosc.reduce((sum, val) => sum + val, 0) / bloker.dostepnosc.length).toFixed(1) : null;
                        
                        const nextDate = bloker.dates.length > 0 ? 
                            bloker.dates.sort((a, b) => a - b)[0] : null;

                        const isRecommended = hasRecommendation(bloker);
                        const isTrendingUp = hasTrendingUp(bloker);

                        return (
                            <React.Fragment key={index}>
                                <ListItem sx={{ 
                                    backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                                    borderRadius: 1,
                                    mb: 1,
                                    border: isRecommended ? `2px solid ${theme.palette.success.main}40` : 
                                            isTrendingUp ? `2px solid ${theme.palette.error.main}40` : 'none'
                                }}>
                                    <Badge 
                                        badgeContent={bloker.totalLines} 
                                        color="primary"
                                        sx={{ mr: 2 }}
                                    >
                                        <Avatar sx={{ 
                                            backgroundColor: dominantWplyw ? getWplywColor(dominantWplyw[0]) + '20' : theme.palette.grey[200],
                                            color: dominantWplyw ? getWplywColor(dominantWplyw[0]) : theme.palette.grey[600],
                                            border: isRecommended ? `2px solid ${theme.palette.success.main}` : 
                                                   isTrendingUp ? `2px solid ${theme.palette.error.main}` : 'none'
                                        }}>
                                            {isTrendingUp ? <TrendingUp /> : <Block />}
                                        </Avatar>
                                    </Badge>
                                    
                                    <ListItemText
                                        primaryTypographyProps={{ component: 'div' }}
                                        secondaryTypographyProps={{ component: 'div' }}
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                    {bloker.name}
                                                </Typography>
                                                {isRecommended && (
                                                    <Chip 
                                                        label="💡 REKOMENDUJ" 
                                                        size="small" 
                                                        color="success"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                )}
                                                {isTrendingUp && (
                                                    <Chip 
                                                        label="📈 NASILAJĄCY" 
                                                        size="small" 
                                                        color="error"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                                    {dominantWplyw && (
                                                        <Chip 
                                                            label={`${getWplywIcon(dominantWplyw[0])} ${dominantWplyw[0]} (${dominantWplyw[1]})`}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getWplywColor(dominantWplyw[0]) + '20',
                                                                color: getWplywColor(dominantWplyw[0]),
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                    )}
                                                    
                                                    {avgDostepnoscBloker && (
                                                        <Chip 
                                                            label={`📦 ${avgDostepnoscBloker}%`}
                                                            size="small"
                                                            color={avgDostepnoscBloker >= 95 ? 'success' : avgDostepnoscBloker >= 90 ? 'warning' : 'error'}
                                                        />
                                                    )}
                                                </Box>
                                                
                                                <Typography variant="caption" color="text.secondary" component="span">
                                                    📊 {bloker.totalLines} linii (śr. {bloker.avgLines} na rekord)
                                                </Typography>
                                                
                                                {nextDate && (
                                                    <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 2 }}>
                                                        🔮 {nextDate.toLocaleDateString('pl-PL')}
                                                    </Typography>
                                                )}
                                                
                                                {/* Progress bar dla wpływu */}
                                                {dominantWplyw && dominantWplyw[0] === 'WYSOKI' && (
                                                    <Box sx={{ mt: 1 }}>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={100} 
                                                            sx={{
                                                                height: 4,
                                                                borderRadius: 2,
                                                                backgroundColor: theme.palette.error.light + '20',
                                                                '& .MuiLinearProgress-bar': {
                                                                    backgroundColor: theme.palette.error.main
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {nextOrderData.sortedBlockers && index < nextOrderData.sortedBlockers.length - 1 && <Divider />}
                            </React.Fragment>
                        );
                    }) : 
                        <ListItem>
                            <ListItemText
                                primaryTypographyProps={{ component: 'div' }}
                                primary={
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                                        Brak danych o blokerach dla następnych zamówień
                                    </Typography>
                                }
                            />
                        </ListItem>
                    }
                </List>

                {/* Podsumowanie */}
                {nextOrderData.sortedBlockers && nextOrderData.sortedBlockers.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.warning[50], borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                            🔮 <strong>Prognoza:</strong> {nextOrderData.recommendedBlockers} blokerów wymaga rekomendacji, 
                            {nextOrderData.trendingUpBlockers} ma trend nasilający. 
                            <strong>Priorytet:</strong> {nextOrderData.sortedBlockers[0]?.name}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}