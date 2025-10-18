import React, { useMemo } from 'react';
import { Typography, Box } from '@mui/material';
import { Store, TrendingUp, Warning, CheckCircle, Block, Assessment, Inventory } from '@mui/icons-material';
import MainKPICard from '../MainKPICard';

export default function SingleStoreKPICards({ storeData, storeId }) {
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

    const createSparkline = (value, startFactor = 0.6) => {
        const numeric = Number(value) || 0;
        if (numeric === 0) {
            return [0, 0, 0, 0, 0, 0, 0];
        }

        const base = numeric * startFactor;
        return Array.from({ length: 7 }, (_, idx) => {
            const progress = idx / 6;
            return Number((base + (numeric - base) * progress).toFixed(2));
        });
    };

    const createTrendFromShare = (part) => {
        const base = kpiData.totalRecords || 0;
        const numeric = Number(part) || 0;
        const share = base === 0 ? 0 : Math.min((numeric / base) * 100, 999);
        return {
            value: share.toFixed(1),
            suffix: '%',
            status: share > 0 ? 'up' : 'neutral',
        };
    };

    const createAvailabilityTrend = (value) => {
        const numeric = parseFloat(value) || 0;
        const baseline = 92;
        const diff = numeric - baseline;
        const status = diff >= 0 ? (diff > 3 ? 'up' : 'neutral') : 'down';
        return {
            value: Math.abs(diff).toFixed(1),
            suffix: 'p.p.',
            status,
        };
    };

    const createAvailabilitySparkline = (value) => {
        const numeric = parseFloat(value) || 0;
        if (numeric === 0) {
            return [0, 0, 0, 0, 0, 0, 0];
        }
        const base = Math.max(numeric - 4, 0);
        return Array.from({ length: 7 }, (_, idx) => {
            const progress = idx / 6;
            return Number((base + (numeric - base) * progress).toFixed(2));
        });
    };

    const kpiCardsData = [
        {
            title: 'Powody Blokerów',
            value: kpiData.totalRecords.toLocaleString(),
            icon: <Store />,
            type: 'primary',
            subtitle: 'pozycji w analizie',
            trend: createTrendFromShare(kpiData.wplywStats.wysoki + kpiData.wplywStats.sredni),
            chartColor: 'primary',
            chartData: createSparkline(kpiData.totalRecords)
        },
        {
            title: 'Dostępność w Drogerii',
            value: `${kpiData.dostepnoscDrogeria}%`,
            icon: <Inventory />,
            type: (() => {
                const value = parseFloat(kpiData.dostepnoscDrogeria);
                if (value >= 96.7) return 'success';
                if (value >= 92) return 'info';
                if (value >= 89) return 'warning';
                return 'error';
            })(),
            subtitle: (() => {
                const value = parseFloat(kpiData.dostepnoscDrogeria);
                if (value >= 96.7) return 'bardzo dobra dostępność';
                if (value >= 92) return 'dostępność dopuszczalna';
                if (value >= 89) return 'słaba dostępność';
                return 'krytyczna dostępność';
            })(),
            trend: createAvailabilityTrend(kpiData.dostepnoscDrogeria),
            chartColor: (() => {
                const value = parseFloat(kpiData.dostepnoscDrogeria);
                if (value >= 96.7) return 'success';
                if (value >= 92) return 'info';
                if (value >= 89) return 'warning';
                return 'error';
            })(),
            chartData: createAvailabilitySparkline(kpiData.dostepnoscDrogeria)
        },
        {
            title: 'Dostępność Sieć',
            value: `${kpiData.dostepnoscSiec}%`,
            icon: <Assessment />,
            type: (() => {
                const value = parseFloat(kpiData.dostepnoscSiec);
                if (value >= 96.7) return 'success';
                if (value >= 92) return 'info';
                if (value >= 89) return 'warning';
                return 'error';
            })(),
            subtitle: (() => {
                const value = parseFloat(kpiData.dostepnoscSiec);
                if (value >= 96.7) return 'bardzo dobra sieć';
                if (value >= 92) return 'sieć dopuszczalna';
                if (value >= 89) return 'sieć słaba';
                return 'sieć krytyczna';
            })(),
            trend: createAvailabilityTrend(kpiData.dostepnoscSiec),
            chartColor: (() => {
                const value = parseFloat(kpiData.dostepnoscSiec);
                if (value >= 96.7) return 'success';
                if (value >= 92) return 'info';
                if (value >= 89) return 'warning';
                return 'error';
            })(),
            chartData: createAvailabilitySparkline(kpiData.dostepnoscSiec)
        },
        {
            title: 'Największy Bloker Ostatnie',
            value: kpiData.blokerLastOrder.value.toString(),
            icon: <Block />,
            type: 'error',
            subtitle: kpiData.blokerLastOrder.name || 'brak danych',
            trend: createTrendFromShare(kpiData.blokerLastOrder.value),
            chartColor: 'error',
            chartData: createSparkline(kpiData.blokerLastOrder.value, 0.5)
        },
        {
            title: 'Największy Bloker Następne',
            value: kpiData.blokerNextOrder.value.toString(),
            icon: <TrendingUp />,
            type: 'warning',
            subtitle: kpiData.blokerNextOrder.name || 'brak danych',
            trend: createTrendFromShare(kpiData.blokerNextOrder.value),
            chartColor: 'warning',
            chartData: createSparkline(kpiData.blokerNextOrder.value, 0.5)
        },
        {
            title: 'Zera w Blokerze Ostatnie',
            value: kpiData.zeraLastOrder.toString(),
            icon: <Warning />,
            type: 'error',
            subtitle: 'suma zer ostatnie zam',
            trend: createTrendFromShare(kpiData.zeraLastOrder),
            chartColor: 'error',
            chartData: createSparkline(kpiData.zeraLastOrder, 0.4)
        },
        {
            title: 'Rekomendacje',
            value: kpiData.decyzjaStats.rekomenduj.toString(),
            icon: <CheckCircle />,
            type: 'success',
            subtitle: 'wymaga działania',
            trend: createTrendFromShare(kpiData.decyzjaStats.rekomenduj),
            chartColor: 'success',
            chartData: createSparkline(kpiData.decyzjaStats.rekomenduj, 0.4)
        },
        {
            title: 'Wpływ Wysoki',
            value: kpiData.wplywStats.wysoki.toString(),
            icon: <Warning />,
            type: 'error',
            subtitle: 'priorytetowe problemy',
            trend: createTrendFromShare(kpiData.wplywStats.wysoki),
            chartColor: 'error',
            chartData: createSparkline(kpiData.wplywStats.wysoki, 0.5)
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
                {kpiCardsData.map((card, index) => (
                    <MainKPICard
                        key={index}
                        title={card.title}
                        value={card.value}
                        subtitle={card.subtitle}
                        icon={card.icon}
                        type={card.type}
                        trend={card.trend}
                        chartColor={card.chartColor}
                        chartData={card.chartData}
                    />
                ))}
            </Box>
        </Box>
    );
}