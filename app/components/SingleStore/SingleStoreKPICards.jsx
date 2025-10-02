import React, { useMemo } from 'react';
import { 
    Typography, 
    Box, 
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
            const dostepnosc = parseFloat(row.DOSTEPNOSC_DROGERIA?.replace?.('%', '') || 0);
            acc.total += dostepnosc;
            acc.count++;
            if (dostepnosc > 80) acc.wysoka++;
            else if (dostepnosc > 50) acc.srednia++;
            else acc.niska++;
            return acc;
        }, { total: 0, count: 0, wysoka: 0, srednia: 0, niska: 0 });

        const avgDostepnosc = dostepnoscStats.count > 0 ? 
            (dostepnoscStats.total / dostepnoscStats.count).toFixed(1) : 0;

        // Analiza blokerów
        const uniqueBlokery = new Set(storeData
            .map(row => row.BlockerName)
            .filter(bloker => bloker && bloker.trim() !== '')
        ).size;

        // Suma linii sprzedaży
        const totalLinii = storeData.reduce((sum, row) => {
            const linie = parseFloat(row.LiniiSprzedazy || 0);
            return sum + linie;
        }, 0);

        // Suma utraconych sprzedaży
        const totalUtraty = storeData.reduce((sum, row) => {
            const utrata = parseFloat(row.UtraconeSprzedaze || 0);
            return sum + utrata;
        }, 0);

        return {
            totalRecords,
            wplywStats,
            decyzjaStats,
            avgDostepnosc,
            dostepnoscStats,
            uniqueBlokery,
            totalLinii,
            totalUtraty
        };
    }, [storeData]);

    if (!kpiData) {
        return (
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Brak danych do analizy KPI
                </Typography>
            </Box>
        );
    }

    const kpiCards = [
        {
            title: 'Łączne Rekordy',
            value: kpiData.totalRecords.toLocaleString(),
            icon: <Store />,
            color: theme.palette.primary.main,
            bgColor: theme.palette.primary.light + '20',
            subtitle: 'pozycji w analizie'
        },
        {
            title: 'Linie Sprzedaży',
            value: kpiData.totalLinii.toLocaleString(),
            icon: <Assessment />,
            color: theme.palette.info.main,
            bgColor: theme.palette.info.light + '20',
            subtitle: 'suma wszystkich linii'
        },
        {
            title: 'Utracone Sprzedaże',
            value: `${kpiData.totalUtraty.toLocaleString()} zł`,
            icon: <TrendingUp />,
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light + '20',
            subtitle: 'potencjalne straty'
        },
        {
            title: 'Średnia Dostępność',
            value: `${kpiData.avgDostepnosc}%`,
            icon: <Inventory />,
            color: parseFloat(kpiData.avgDostepnosc) > 80 ? theme.palette.success.main : theme.palette.warning.main,
            bgColor: parseFloat(kpiData.avgDostepnosc) > 80 ? theme.palette.success.light + '20' : theme.palette.warning.light + '20',
            subtitle: parseFloat(kpiData.avgDostepnosc) > 80 ? 'wysoka dostępność' : 'wymaga uwagi',
            progress: parseFloat(kpiData.avgDostepnosc)
        },
        {
            title: 'Unikalne Blokery',
            value: kpiData.uniqueBlokery.toString(),
            icon: <Block />,
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light + '20',
            subtitle: 'różnych problemów'
        },
        {
            title: 'Rekomendacje',
            value: kpiData.decyzjaStats.rekomenduj.toString(),
            icon: <CheckCircle />,
            color: theme.palette.success.main,
            bgColor: theme.palette.success.light + '20',
            subtitle: 'wymaga działania'
        },
        {
            title: 'Wpływ Wysoki',
            value: kpiData.wplywStats.wysoki.toString(),
            icon: <Warning />,
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light + '20',
            subtitle: 'priorytetowe problemy'
        },
        {
            title: 'Transport',
            value: '🚚',
            icon: <LocalShipping />,
            color: theme.palette.info.main,
            bgColor: theme.palette.info.light + '20',
            subtitle: 'logistyka sprawna'
        }
    ];

    return (
        <Box sx={{ mb: 6 }}>
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    mb: 4, 
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #6366f1, #06b6d4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em'
                }}
            >
                📊 Metryki Sklepu {storeId}
            </Typography>
            
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                justifyContent: 'space-between'
            }}>
                {kpiCards.map((card, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: '1 1 280px',
                            minWidth: '280px',
                            maxWidth: '320px',
                            p: 3,
                            borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: `1px solid ${card.color}60`,
                                boxShadow: `0 20px 40px -12px ${card.color}30`
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: `linear-gradient(90deg, ${card.color}, ${card.color}80)`,
                                opacity: 0.8
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    borderRadius: 2, 
                                    background: `linear-gradient(135deg, ${card.color}20, ${card.color}10)`,
                                    color: card.color,
                                    mr: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}
                            >
                                {card.icon}
                            </Box>
                            <Box>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        fontWeight: 'medium',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        mb: 1
                                    }}
                                >
                                    {card.title}
                                </Typography>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 'bold',
                                        color: 'white',
                                        lineHeight: 1
                                    }}
                                >
                                    {card.value}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.875rem',
                                mb: card.progress ? 2 : 0
                            }}
                        >
                            {card.subtitle}
                        </Typography>

                        {card.progress && (
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={card.progress} 
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 3,
                                            background: `linear-gradient(90deg, ${card.color}, ${card.color}80)`
                                        }
                                    }} 
                                />
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}