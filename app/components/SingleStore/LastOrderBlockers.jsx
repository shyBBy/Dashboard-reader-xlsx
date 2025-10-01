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
    Badge
} from '@mui/material';
import { 
    LocalShipping, 
    DateRange,
    Block,
    TrendingUp,
    Warning,
    Info
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function LastOrderBlockers({ storeData, storeId }) {
    const theme = useTheme();

    const lastOrderData = useMemo(() => {
        if (!storeData || storeData.length === 0) return null;

        // Filtrujemy dane które mają informacje o ostatnim zamówieniu
        const lastOrderRecords = storeData.filter(row => 
            row.DATE_last_zam || row.BlockerName
        );

        if (lastOrderRecords.length === 0) return null;

        // Grupujemy blokery według nazwy dla ostatniego zamówienia
        const blockerGroups = lastOrderRecords.reduce((acc, row) => {
            const bloker = row.BlockerName;
            const wplyw = row.Wplyw;
            const date = row.DATE_last_zam;
            const dostepnosc = row.DOSTEPNOSC_DROGERIA;
            
            if (bloker) {
                if (!acc[bloker]) {
                    acc[bloker] = {
                        name: bloker,
                        count: 0,
                        records: [],
                        wplyw: {},
                        dates: [],
                        dostepnosc: []
                    };
                }
                
                acc[bloker].count++;
                acc[bloker].records.push(row);
                
                if (wplyw) {
                    acc[bloker].wplyw[wplyw] = (acc[bloker].wplyw[wplyw] || 0) + 1;
                }
                
                if (date) {
                    acc[bloker].dates.push(new Date(date));
                }
                
                if (dostepnosc) {
                    acc[bloker].dostepnosc.push(parseFloat(dostepnosc.replace('%', '')));
                }
            }
            
            return acc;
        }, {});

        // Sortujemy według częstości wystąpień
        const sortedBlockers = Object.values(blockerGroups)
            .sort((a, b) => b.count - a.count);

        // Statystyki
        const totalLastOrderBlockers = Object.keys(blockerGroups).length;
        const totalLastOrderOccurrences = lastOrderRecords.length;
        
        // Najnowsza data ostatniego zamówienia
        const allDates = lastOrderRecords
            .map(row => row.DATE_last_zam)
            .filter(Boolean)
            .map(date => new Date(date))
            .sort((a, b) => b - a);
        
        const latestOrderDate = allDates[0];
        
        // Średnia dostępność dla ostatnich zamówień
        const avgDostepnosc = lastOrderRecords
            .map(row => parseFloat(row.DOSTEPNOSC_DROGERIA?.replace('%', '') || 0))
            .filter(val => val > 0)
            .reduce((sum, val, _, arr) => sum + val / arr.length, 0);

        return {
            blockerGroups,
            sortedBlockers,
            totalLastOrderBlockers,
            totalLastOrderOccurrences,
            latestOrderDate,
            avgDostepnosc: avgDostepnosc.toFixed(1)
        };
    }, [storeData]);

    if (!lastOrderData) {
        return (
            <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocalShipping sx={{ mr: 1, color: theme.palette.info.main }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            📦 Blokery - Ostatnie Zamówienie
                        </Typography>
                    </Box>
                    <Alert severity="info" icon={<Info />}>
                        Brak danych o blokerach z ostatniego zamówienia
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

    return (
        <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocalShipping sx={{ mr: 2, color: theme.palette.info.main, fontSize: 30 }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            📦 Blokery - Ostatnie Zamówienie
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {lastOrderData.totalLastOrderBlockers} różnych blokerów, {lastOrderData.totalLastOrderOccurrences} wystąpień
                        </Typography>
                    </Box>
                </Box>

                {/* Informacje o ostatnim zamówieniu */}
                {lastOrderData.latestOrderDate && (
                    <Alert severity="info" sx={{ mb: 3 }} icon={<DateRange />}>
                        <Typography variant="body2">
                            <strong>Ostatnie zamówienie:</strong> {lastOrderData.latestOrderDate.toLocaleDateString('pl-PL')}
                            {lastOrderData.avgDostepnosc > 0 && (
                                <> • <strong>Średnia dostępność:</strong> {lastOrderData.avgDostepnosc}%</>
                            )}
                        </Typography>
                    </Alert>
                )}

                {/* Lista blokerów */}
                <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {lastOrderData.sortedBlockers.map((bloker, index) => {
                        const dominantWplyw = Object.entries(bloker.wplyw)
                            .sort((a, b) => b[1] - a[1])[0];
                        
                        const avgDostepnoscBloker = bloker.dostepnosc.length > 0 ? 
                            (bloker.dostepnosc.reduce((sum, val) => sum + val, 0) / bloker.dostepnosc.length).toFixed(1) : null;
                        
                        const latestDate = bloker.dates.length > 0 ? 
                            bloker.dates.sort((a, b) => b - a)[0] : null;

                        return (
                            <React.Fragment key={index}>
                                <ListItem sx={{ 
                                    backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                                    borderRadius: 1,
                                    mb: 1
                                }}>
                                    <Badge 
                                        badgeContent={bloker.count} 
                                        color="primary"
                                        sx={{ mr: 2 }}
                                    >
                                        <Avatar sx={{ 
                                            backgroundColor: dominantWplyw ? getWplywColor(dominantWplyw[0]) + '20' : theme.palette.grey[200],
                                            color: dominantWplyw ? getWplywColor(dominantWplyw[0]) : theme.palette.grey[600]
                                        }}>
                                            <Block />
                                        </Avatar>
                                    </Badge>
                                    
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                {bloker.name}
                                            </Typography>
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
                                                
                                                {latestDate && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        📅 {latestDate.toLocaleDateString('pl-PL')}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < lastOrderData.sortedBlockers.length - 1 && <Divider />}
                            </React.Fragment>
                        );
                    })}
                </List>

                {/* Podsumowanie */}
                {lastOrderData.sortedBlockers.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                            💡 <strong>Podsumowanie:</strong> Znaleziono {lastOrderData.totalLastOrderBlockers} różnych blokerów 
                            w ostatnich zamówieniach. Najczęstszy: <strong>{lastOrderData.sortedBlockers[0]?.name}</strong>
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}