import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Breadcrumbs,
    IconButton,
    CircularProgress,
    Alert,
    Chip,
    Stack,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { ArrowBack, Home, Store, Refresh, Storefront, People, Event, TrendingUp, AssignmentTurnedIn, Insights, Timeline, Warning, CheckCircle, Block, Assessment, Inventory, CalendarMonth, History, Upcoming } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useStoreData } from '../hooks/useStoreData.hook';
import ErrorCard from '../components/ErrorCard';
import MetricsSection from '../components/Metrics/MetricsSection';
import { formatDate, formatPercentage, parseDate } from '../helpers/dataFormatting.helper';

export default function SingleStoreView() {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const baseBackground = theme.palette.background.default;
    const surfaceBackground = theme.palette.background.paper;
    const borderColor = alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.6 : 0.3);
    const mutedSurface = theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.05)
        : alpha(theme.palette.common.black, 0.03);
    
    // Nowy hook do pobierania danych konkretnego sklepu
    const { 
        storeBlockers, 
        storeHighImpact, 
        isLoading, 
        error, 
        refreshStoreData, 
        hasData 
    } = useStoreData(storeId);

    const metrics = useMemo(() => {
        const emptyState = {
            primaryRow: null,
            owner: '-',
            leader: '-',
            lw: '-',
            source: '-',
            uniqueBlockers: 0,
            highImpactCount: 0,
            recommendationCount: 0,
            zeroCount: 0,
            totalLastLines: 0,
            totalNextLines: 0,
            totalFutureLines: 0,
            availabilityDrogeria: '-',
            availabilitySiec: '-',
            shareNetwork: '-',
            shareDrogeria: '-',
            deviationNetwork: '-',
            deviationNetworkNext: '-',
            lastOrderDate: null,
            nextOrderDate: null,
            futureOrderDate: null,
            refDate: null,
            topBlockers: [],
            summaryText: ''
        };

        if (!storeBlockers || storeBlockers.length === 0) {
            return emptyState;
        }

        const primaryRow = storeBlockers[0] || {};

        const pickValue = (row, keys) => {
            if (!row) return undefined;
            for (const key of keys) {
                const value = row[key];
                if (value !== undefined && value !== null && value !== '') {
                    return value;
                }
            }
            return undefined;
        };

        const aggregateNumber = (rows, keys) => {
            if (!rows?.length) return 0;
            return rows.reduce((sum, row) => {
                for (const key of keys) {
                    const raw = row?.[key];
                    if (raw !== undefined && raw !== null && raw !== '') {
                        const numeric = Number(raw);
                        if (!Number.isNaN(numeric)) {
                            sum += numeric;
                            break;
                        }
                    }
                }
                return sum;
            }, 0);
        };

        const collectDates = (rows, keys) => {
            if (!rows?.length) return [];
            return rows
                .map(row => {
                    const raw = pickValue(row, keys);
                    return raw !== undefined ? parseDate(raw) : null;
                })
                .filter(Boolean);
        };

        const formatAvailability = (value) => {
            if (value === undefined || value === null || value === '') {
                return '-';
            }
            return formatPercentage(value);
        };

        const owner = pickValue(primaryRow, ['Gospodarz_Sklepu', 'GOSPODARZ_SKLEPU', 'Gospodarz']);
        const leader = pickValue(primaryRow, ['Lider', 'LIDER']);
        const lw = pickValue(primaryRow, ['LW']);
        const source = pickValue(primaryRow, ['Zrodlo_danych', 'ZRODLO_DANYCH']);

        const availabilityDrogeria = formatAvailability(pickValue(primaryRow, ['Dostepnosc_drogeria', 'DOSTEPNOSC_DROGERIA']));
        const availabilitySiec = formatAvailability(pickValue(primaryRow, ['Dostepnosc_siec', 'DOSTEPNOSC_SIEC']));
        const shareNetwork = formatAvailability(pickValue(primaryRow, ['Udzial_w_sieci', 'UDZIAL_W_SIECI']));
        const shareDrogeria = formatAvailability(pickValue(primaryRow, ['Udzial_procentowy_drogeria', 'UDZIAL_PROCENTOWY_DROGERIA']));
        const deviationNetwork = formatAvailability(pickValue(primaryRow, ['Odchylenie_od_sieci', 'ODCHYLENIE_OD_SIECI']));
        const deviationNetworkNext = formatAvailability(pickValue(primaryRow, ['Odchylenie_od_sieci_kolejne', 'ODCHYLENIE_OD_SIECI_KOLEJNE']));

        const uniqueBlockers = new Set(storeBlockers.map(row => row.BlockerName).filter(Boolean)).size;
        const highImpactCount = storeBlockers.filter(row => String(row.Wplyw || '').toUpperCase() === 'WYSOKI').length;
        const recommendationCount = storeBlockers.filter(row => String(row.Decyzja || '').toUpperCase().includes('REKOMENDUJ')).length;
        const zeroCount = aggregateNumber(storeBlockers, ['Zera_w_blokerze_ostatnie_zam', 'ZERA_W_BLOKERZE_OSTATNIE_ZAM']);

        const totalLastLines = aggregateNumber(storeBlockers, ['Bloker_ostatnie_zam', 'BLOKER_OSTATNIE_ZAM']);
        const totalNextLines = aggregateNumber(storeBlockers, ['Bloker_najblizsze_zam', 'BLOKER_NAJBLIZSZE_ZAM']);
        const totalFutureLines = aggregateNumber(storeBlockers, ['Bloker_kolejne_zam', 'BLOKER_KOLEJNE_ZAM']);

        const lastOrderDates = collectDates(storeBlockers, ['Ostatnie_zam', 'OSTATNIE_ZAM', 'DATA_ZAM', 'DATE_last_zam']);
        const nextOrderDates = collectDates(storeBlockers, ['Najblizsze_zam', 'NAJBLIZSZE_ZAM', 'DATA_PROJEKCJI_NEXT']);
        const futureOrderDates = collectDates(storeBlockers, ['Kolejne_zam', 'KOLEJNE_ZAM', 'DATA_PROJEKCJI_KOLEJNE']);
        const refDates = collectDates(storeBlockers, ['REFDATE', 'RefDate']);

        const lastOrderDate = lastOrderDates.sort((a, b) => b - a)[0] || null;
        const nextOrderDate = nextOrderDates.sort((a, b) => a - b)[0] || null;
        const futureOrderDate = futureOrderDates.sort((a, b) => a - b)[0] || null;
        const refDate = refDates.sort((a, b) => b - a)[0] || null;

        const blockersMap = storeBlockers.reduce((acc, row) => {
            const name = row.BlockerName || 'Brak nazwy';
            if (!acc.has(name)) {
                acc.set(name, {
                    name,
                    wplyw: row.Wplyw,
                    rekomendacja: row.Rekomendacja || row.Rekomendacja_dzialania,
                    opis: row.Opis || row.Powod_decyzji,
                    lastLines: 0,
                    nextLines: 0,
                    futureLines: 0,
                    najblizsze: parseDate(row.Najblizsze_zam || row.NAJBLIZSZE_ZAM || row.DATA_PROJEKCJI_NEXT),
                    ostatnie: parseDate(row.Ostatnie_zam || row.OSTATNIE_ZAM || row.DATA_ZAM)
                });
            }

            const entry = acc.get(name);
            entry.lastLines += Number(row.Bloker_ostatnie_zam || row.BLOKER_OSTATNIE_ZAM) || 0;
            entry.nextLines += Number(row.Bloker_najblizsze_zam || row.BLOKER_NAJBLIZSZE_ZAM) || 0;
            entry.futureLines += Number(row.Bloker_kolejne_zam || row.BLOKER_KOLEJNE_ZAM) || 0;

            if (!entry.wplyw && row.Wplyw) {
                entry.wplyw = row.Wplyw;
            }
            if (!entry.rekomendacja && (row.Rekomendacja || row.Rekomendacja_dzialania)) {
                entry.rekomendacja = row.Rekomendacja || row.Rekomendacja_dzialania;
            }
            if (!entry.opis && (row.Opis || row.Powod_decyzji)) {
                entry.opis = row.Opis || row.Powod_decyzji;
            }
            if (!entry.najblizsze && (row.Najblizsze_zam || row.DATA_PROJEKCJI_NEXT)) {
                entry.najblizsze = parseDate(row.Najblizsze_zam || row.DATA_PROJEKCJI_NEXT);
            }
            if (!entry.ostatnie && (row.Ostatnie_zam || row.DATA_ZAM)) {
                entry.ostatnie = parseDate(row.Ostatnie_zam || row.DATA_ZAM);
            }

            return acc;
        }, new Map());

        const topBlockers = Array.from(blockersMap.values())
            .sort((a, b) => (b.lastLines + b.nextLines + b.futureLines) - (a.lastLines + a.nextLines + a.futureLines))
            .slice(0, 6);

        const summaryText = `Sklep ${storeId} posiada ${uniqueBlockers} aktywnych blokerów, z czego ${highImpactCount} ma wysoki wpływ. Łącznie blokują ${totalLastLines.toLocaleString('pl-PL')} linii w ostatnim zamówieniu.`;

        return {
            primaryRow,
            owner: owner || '-',
            leader: leader || '-',
            lw: lw || '-',
            source: source || '-',
            uniqueBlockers,
            highImpactCount,
            recommendationCount,
            zeroCount,
            totalLastLines,
            totalNextLines,
            totalFutureLines,
            availabilityDrogeria,
            availabilitySiec,
            shareNetwork,
            shareDrogeria,
            deviationNetwork,
            deviationNetworkNext,
            lastOrderDate,
            nextOrderDate,
            futureOrderDate,
            refDate,
            topBlockers,
            summaryText
        };
    }, [storeBlockers, storeId]);

    const storeKpiItems = useMemo(() => {
        if (!Array.isArray(storeBlockers) || storeBlockers.length === 0) {
            return [];
        }

        const totalRecords = storeBlockers.length;

        const wplywStats = storeBlockers.reduce((acc, row) => {
            const impact = String(row?.Wplyw || '').toUpperCase();
            if (impact === 'WYSOKI') {
                acc.high += 1;
            } else if (impact === 'SREDNI') {
                acc.mid += 1;
            } else if (impact === 'NISKI') {
                acc.low += 1;
            } else if (impact === 'ZEROWY') {
                acc.zero += 1;
            }
            return acc;
        }, { high: 0, mid: 0, low: 0, zero: 0 });

        const decyzjaStats = storeBlockers.reduce((acc, row) => {
            const decision = String(row?.Decyzja || row?.Rekomendacja || row?.Rekomendacja_dzialania || '').toUpperCase();
            if (decision.includes('REKOMENDUJ')) {
                acc.recommend += 1;
            }
            if (decision.includes('BRAK AKCJI')) {
                acc.noAction += 1;
            }
            return acc;
        }, { recommend: 0, noAction: 0 });

        const pickNumeric = (row, keys) => {
            for (const key of keys) {
                const raw = row?.[key];
                if (raw !== undefined && raw !== null && raw !== '') {
                    const numeric = Number(raw);
                    if (!Number.isNaN(numeric)) {
                        return numeric;
                    }
                }
            }
            return 0;
        };

        const pickText = (row, keys) => {
            for (const key of keys) {
                const raw = row?.[key];
                if (raw !== undefined && raw !== null && raw !== '') {
                    return String(raw);
                }
            }
            return '';
        };

        const parsePercentMetric = (value) => {
            if (!value || value === '-') {
                return 0;
            }
            const numeric = parseFloat(String(value).replace('%', '').replace(',', '.'));
            return Number.isNaN(numeric) ? 0 : numeric;
        };

        const availabilityDrogeria = parsePercentMetric(metrics.availabilityDrogeria);
        const availabilitySiec = parsePercentMetric(metrics.availabilitySiec);

        const blokerLastOrder = storeBlockers.reduce((acc, row) => {
            const value = pickNumeric(row, ['Bloker_ostatnie_zam', 'BLOKER_OSTATNIE_ZAM']);
            if (value > acc.value) {
                return {
                    value,
                    name: pickText(row, ['BlockerName', 'BLOKER', 'Blocker']),
                };
            }
            return acc;
        }, { name: '', value: 0 });

        const blokerNextOrder = storeBlockers.reduce((acc, row) => {
            const value = pickNumeric(row, ['Bloker_najblizsze_zam', 'BLOKER_NAJBLIZSZE_ZAM']);
            if (value > acc.value) {
                return {
                    value,
                    name: pickText(row, ['BlockerName', 'BLOKER', 'Blocker']),
                };
            }
            return acc;
        }, { name: '', value: 0 });

        const zeraLastOrder = storeBlockers.reduce((sum, row) => {
            return sum + pickNumeric(row, ['Zera_w_blokerze_ostatnie_zam', 'ZERA_W_BLOKERZE_OSTATNIE_ZAM']);
        }, 0);

        const toLocale = (value) => Number(value || 0).toLocaleString('pl-PL');
        const toPercentString = (value) => `${(Number(value) || 0).toFixed(1)}%`;

        const createSparkline = (value, startFactor = 0.6) => {
            const numeric = Number(value) || 0;
            if (!numeric) {
                return [0, 0, 0, 0, 0, 0, 0];
            }
            const base = numeric * startFactor;
            return Array.from({ length: 7 }, (_, index) => {
                const progress = index / 6;
                return Number((base + (numeric - base) * progress).toFixed(2));
            });
        };

        const createTrendFromShare = (part, label) => {
            if (!totalRecords) {
                return {
                    direction: 'neutral',
                    value: '0.0',
                    suffix: '%',
                    label,
                };
            }
            const share = Math.min((Number(part) || 0) / totalRecords * 100, 999);
            const rounded = share.toFixed(1);
            const direction = share > 0 ? 'up' : 'neutral';
            return {
                direction,
                prefix: share > 0 ? '+' : '',
                value: rounded,
                suffix: '%',
                label,
            };
        };

        const createAvailabilityTrend = (value) => {
            const numeric = Number(value) || 0;
            if (!numeric) {
                return null;
            }
            const baseline = 92;
            const diff = numeric - baseline;
            const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
            return {
                direction,
                prefix: diff > 0 ? '+' : diff < 0 ? '-' : '',
                value: Math.abs(diff).toFixed(1),
                suffix: ' p.p.',
                label: 'vs próg 92%'
            };
        };

        const createAvailabilitySparkline = (value) => {
            const numeric = Number(value) || 0;
            if (!numeric) {
                return [0, 0, 0, 0, 0, 0, 0];
            }
            const base = Math.max(numeric - 4, 0);
            return Array.from({ length: 7 }, (_, index) => {
                const progress = index / 6;
                return Number((base + (numeric - base) * progress).toFixed(2));
            });
        };

        const availabilityIntent = (value) => {
            if (value >= 96.7) return 'success';
            if (value >= 92) return 'info';
            if (value >= 89) return 'warning';
            return 'error';
        };

        const availabilityDescription = (value) => {
            if (value >= 96.7) return 'bardzo dobra dostępność';
            if (value >= 92) return 'dostępność dopuszczalna';
            if (value >= 89) return 'słaba dostępność';
            return 'krytyczna dostępność';
        };

        return [
            {
                id: 'store-total-blockers',
                overline: 'Portfel blokera',
                title: 'Powody blokerów',
                value: toLocale(totalRecords),
                helperText: 'pozycji w analizie',
                icon: <Store fontSize="inherit" />,
                intent: 'primary',
                trend: createTrendFromShare(wplywStats.high + wplywStats.mid, 'wysoki + średni wpływ'),
                sparkline: { data: createSparkline(totalRecords), color: 'primary' },
            },
            {
                id: 'store-availability-drogeria',
                overline: 'Dostępność',
                title: 'Dostępność w drogerii',
                value: toPercentString(availabilityDrogeria),
                helperText: availabilityDescription(availabilityDrogeria),
                icon: <Inventory fontSize="inherit" />,
                intent: availabilityIntent(availabilityDrogeria),
                trend: createAvailabilityTrend(availabilityDrogeria),
                sparkline: { data: createAvailabilitySparkline(availabilityDrogeria), color: availabilityIntent(availabilityDrogeria) },
            },
            {
                id: 'store-availability-network',
                overline: 'Dostępność',
                title: 'Dostępność sieci',
                value: toPercentString(availabilitySiec),
                helperText: availabilityDescription(availabilitySiec),
                icon: <Assessment fontSize="inherit" />,
                intent: availabilityIntent(availabilitySiec),
                trend: createAvailabilityTrend(availabilitySiec),
                sparkline: { data: createAvailabilitySparkline(availabilitySiec), color: availabilityIntent(availabilitySiec) },
            },
            {
                id: 'store-top-blocker-last',
                overline: 'Ostatnie zamówienie',
                title: 'Największy bloker',
                value: toLocale(blokerLastOrder.value),
                helperText: blokerLastOrder.name || 'brak danych',
                icon: <Block fontSize="inherit" />,
                intent: 'error',
                trend: createTrendFromShare(blokerLastOrder.value, 'udział w portfelu'),
                sparkline: { data: createSparkline(blokerLastOrder.value, 0.5), color: 'error' },
            },
            {
                id: 'store-top-blocker-next',
                overline: 'Najbliższe zamówienie',
                title: 'Największy bloker',
                value: toLocale(blokerNextOrder.value),
                helperText: blokerNextOrder.name || 'brak danych',
                icon: <TrendingUp fontSize="inherit" />,
                intent: 'warning',
                trend: createTrendFromShare(blokerNextOrder.value, 'udział w prognozie'),
                sparkline: { data: createSparkline(blokerNextOrder.value, 0.5), color: 'warning' },
            },
            {
                id: 'store-zero-blockers',
                overline: 'Ostatnie zamówienie',
                title: 'Zera w blokerach',
                value: toLocale(zeraLastOrder),
                helperText: 'suma zer ostatnie zam.',
                icon: <Warning fontSize="inherit" />,
                intent: 'error',
                trend: createTrendFromShare(zeraLastOrder, 'udział w portfelu'),
                sparkline: { data: createSparkline(zeraLastOrder, 0.4), color: 'error' },
            },
            {
                id: 'store-recommendations',
                overline: 'Działania',
                title: 'Rekomendacje',
                value: toLocale(decyzjaStats.recommend),
                helperText: 'wymaga działania',
                icon: <CheckCircle fontSize="inherit" />,
                intent: 'success',
                trend: createTrendFromShare(decyzjaStats.recommend, 'wymaga akcji'),
                sparkline: { data: createSparkline(decyzjaStats.recommend, 0.4), color: 'success' },
            },
            {
                id: 'store-high-impact',
                overline: 'Priorytety',
                title: 'Wysoki wpływ',
                value: toLocale(wplywStats.high),
                helperText: 'priorytetowe problemy',
                icon: <Warning fontSize="inherit" />,
                intent: 'error',
                trend: createTrendFromShare(wplywStats.high, 'udział w portfelu'),
                sparkline: { data: createSparkline(wplywStats.high, 0.5), color: 'error' },
            },
        ];
    }, [metrics.availabilityDrogeria, metrics.availabilitySiec, storeBlockers]);

    const highImpactItems = useMemo(() => {
        if (Array.isArray(storeHighImpact) && storeHighImpact.length > 0) {
            return storeHighImpact;
        }
        return (storeBlockers || []).filter(row => String(row.Wplyw || '').toUpperCase() === 'WYSOKI');
    }, [storeHighImpact, storeBlockers]);

    const scheduleSummary = useMemo(() => {
        const items = [
            {
                id: 'next',
                label: 'Najbliższe zamówienie',
                date: metrics.nextOrderDate ? formatDate(metrics.nextOrderDate) : 'Brak danych',
                icon: <Upcoming fontSize="small" />,
                color: theme.palette.success.main,
            },
            {
                id: 'last',
                label: 'Ostatnie zamówienie',
                date: metrics.lastOrderDate ? formatDate(metrics.lastOrderDate) : 'Brak danych',
                icon: <History fontSize="small" />,
                color: theme.palette.grey[500],
            },
            {
                id: 'future',
                label: 'Kolejne zamówienie',
                date: metrics.futureOrderDate ? formatDate(metrics.futureOrderDate) : 'Brak danych',
                icon: <CalendarMonth fontSize="small" />,
                color: theme.palette.secondary.main,
            },
        ];

        return items;
    }, [metrics.futureOrderDate, metrics.lastOrderDate, metrics.nextOrderDate, theme]);

    const feedItems = useMemo(() => {
        if (metrics.topBlockers.length > 0) {
            return metrics.topBlockers;
        }

        return highImpactItems.slice(0, 6).map((row, index) => ({
            name: row.BlockerName || `Bloker ${index + 1}`,
            wplyw: row.Wplyw,
            rekomendacja: row.Rekomendacja || row.Rekomendacja_dzialania,
            opis: row.Opis || row.Powod_decyzji,
            lastLines: Number(row.Bloker_ostatnie_zam) || 0,
            nextLines: Number(row.Bloker_najblizsze_zam) || 0,
            futureLines: Number(row.Bloker_kolejne_zam) || 0,
            najblizsze: parseDate(row.Najblizsze_zam || row.NAJBLIZSZE_ZAM || row.DATA_PROJEKCJI_NEXT),
            ostatnie: parseDate(row.Ostatnie_zam || row.OSTATNIE_ZAM || row.DATA_ZAM)
        }));
    }, [highImpactItems, metrics.topBlockers]);

    const formatLines = (value) => {
        const numeric = Number(value || 0);
        if (!numeric) return '—';
        return `${numeric.toLocaleString('pl-PL')} linii`;
    };

    const impactChipStyles = (impact) => {
        const paletteMap = {
            WYSOKI: theme.palette.error,
            SREDNI: theme.palette.warning,
            NISKI: theme.palette.info,
            ZEROWY: theme.palette.success,
        };
        const palette = paletteMap[String(impact || '').toUpperCase()] || { main: theme.palette.text.secondary };
        return {
            backgroundColor: `${palette.main}22`,
            color: palette.main,
            fontWeight: 600,
            letterSpacing: 0.5,
        };
    };

    // Brak ID sklepu w URL
    if (!storeId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        mt: 4,
                        backgroundColor: surfaceBackground,
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h5" color="error">
                        ❌ Brak ID sklepu w URL
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<Home />}
                        onClick={() => navigate('/dashboard')}
                        sx={{ mt: 2 }}
                    >
                        Powrót do Dashboard
                    </Button>
                </Paper>
            </Box>
        );
    }

    // Loading state - ładowanie danych z API
    if (isLoading) {
        return (
            <Box sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                flexDirection: 'column',
                gap: 3,
                textAlign: 'center',
                backgroundColor: 'background.default'
            }}>
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress 
                        size={60} 
                        thickness={4}
                        sx={{
                            color: 'primary.main',
                        }}
                    />
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '1.5rem'
                        }}
                    >
                        🏪
                    </Typography>
                </Box>
                
                <Box>
                    <Typography variant="h5" color="text.primary" gutterBottom>
                        Ładowanie sklepu {storeId}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Pobieranie danych z API...
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Error state
    if (error) {
        return (
            <ErrorCard
                title={`Błąd ładowania sklepu ${storeId}`}
                message={`Nie można pobrać danych dla sklepu ${storeId}. ${error}`}
                type="error"
                onRetry={refreshStoreData}
            />
        );
    }

    // Brak danych - sklep nie istnieje lub nie ma blokerów
    if (!hasData || !storeBlockers || storeBlockers.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        mt: 4,
                        backgroundColor: surfaceBackground,
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        📋 Brak danych dla sklepu {storeId}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Sklep nie istnieje lub nie ma blokerów w systemie
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<Home />}
                        onClick={() => navigate('/dashboard')}
                        sx={{ mt: 2 }}
                    >
                        Powrót do Dashboard
                    </Button>
                </Paper>
            </Box>
        );
    }

    const highlightStats = [
        {
            label: 'Aktywne blokery',
            value: metrics.uniqueBlockers.toLocaleString('pl-PL'),
            icon: <AssignmentTurnedIn fontSize="small" color="primary" />,
        },
        {
            label: 'Wysoki wpływ',
            value: metrics.highImpactCount.toLocaleString('pl-PL'),
            icon: <TrendingUp fontSize="small" color="error" />,
        },
        {
            label: 'Rekomendacje',
            value: metrics.recommendationCount.toLocaleString('pl-PL'),
            icon: <Insights fontSize="small" color="success" />,
        },
        {
            label: 'Zera w blokerach',
            value: metrics.zeroCount.toLocaleString('pl-PL'),
            icon: <Timeline fontSize="small" color="warning" />,
        },
        {
            label: 'Linie ostatnie',
            value: metrics.totalLastLines.toLocaleString('pl-PL'),
            icon: <Event fontSize="small" color="info" />,
        },
        {
            label: 'Linie następne',
            value: metrics.totalNextLines.toLocaleString('pl-PL'),
            icon: <TrendingUp fontSize="small" color="secondary" />,
        },
    ];

    // Główny widok sklepu - renderowanie danych
    return (
        <Box
            sx={{
                width: '100%',
                px: { xs: 2, sm: 3, md: 5 },
                py: 4,
                backgroundColor: baseBackground,
                color: theme.palette.text.primary,
                minHeight: '100vh',
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs>
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Home fontSize="small" />
                            Dashboard
                        </Box>
                    </Link>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Store fontSize="small" />
                        Sklep {storeId}
                    </Typography>
                </Breadcrumbs>
            </Box>

            <Box sx={{ position: 'relative', mb: { xs: 6, md: 8 } }}>
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 4,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary?.main || theme.palette.primary.dark} 100%)`,
                        color: '#fff',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0.18,
                            backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0%, transparent 55%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.2) 0%, transparent 45%)',
                        }}
                    />
                    <Box sx={{ position: 'relative', p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        width: 84,
                                        height: 84,
                                        borderRadius: 4,
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Storefront sx={{ fontSize: 40 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.75)', letterSpacing: 2, fontWeight: 600 }}>
                                        Profil sklepu
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                                        Sklep {storeId}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, mt: 1.5 }}>
                                        {metrics.owner && metrics.owner !== '-' && (
                                            <Chip size="small" label={`Gospodarz: ${metrics.owner}`} sx={{ backgroundColor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                                        )}
                                        {metrics.leader && metrics.leader !== '-' && (
                                            <Chip size="small" label={`Lider: ${metrics.leader}`} sx={{ backgroundColor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                                        )}
                                        {metrics.lw && metrics.lw !== '-' && (
                                            <Chip size="small" label={`LW: ${metrics.lw}`} sx={{ backgroundColor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                                        )}
                                        {metrics.source && metrics.source !== '-' && (
                                            <Chip size="small" label={metrics.source} sx={{ backgroundColor: 'rgba(255,255,255,0.16)', color: '#fff' }} />
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<Refresh />}
                                    onClick={refreshStoreData}
                                    sx={{ boxShadow: 'none' }}
                                >
                                    Odśwież dane
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBack />}
                                    onClick={() => navigate('/dashboard')}
                                    sx={{
                                        color: '#fff',
                                        borderColor: 'rgba(255,255,255,0.55)',
                                        '&:hover': {
                                            borderColor: '#fff',
                                            backgroundColor: 'rgba(255,255,255,0.08)'
                                        }
                                    }}
                                >
                                    Powrót do listy
                                </Button>
                            </Stack>
                        </Box>

                    </Box>
                </Box>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    mb: 4,
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 2.5,
                    border: `1px solid ${borderColor}`,
                    backgroundColor: surfaceBackground,
                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gap: { xs: 2, md: 3 },
                        gridTemplateColumns: {
                            xs: 'repeat(auto-fit, minmax(180px, 1fr))',
                            md: 'repeat(3, minmax(0, 1fr))',
                        },
                    }}
                >
                    {scheduleSummary.map((item) => (
                        <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        backgroundColor: alpha(item.color, 0.12),
                                        color: item.color,
                                        fontSize: 18,
                                    }}
                                >
                                    {item.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                                        {item.label}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                        {item.date}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>
                {metrics.refDate && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                        Dane aktualne na: {formatDate(metrics.refDate)}
                    </Typography>
                )}
            </Paper>

            {storeKpiItems.length > 0 && (
                <MetricsSection
                    items={storeKpiItems}
                    minCardWidth={260}
                    sx={{ mb: 4 }}
                />
            )}

            <Box
                sx={{
                    display: 'grid',
                    gap: { xs: 3, md: 4 },
                    alignItems: 'start',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: '360px minmax(0, 1fr)'
                    }
                }}
            >
                <Stack spacing={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: surfaceBackground,
                            backdropFilter: theme.palette.mode === 'dark' ? 'blur(8px)' : 'none',
                        }}
                    >
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Kluczowe statystyki
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))' },
                                    gap: 2,
                                }}
                            >
                                {highlightStats.map((stat) => (
                                    <Box
                                        key={stat.label}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            backgroundColor: mutedSurface,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {stat.icon}
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.4 }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: surfaceBackground,
                            backdropFilter: theme.palette.mode === 'dark' ? 'blur(8px)' : 'none',
                        }}
                    >
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Zespół sklepu
                            </Typography>
                            <List dense sx={{ p: 0 }}>
                                <ListItem disablePadding sx={{ mb: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <People color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Gospodarz sklepu" secondary={metrics.owner || 'Brak danych'} />
                                </ListItem>
                                <ListItem disablePadding sx={{ mb: 1 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <People color="secondary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Lider regionalny" secondary={metrics.leader || 'Brak danych'} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Store color="action" />
                                    </ListItemIcon>
                                    <ListItemText primary="LW" secondary={metrics.lw || 'Brak danych'} />
                                </ListItem>
                            </List>
                            {metrics.source && metrics.source !== '-' && (
                                <Box sx={{ mt: 2 }}>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Źródło danych: {metrics.source}
                                    </Typography>
                                </Box>
                            )}
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: surfaceBackground,
                            backdropFilter: theme.palette.mode === 'dark' ? 'blur(8px)' : 'none',
                        }}
                    >
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Dostępność i udział
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 1.5 }}>
                                {[{
                                    label: 'Dostępność drogeria',
                                    value: metrics.availabilityDrogeria
                                }, {
                                    label: 'Dostępność sieć',
                                    value: metrics.availabilitySiec
                                }, {
                                    label: 'Udział w sieci',
                                    value: metrics.shareNetwork
                                }, {
                                    label: 'Udział drogeria',
                                    value: metrics.shareDrogeria
                                }, {
                                    label: 'Odchylenie vs sieć',
                                    value: metrics.deviationNetwork
                                }, {
                                    label: 'Odchylenie kolejne',
                                    value: metrics.deviationNetworkNext
                                }].map((item) => (
                                    <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.label}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                    </Paper>

                </Stack>

                <Stack spacing={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: `1px solid ${borderColor}`,
                                backgroundColor: surfaceBackground,
                                backdropFilter: theme.palette.mode === 'dark' ? 'blur(8px)' : 'none',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Status sklepu
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
                                {metrics.summaryText}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                                <Chip 
                                    label={`Łącznie ${metrics.totalLastLines.toLocaleString('pl-PL')} linii zablokowanych w ostatnim zamówieniu`}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Chip 
                                    label={`${metrics.totalNextLines.toLocaleString('pl-PL')} linii zagrożonych w następnym zamówieniu`}
                                    color="secondary"
                                    variant="outlined"
                                />
                            </Box>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: surfaceBackground,
                            backdropFilter: theme.palette.mode === 'dark' ? 'blur(8px)' : 'none',
                        }}
                    >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Blokery do obserwacji
                                </Typography>
                                <Chip 
                                    label={`${feedItems.length} pozycji`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            {feedItems.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    Wszystkie blokery są obecnie pod kontrolą. Brak pozycji wysokiego ryzyka.
                                </Typography>
                            ) : (
                                <Stack spacing={3}>
                                    {feedItems.map((item, index) => (
                                        <Box key={`${item.name}-${index}`}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                        {item.name}
                                                    </Typography>
                                                    {item.opis && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                                                            {item.opis}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                {item.wplyw && (
                                                    <Chip label={item.wplyw} size="small" sx={impactChipStyles(item.wplyw)} />
                                                )}
                                            </Box>

                                            {item.rekomendacja && (
                                                <Alert 
                                                    severity={String(item.wplyw || '').toUpperCase() === 'WYSOKI' ? 'error' : 'info'}
                                                    sx={{ mt: 1.5 }}
                                                    icon={<TrendingUp fontSize="small" />}
                                                >
                                                    {item.rekomendacja}
                                                </Alert>
                                            )}

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                                                <Chip label={`Ostatnie: ${formatLines(item.lastLines)}`} size="small" variant="outlined" />
                                                <Chip label={`Następne: ${formatLines(item.nextLines)}`} size="small" variant="outlined" />
                                                {item.futureLines ? (
                                                    <Chip label={`Kolejne: ${formatLines(item.futureLines)}`} size="small" variant="outlined" />
                                                ) : null}
                                                {item.najblizsze && (
                                                    <Chip label={`Najbliższe zam.: ${formatDate(item.najblizsze)}`} size="small" variant="outlined" />
                                                )}
                                                {item.ostatnie && (
                                                    <Chip label={`Ostatnie zam.: ${formatDate(item.ostatnie)}`} size="small" variant="outlined" />
                                                )}
                                            </Box>

                                            {index < feedItems.length - 1 && <Divider sx={{ mt: 2.5 }} />}
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                    </Paper>
                    </Stack>
                </Box>
        </Box>
    );
}
