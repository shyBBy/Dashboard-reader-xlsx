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
import { formatDate } from '../../helpers/dataFormatting.helper';

export default function LastOrderBlockers({ storeData, storeId }) {
    const theme = useTheme();

    const lastOrderData = useMemo(() => {
        if (!storeData || storeData.length === 0) return null;

        // Grupujemy blokery według nazwy i analizujemy Bloker_ostatnie_zam
        const blockerGroups = storeData.reduce((acc, row) => {
            const blokerName = row.BlockerName;
            const ostatnieZamLinii = parseInt(row.Bloker_ostatnie_zam) || 0;
            const wplyw = row.Wplyw;
            const date = row.DATE_last_zam;
            const dostepnosc = row.DOSTEPNOSC_DROGERIA;
            
            if (blokerName && ostatnieZamLinii > 0) {
                if (!acc[blokerName]) {
                    acc[blokerName] = {
                        name: blokerName,
                        totalLines: 0,
                        records: [],
                        wplyw: {},
                        dates: [],
                        dostepnosc: [],
                        avgLines: 0
                    };
                }
                
                acc[blokerName].totalLines += ostatnieZamLinii;
                acc[blokerName].records.push(row);
                
                if (wplyw) {
                    acc[blokerName].wplyw[wplyw] = (acc[blokerName].wplyw[wplyw] || 0) + 1;
                }
                
                if (date) {
                    acc[blokerName].dates.push(new Date(date));
                }
                
                if (dostepnosc) {
                    const parsedDostepnosc = typeof dostepnosc === 'string' ? parseFloat(dostepnosc.replace('%', '')) : (typeof dostepnosc === 'number' ? dostepnosc : 0);
                    acc[blokerName].dostepnosc.push(parsedDostepnosc);
                }
            }
            
            return acc;
        }, {});

        // Obliczamy średnią liczbę linii na rekord dla każdego blokera
        Object.values(blockerGroups).forEach(bloker => {
            bloker.avgLines = Math.round(bloker.totalLines / bloker.records.length);
        });

        // Sortujemy według całkowitej liczby linii (najważniejsze metryki)
        const sortedBlockers = Object.values(blockerGroups)
            .sort((a, b) => b.totalLines - a.totalLines);

        // Statystyki
        const totalLastOrderBlockers = Object.keys(blockerGroups).length;
        const totalLastOrderLines = sortedBlockers.reduce((sum, bloker) => sum + bloker.totalLines, 0);
        
        // Najnowsza data ostatniego zamówienia
        const allDates = storeData
            .map(row => row.DATE_last_zam)
            .filter(Boolean)
            .map(date => new Date(date))
            .sort((a, b) => b - a);
        
        const latestOrderDate = allDates[0];
        
        return {
            blockerGroups,
            sortedBlockers,
            totalLastOrderBlockers,
            totalLastOrderLines,
            latestOrderDate
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
                            {lastOrderData.totalLastOrderBlockers} blokerów • {lastOrderData.totalLastOrderLines.toLocaleString()} linii zablokowanych
                        </Typography>
                    </Box>
                </Box>

                {/* Informacje o ostatnim zamówieniu */}
                {lastOrderData.latestOrderDate && (
                    <Alert severity="info" sx={{ mb: 3 }} icon={<DateRange />}>
                        <Typography variant="body2">
                            <strong>Ostatnie zamówienie:</strong> {formatDate(lastOrderData.latestOrderDate)}
                            <> • <strong>Łącznie zablokowano:</strong> {lastOrderData.totalLastOrderLines.toLocaleString()} linii</>
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
                                        badgeContent={`${bloker.totalLines}L`}
                                        color="error"
                                        sx={{ 
                                            mr: 2,
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold'
                                            }
                                        }}
                                    >
                                        <Avatar sx={{ 
                                            backgroundColor: dominantWplyw ? getWplywColor(dominantWplyw[0]) + '20' : theme.palette.grey[200],
                                            color: dominantWplyw ? getWplywColor(dominantWplyw[0]) : theme.palette.grey[600]
                                        }}>
                                            <Block />
                                        </Avatar>
                                    </Badge>
                                    
                                    <ListItemText
                                        primaryTypographyProps={{ component: 'div' }}
                                        secondaryTypographyProps={{ component: 'div' }}
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                    {bloker.name}
                                                </Typography>
                                                <Chip 
                                                    label={`${bloker.totalLines.toLocaleString()} linii`}
                                                    size="small"
                                                    color="error"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                                    <Chip 
                                                        label={`Średnio: ${bloker.avgLines} linii/rekord`}
                                                        size="small"
                                                        color="info"
                                                        sx={{ fontWeight: 'medium' }}
                                                    />
                                                    
                                                    <Chip 
                                                        label={`${bloker.records.length} rekordów`}
                                                        size="small"
                                                        color="default"
                                                        sx={{ fontWeight: 'medium' }}
                                                    />
                                                    
                                                    {dominantWplyw && (
                                                        <Chip 
                                                            label={`${getWplywIcon(dominantWplyw[0])} ${dominantWplyw[0]}`}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getWplywColor(dominantWplyw[0]) + '20',
                                                                color: getWplywColor(dominantWplyw[0]),
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                
                                                {latestDate && (
                                                    <Typography variant="caption" color="text.secondary" component="span">
                                                        📅 Data: {formatDate(latestDate)}
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
                            💡 <strong>Podsumowanie:</strong> {lastOrderData.totalLastOrderBlockers} blokerów zablokowało łącznie {lastOrderData.totalLastOrderLines.toLocaleString()} linii.
                            Największy problem: <strong>{lastOrderData.sortedBlockers[0]?.name}</strong> ({lastOrderData.sortedBlockers[0]?.totalLines.toLocaleString()} linii)
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}