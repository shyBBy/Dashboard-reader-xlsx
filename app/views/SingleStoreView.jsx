import React from 'react';
import { useParams, Link } from 'react-router';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Container,
    Grid,
    Breadcrumbs,
    IconButton
} from '@mui/material';
import { ArrowBack, Home, Store } from '@mui/icons-material';
import { useExcelData } from '../context/ExcelDataContext';
import SingleStoreKPICards from '../components/SingleStore/SingleStoreKPICards';
import SingleStoreCharts from '../components/SingleStore/SingleStoreCharts';
import BlockerAnalysis from '../components/SingleStore/BlockerAnalysis';
import LastOrderBlockers from '../components/SingleStore/LastOrderBlockers';
import NextOrderBlockers from '../components/SingleStore/NextOrderBlockers';

export default function SingleStoreView() {
    const { storeId } = useParams();
    const { data: allData } = useExcelData();

    // Filtrowanie danych tylko dla tego sklepu
    const storeData = React.useMemo(() => {
        if (!allData || !storeId) return [];
        return allData.filter(row => row.StoreId === storeId);
    }, [allData, storeId]);

    console.log('🏪 SingleStoreView - StoreId:', storeId);
    console.log('📊 SingleStoreView - Dane sklepu:', storeData.length, 'rekordów');

    if (!storeId) {
        return (
            <Container>
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                    <Typography variant="h5" color="error">
                        ❌ Brak ID sklepu w URL
                    </Typography>
                </Paper>
            </Container>
        );
    }

    if (!allData || allData.length === 0) {
        return (
            <Container>
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
                    <Typography variant="h5" color="text.secondary">
                        📋 Brak danych do wyświetlenia
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Wgraj plik Excel aby zobaczyć dane sklepu
                    </Typography>
                </Paper>
            </Container>
        );
    }

    if (storeData.length === 0) {
        return (
            <Container>
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
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Nagłówek i breadcrumbs */}
            <Box sx={{ mb: 4 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <IconButton 
                        component={Link} 
                        to="/dashboard" 
                        color="primary"
                        sx={{ mr: 1 }}
                    >
                        <ArrowBack />
                    </IconButton>
                    <Store fontSize="large" color="primary" />
                    <Typography variant="h3" component="h1" fontWeight="bold">
                        Sklep {storeId}
                    </Typography>
                </Box>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                    📊 Szczegółowa analiza dla {storeData.length} rekordów danych
                </Typography>
            </Box>

            {/* KPI Cards */}
            <SingleStoreKPICards storeData={storeData} storeId={storeId} />

            {/* Wykresy */}
            <Box sx={{ mb: 4 }}>
                <SingleStoreCharts storeData={storeData} storeId={storeId} />
            </Box>

            {/* Analiza Blokerów */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <BlockerAnalysis storeData={storeData} storeId={storeId} />
                </Grid>
                
                <Grid item xs={12} lg={6}>
                    <LastOrderBlockers storeData={storeData} storeId={storeId} />
                </Grid>
                
                <Grid item xs={12} lg={6}>
                    <NextOrderBlockers storeData={storeData} storeId={storeId} />
                </Grid>
            </Grid>
        </Container>
    );
}