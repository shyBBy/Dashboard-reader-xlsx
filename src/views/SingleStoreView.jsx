import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Grid,
    Breadcrumbs,
    IconButton,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import { ArrowBack, Home, Store, Refresh } from '@mui/icons-material';
import { useStoreData } from '../hooks/useStoreData.hook';
import ErrorCard from '../components/ErrorCard';
import SingleStoreKPICards from '../components/SingleStore/SingleStoreKPICards';
import SingleStoreCharts from '../components/SingleStore/SingleStoreCharts';
import BlockerAnalysis from '../components/SingleStore/BlockerAnalysis';
import LastOrderBlockers from '../components/SingleStore/LastOrderBlockers';
import NextOrderBlockers from '../components/SingleStore/NextOrderBlockers';

export default function SingleStoreView() {
    const { storeId } = useParams();
    const navigate = useNavigate();
    
    // Nowy hook do pobierania danych konkretnego sklepu
    const { 
        storeData, 
        storeBlockers, 
        storeStats, 
        storeHighImpact, 
        isLoading, 
        error, 
        refreshStoreData, 
        hasData 
    } = useStoreData(storeId);

    // Brak ID sklepu w URL
    if (!storeId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
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
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
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

    // Główny widok sklepu - renderowanie danych
    return (
        <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
            {/* Breadcrumbs i nagłówek */}
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

            {/* Nagłówek z informacjami o sklepie */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        🏪 Sklep {storeId}
                    </Typography>
                    <Chip 
                        label={`${storeBlockers?.length || 0} blokerów`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<Refresh />}
                        onClick={refreshStoreData}
                        size="small"
                    >
                        Odśwież
                    </Button>
                    <IconButton 
                        onClick={() => navigate('/dashboard')}
                        sx={{ color: 'text.secondary' }}
                    >
                        <ArrowBack />
                    </IconButton>
                </Box>
            </Box>

            {/* KPI Cards dla sklepu */}
            <SingleStoreKPICards 
                storeId={storeId}
                storeData={storeBlockers}
                storeStats={storeStats}
                storeHighImpact={storeHighImpact}
            />

            {/* Główne komponenty sklepu */}
            <Grid container spacing={3}>
                {/* Wykresy */}
                <Grid item xs={12} lg={6}>
                    <SingleStoreCharts 
                        storeData={storeBlockers} 
                        storeId={storeId} 
                    />
                </Grid>

                {/* Analiza blokerów */}
                <Grid item xs={12} lg={6}>
                    <BlockerAnalysis 
                        storeData={storeBlockers} 
                        storeId={storeId} 
                    />
                </Grid>

                {/* Ostatnie zamówienia z blokerami */}
                <Grid item xs={12} lg={6}>
                    <LastOrderBlockers 
                        storeData={storeBlockers} 
                        storeId={storeId} 
                    />
                </Grid>

                {/* Następne zamówienia z blokerami */}
                <Grid item xs={12} lg={6}>
                    <NextOrderBlockers 
                        storeData={storeBlockers} 
                        storeId={storeId} 
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
