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

        // Dostępność w drogerii (bez liczenia średniej - każdy rekord ma tę samą wartość dla sklepu)
        const dostepnoscDrogeria = storeData.length > 0 ? (() => {
            const rawValue = storeData[0].DOSTEPNOSC_DROGERIA;
            if (typeof rawValue === 'string') {
                // Jeśli to string z %, usuń % i parsuj
                return parseFloat(rawValue.replace('%', '') || 0).toFixed(1);
            } else if (typeof rawValue === 'number') {
                // Jeśli to liczba, sprawdź czy to format dziesiętny (0.9646) czy procentowy (96.46)
                if (rawValue <= 1) {
                    // Format dziesiętny - pomnóż przez 100
                    return (rawValue * 100).toFixed(1);
                } else {
                    // Format procentowy
                    return rawValue.toFixed(1);
                }
            }
            return '0.0';
        })() : '0.0';
        // Dostępność sieć (bez liczenia średniej - każdy rekord ma tę samą wartość dla sklepu)  
        const dostepnoscSiec = storeData.length > 0 ? (() => {
            const rawValue = storeData[0].Dostepnosc_siec;
            if (typeof rawValue === 'string') {
                // Jeśli to string z %, usuń % i parsuj
                return parseFloat(rawValue.replace('%', '') || 0).toFixed(1);
            } else if (typeof rawValue === 'number') {
                // Jeśli to liczba, sprawdź czy to format dziesiętny (0.9646) czy procentowy (96.46)
                if (rawValue <= 1) {
                    // Format dziesiętny - pomnóż przez 100
                    return (rawValue * 100).toFixed(1);
                } else {
                    // Format procentowy
                    return rawValue.toFixed(1);
                }
            }
            return '0.0';
        })() : '0.0';

        // Największy bloker ostatnie zamówienie
        const blokerLastOrder = storeData.reduce((max, row) => {
            const blokerName = row.BlockerName;
            const lastOrderValue = parseInt(row.Bloker_ostatnie_zam) || 0;
            
            if (blokerName && lastOrderValue > (max.value || 0)) {
                return { name: blokerName, value: lastOrderValue };
            }
            return max;
        }, { name: '', value: 0 });

        // Największy bloker następne zamówienie
        const blokerNextOrder = storeData.reduce((max, row) => {
            const blokerName = row.BlockerName;
            const nextOrderValue = parseInt(row.Bloker_najblizsze_zam) || 0;
            
            if (blokerName && nextOrderValue > (max.value || 0)) {
                return { name: blokerName, value: nextOrderValue };
            }
            return max;
        }, { name: '', value: 0 });

        // Suma zer w blokerze ostatnie zamówienie
        const zeraLastOrder = storeData.reduce((sum, row) => {
            const zera = parseInt(row.Zera_w_blokerze_ostatnie_zam) || 0;
            return sum + zera;
        }, 0);

        return {
            totalRecords,
            wplywStats,
            decyzjaStats,
            dostepnoscDrogeria,
            dostepnoscSiec,
            blokerLastOrder,
            blokerNextOrder,
            zeraLastOrder
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
            title: 'Powody Blokerów',
            value: kpiData.totalRecords.toLocaleString(),
            icon: <Store />,
            color: theme.palette.primary.main,
            bgColor: theme.palette.primary.light + '20',
            subtitle: 'pozycji w analizie'
        },
        {
            title: 'Dostępność w Drogerii',
            value: `${kpiData.dostepnoscDrogeria}%`,
            icon: <Inventory />,
            color: (() => {
                const value = parseFloat(kpiData.dostepnoscDrogeria);
                if (value >= 96.7) return theme.palette.success.main; // Zielony - bardzo dobra
                if (value >= 92) return theme.palette.info.main;     // Niebieski - dopuszczalna  
                if (value >= 89) return theme.palette.warning.main;  // Pomarańczowy - słaba
                return theme.palette.error.main;                     // Czerwony - krytyczna
            })(),
            bgColor: (() => {
                const value = parseFloat(kpiData.dostepnoscDrogeria);
                if (value >= 96.7) return theme.palette.success.light + '20';
                if (value >= 92) return theme.palette.info.light + '20';
                if (value >= 89) return theme.palette.warning.light + '20';
                return theme.palette.error.light + '20';
            })(),
            subtitle: (() => {
                const value = parseFloat(kpiData.dostepnoscDrogeria);
                if (value >= 96.7) return 'bardzo dobra dostępność';
                if (value >= 92) return 'dostępność dopuszczalna';
                if (value >= 89) return 'słaba dostępność';
                return 'krytyczna dostępność';
            })(),
            progress: parseFloat(kpiData.dostepnoscDrogeria)
        },
        {
            title: 'Dostępność Sieć',
            value: `${kpiData.dostepnoscSiec}%`,
            icon: <Assessment />,
            color: (() => {
                const value = parseFloat(kpiData.dostepnoscSiec);
                if (value >= 96.7) return theme.palette.success.main; // Zielony - bardzo dobra
                if (value >= 92) return theme.palette.info.main;     // Niebieski - dopuszczalna  
                if (value >= 89) return theme.palette.warning.main;  // Pomarańczowy - słaba
                return theme.palette.error.main;                     // Czerwony - krytyczna
            })(),
            bgColor: (() => {
                const value = parseFloat(kpiData.dostepnoscSiec);
                if (value >= 96.7) return theme.palette.success.light + '20';
                if (value >= 92) return theme.palette.info.light + '20';
                if (value >= 89) return theme.palette.warning.light + '20';
                return theme.palette.error.light + '20';
            })(),
            subtitle: (() => {
                const value = parseFloat(kpiData.dostepnoscSiec);
                if (value >= 96.7) return 'bardzo dobra sieć';
                if (value >= 92) return 'sieć dopuszczalna';
                if (value >= 89) return 'sieć słaba';
                return 'sieć krytyczna';
            })(),
            progress: parseFloat(kpiData.dostepnoscSiec)
        },
        {
            title: 'Największy Bloker Ostatnie',
            value: kpiData.blokerLastOrder.value.toString(),
            icon: <Block />,
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light + '20',
            subtitle: kpiData.blokerLastOrder.name || 'brak danych'
        },
        {
            title: 'Największy Bloker Następne',
            value: kpiData.blokerNextOrder.value.toString(),
            icon: <TrendingUp />,
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light + '20',
            subtitle: kpiData.blokerNextOrder.name || 'brak danych'
        },
        {
            title: 'Zera w Blokerze Ostatnie',
            value: kpiData.zeraLastOrder.toString(),
            icon: <Warning />,
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light + '20',
            subtitle: 'suma zer ostatnie zam'
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