import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Grid,
    Breadcrumbs,
    IconButton
} from '@mui/material';
import { ArrowBack, Home, Store } from '@mui/icons-material';
import { useApiData } from '../context/ApiDataContext';
import SingleStoreKPICards from '../components/SingleStore/SingleStoreKPICards';
import SingleStoreCharts from '../components/SingleStore/SingleStoreCharts';
import BlockerAnalysis from '../components/SingleStore/BlockerAnalysis';
import LastOrderBlockers from '../components/SingleStore/LastOrderBlockers';
import NextOrderBlockers from '../components/SingleStore/NextOrderBlockers';

export default function SingleStoreView() {
    const { storeId } = useParams();
    const { excelData, hasData, isLoading } = useApiData();
    const navigate = useNavigate();
    const [isInitializing, setIsInitializing] = React.useState(true);

    // Daj czas na inicjalizację
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Nie przekierowuj już na upload - dane przychodzą z API
    // React.useEffect(() => {
    //     if (!isInitializing && !isLoading && !hasData && !excelData) {
    //         console.log('🚨 SingleStoreView - Brak danych, przekierowuję na /dashboard');
    //         navigate('/dashboard');
    //     }
    // }, [isInitializing, isLoading, hasData, excelData, navigate]);

    // Filtrowanie danych tylko dla tego sklepu
    const storeData = React.useMemo(() => {
        if (!excelData?.data || !storeId) return [];
        
        // Użyj dopasowania po konwersji na string (najczęściej działa)
        return excelData.data.filter(row => String(row.StoreId) === String(storeId));
    }, [excelData?.data, storeId]);

    console.log('🏪 [STORE_VIEW] Sklep:', storeId, '- dane:', storeData.length, 'rekordów');

    if (!storeId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                    <Typography variant="h5" color="error">
                        ❌ Brak ID sklepu w URL
                    </Typography>
                </Paper>
            </Box>
        );
    }

    // Pokaż loading state
    if (isInitializing || isLoading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                    <Typography variant="h5" color="primary.main">
                        ⏳ Ładowanie danych sklepu...
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Poczekaj chwilę, inicjalizuję widok dla sklepu {storeId}
                    </Typography>
                </Paper>
            </Box>
        );
    }

    if (!hasData || !excelData?.data || excelData.data.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                    <Typography variant="h5" color="text.secondary">
                        📋 Brak danych do wyświetlenia
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        API nie zwróciło danych o blokerach
                    </Typography>
                </Paper>
            </Box>
        );
    }

    if (storeData.length === 0) {
        return (
            <Box sx={{ p: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Breadcrumbs>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Home fontSize="small" />
                                Start
                            </Box>
                        </Link>
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Dashboard
                        </Link>
                        <Typography color="text.primary">Sklep {storeId}</Typography>
                    </Breadcrumbs>
                </Box>

                <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="warning.main">
                        ⚠️ Brak danych dla sklepu: {storeId}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
                        Nie znaleziono danych dla tego sklepu w wgranych danych
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<ArrowBack />}
                        component={Link} 
                        to="/dashboard"
                    >
                        Powrót do Dashboard
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box 
            sx={{ 
                width: '100%', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                px: { xs: 2, sm: 3, md: 4, lg: 6 }, 
                py: 4 
            }}
        >
            {/* Nagłówek i breadcrumbs */}
            <Box sx={{ mb: 6 }}>
                <Breadcrumbs 
                    sx={{ 
                        mb: 3,
                        '& .MuiBreadcrumbs-separator': {
                            color: 'text.secondary'
                        }
                    }}
                >
                    <Link 
                        to="/" 
                        style={{ 
                            textDecoration: 'none', 
                            color: 'inherit',
                            opacity: 0.7,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Home fontSize="small" />
                            Start
                        </Box>
                    </Link>
                    <Link 
                        to="/dashboard" 
                        style={{ 
                            textDecoration: 'none', 
                            color: 'inherit',
                            opacity: 0.7,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        Dashboard
                    </Link>
                    <Typography color="text.primary" sx={{ fontWeight: 500 }}>
                        Sklep {storeId}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <IconButton 
                        component={Link} 
                        to="/dashboard" 
                        sx={{ 
                            background: 'rgba(255, 255, 255, 0.1)',
                            '&:hover': {
                                background: 'rgba(255, 255, 255, 0.2)',
                            }
                        }}
                    >
                        <ArrowBack sx={{ color: 'text.primary' }} />
                    </IconButton>
                    <Box>
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 800,
                                background: 'linear-gradient(45deg, #6366f1, #06b6d4)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.02em',
                                mb: 1
                            }}
                        >
                            Sklep {storeId}
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                            Szczegółowa analiza • {storeData.length} rekordów danych
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* KPI Cards */}
            <Box sx={{ mb: 8 }}>
                <SingleStoreKPICards storeData={storeData} storeId={storeId} />
            </Box>

            {/* Wykresy */}
            <Box sx={{ mb: 8 }}>
                <SingleStoreCharts storeData={storeData} storeId={storeId} />
            </Box>

            {/* Analiza Blokerów */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <BlockerAnalysis storeData={storeData} storeId={storeId} />
                
                <Box sx={{ display: 'flex', gap: 4, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                        <LastOrderBlockers storeData={storeData} storeId={storeId} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <NextOrderBlockers storeData={storeData} storeId={storeId} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}