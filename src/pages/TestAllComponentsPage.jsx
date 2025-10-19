import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Divider,
    Button,
    Stack,
    Chip,
    Alert,
    AlertTitle,
    Paper,
    LinearProgress,
    CircularProgress,
    AppBar,
    Toolbar,
    IconButton,
} from '@mui/material';
import {
    Dashboard,
    Store,
    TrendingUp,
    Error as ErrorIcon,
    CheckCircle,
    Warning,
    Info,
    Refresh,
    Assessment,
    Block,
    Inventory,
    ArrowBack,
    Home,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

// Import komponentów do testowania
import MainKPICard from '../components/MainKPICard';
import ErrorCard from '../components/ErrorCard';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import SingleStoreKPICards from '../components/SingleStore/SingleStoreKPICards';
import SingleStoreCharts from '../components/SingleStore/SingleStoreCharts';
import BlockerAnalysis from '../components/SingleStore/BlockerAnalysis';
import LastOrderBlockers from '../components/SingleStore/LastOrderBlockers';
import NextOrderBlockers from '../components/SingleStore/NextOrderBlockers';
import { TableCellRenderer } from '../components/Table/TableCellRenderer';
import SurfaceCard from '../components/SurfaceCard';

// Przykładowe dane
const mockStoreData = {
    storeId: '1234',
    storeName: 'Test Store Warszawa Centrum',
    totalBlockers: 156,
    highImpactBlockers: 45,
    mediumImpactBlockers: 67,
    lowImpactBlockers: 44,
};

const mockSingleStoreRows = Array.from({ length: 24 }, (_, index) => ({
    StoreId: '1234',
    Wplyw: index % 4 === 0 ? 'WYSOKI' : index % 4 === 1 ? 'SREDNI' : index % 4 === 2 ? 'NISKI' : 'ZEROWY',
    Decyzja: index % 3 === 0 ? 'REKOMENDUJ' : 'BRAK AKCJI',
    DOSTEPNOSC_DROGERIA: index % 5 === 0 ? '94.5' : '96.8',
    Dostepnosc_siec: index % 4 === 0 ? '95.2' : '97.4',
    BlockerName: index % 2 === 0 ? 'StoreVolume' : 'WhsStock',
    Bloker_ostatnie_zam: index % 5 === 0 ? 10 : 6,
    Bloker_najblizsze_zam: index % 4 === 0 ? 8 : 5,
    Zera_w_blokerze_ostatnie_zam: index % 6 === 0 ? 4 : 2,
}));

const mockBlockersData = [
    { blocker: 'StoreVolume', count: 45, percentage: 28.8, influence: 'WYSOKI', trend: '+5%' },
    { blocker: 'WhsStock', count: 34, percentage: 21.8, influence: 'ZEROWY', trend: '-2%' },
    { blocker: 'Box', count: 28, percentage: 17.9, influence: 'WYSOKI', trend: '+3%' },
    { blocker: 'Blockade', count: 22, percentage: 14.1, influence: 'NISKI', trend: '0%' },
    { blocker: 'MK', count: 15, percentage: 9.6, influence: 'ZEROWY', trend: '-1%' },
    { blocker: 'PCP', count: 12, percentage: 7.7, influence: 'WYSOKI', trend: '+2%' },
];

const mockLastOrderBlockers = [
    { blocker: 'StoreVolume', count: 23, sku: 45, percentage: 31.5 },
    { blocker: 'WhsStock', count: 18, sku: 32, percentage: 24.7 },
    { blocker: 'Box', count: 15, sku: 28, percentage: 20.5 },
    { blocker: 'Blockade', count: 11, sku: 19, percentage: 15.1 },
    { blocker: 'MK', count: 6, sku: 12, percentage: 8.2 },
];

const mockNextOrderBlockers = [
    { blocker: 'WhsStock', count: 28, sku: 52, percentage: 35.0 },
    { blocker: 'StoreVolume', count: 20, sku: 38, percentage: 25.0 },
    { blocker: 'Box', count: 16, sku: 29, percentage: 20.0 },
    { blocker: 'PCP', count: 10, sku: 18, percentage: 12.5 },
    { blocker: 'MK', count: 6, sku: 11, percentage: 7.5 },
];

const mockHighImpactBlockers = [
    { blocker: 'StoreVolume', count: 45, percentage: 28.8, recommendation: 'Zwiększ pojemność magazynową' },
    { blocker: 'Box', count: 28, percentage: 17.9, recommendation: 'Optymalizuj rozmieszczenie palet' },
    { blocker: 'PCP', count: 12, percentage: 7.7, recommendation: 'Zweryfikuj parametry systemowe' },
];

const mockChartData = {
    blockersByType: mockBlockersData.map(b => ({
        label: b.blocker,
        value: b.count,
        color: b.influence === 'WYSOKI' ? '#22C55E' : b.influence === 'NISKI' ? '#F59E0B' : '#3B82F6',
    })),
    trendsData: [
        { date: '2025-01-11', count: 142 },
        { date: '2025-01-12', count: 138 },
        { date: '2025-01-13', count: 145 },
        { date: '2025-01-14', count: 151 },
        { date: '2025-01-15', count: 148 },
        { date: '2025-01-16', count: 156 },
        { date: '2025-01-17', count: 153 },
    ],
};

const mockSparklineSeries = {
    totalBlockers: [120, 126, 140, 138, 142, 156, 158],
    highImpact: [30, 36, 32, 38, 40, 42, 45],
    mediumImpact: [54, 58, 60, 63, 64, 66, 67],
    lowImpact: [40, 38, 42, 41, 43, 44, 44],
};

const TestAllComponentsPage = () => {
    const theme = useTheme();
    const { isDarkMode } = useAppTheme();
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: 'background.default',
        }}>
            {/* Sticky Navigation Bar */}
            <AppBar 
                position="sticky" 
                elevation={2}
                sx={{ 
                    backgroundColor: 'background.paper',
                    borderBottom: `1px solid ${theme.vars.palette.divider}`,
                }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        onClick={() => navigate('/dashboard')}
                        sx={{ mr: 2, color: 'primary.main' }}
                    >
                        <ArrowBack />
                    </IconButton>
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
                        🧪 Test All Components
                    </Typography>
                    
                    <Chip 
                        label={`${isDarkMode ? '🌙 Dark' : '☀️ Light'}`}
                        color="primary"
                        size="small"
                        sx={{ mr: 2 }}
                    />
                    
                    <Button
                        variant="outlined"
                        startIcon={<Home />}
                        onClick={() => navigate('/dashboard')}
                    >
                        Dashboard
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" gutterBottom fontWeight="bold" color="primary.main">
                        🧪 Test All Components
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        Podgląd wszystkich komponentów aplikacji z przykładowymi danymi
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <ThemeToggle />
                    </Box>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Section 1: Main KPI Cards */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Dashboard /> Main KPI Cards
                    </Typography>
                    
                    <Box
                        sx={{
                            display: 'grid',
                            gap: { xs: 2.5, md: 3 },
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        }}
                    >
                        <MainKPICard
                            title="Total active users"
                            value="18,765"
                            trend={{ value: '2.6', suffix: '%', label: 'last 7 days', status: 'up' }}
                            chartData={mockSparklineSeries.totalBlockers}
                            chartColor="success"
                        />
                        <MainKPICard
                            title="Total installed"
                            value="4,876"
                            trend={{ value: '0.2', suffix: '%', label: 'last 7 days', status: 'up' }}
                            chartData={mockSparklineSeries.highImpact}
                            chartColor="info"
                        />
                        <MainKPICard
                            title="Total downloads"
                            value="678"
                            trend={{ value: '0.1', suffix: '%', label: 'last 7 days', status: 'down' }}
                            chartData={mockSparklineSeries.lowImpact}
                            chartColor="error"
                        />
                        <MainKPICard
                            title="Avg. session time"
                            value="4m 32s"
                            subtitle="Sample secondary text"
                            trend={{ value: '1.8', suffix: '%', label: 'last 7 days', status: 'up' }}
                            chartData={mockSparklineSeries.mediumImpact}
                            chartColor="primary"
                        />
                    </Box>
                </SurfaceCard>

                {/* Section 2: Error Card */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <ErrorIcon /> Error Card Component
                    </Typography>
                    
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <Button 
                            variant="contained" 
                            color={showError ? "success" : "error"}
                            onClick={() => setShowError(!showError)}
                        >
                            {showError ? 'Ukryj Error' : 'Pokaż Error'}
                        </Button>
                    </Stack>

                    {showError && (
                        <ErrorCard
                            title="Błąd Połączenia z API"
                            message="Nie udało się połączyć z serwerem. Sprawdź czy backend jest uruchomiony."
                            onRetry={() => alert('Retry clicked!')}
                        />
                    )}

                    {!showError && (
                        <Alert severity="info">
                            <AlertTitle>Kliknij przycisk aby zobaczyć ErrorCard</AlertTitle>
                            Ten komponent pokazuje się gdy wystąpi błąd połączenia z API
                        </Alert>
                    )}
                </SurfaceCard>

                {/* Section 3: Single Store KPI Cards */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Store /> Single Store KPI Cards
                    </Typography>
                    
                    <SingleStoreKPICards 
                        storeId={mockStoreData.storeId}
                        storeData={mockSingleStoreRows}
                    />
                </SurfaceCard>

                {/* Section 4: Charts */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Assessment /> Wykresy Analityczne
                    </Typography>
                    
                    <SingleStoreCharts 
                        blockersData={mockBlockersData}
                        trendsData={mockChartData.trendsData}
                        storeId="1234"
                    />
                </SurfaceCard>

                {/* Section 5: Blocker Analysis */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Block /> Analiza Blokerów (High Impact)
                    </Typography>
                    
                    <BlockerAnalysis 
                        highImpactBlockers={mockHighImpactBlockers}
                    />
                </SurfaceCard>

                {/* Section 6: Last Order Blockers */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Inventory /> Blokery Ostatniego Zamówienia
                    </Typography>
                    
                    <LastOrderBlockers 
                        blockersData={mockLastOrderBlockers}
                    />
                </SurfaceCard>

                {/* Section 7: Next Order Blockers */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <TrendingUp /> Blokery Następnego Zamówienia
                    </Typography>
                    
                    <NextOrderBlockers 
                        blockersData={mockNextOrderBlockers}
                    />
                </SurfaceCard>

                {/* Section 8: Table Cell Renderers */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                        📊 Table Cell Renderers
                    </Typography>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    StoreId Cell:
                                </Typography>
                                <TableCellRenderer header="StoreId" value="1234" />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    BlockerName Cell:
                                </Typography>
                                <TableCellRenderer header="BlockerName" value="StoreVolume" />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Wplyw Cell:
                                </Typography>
                                <TableCellRenderer header="Wplyw" value="WYSOKI" />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Number Cell:
                                </Typography>
                                <TableCellRenderer header="Count" value={156} />
                            </Paper>
                        </Grid>
                    </Grid>
                </SurfaceCard>

                {/* Section 9: UI Elements Showcase */}
                <SurfaceCard sx={{ mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                        🎨 UI Elements Showcase
                    </Typography>
                    
                    <Grid container spacing={3}>
                        {/* Buttons */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Buttons</Typography>
                                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                                    <Button variant="contained" color="primary">Primary</Button>
                                    <Button variant="contained" color="secondary">Secondary</Button>
                                    <Button variant="contained" color="success">Success</Button>
                                    <Button variant="contained" color="warning">Warning</Button>
                                    <Button variant="contained" color="error">Error</Button>
                                    <Button variant="outlined" color="info">Info</Button>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Chips */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Chips</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    <Chip label="Primary" color="primary" />
                                    <Chip label="Secondary" color="secondary" />
                                    <Chip label="Success" color="success" />
                                    <Chip label="Warning" color="warning" />
                                    <Chip label="Error" color="error" />
                                    <Chip label="Info" color="info" />
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Alerts */}
                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Alerts</Typography>
                                <Stack spacing={2}>
                                    <Alert severity="success">
                                        <AlertTitle>Success</AlertTitle>
                                        Operacja zakończona pomyślnie!
                                    </Alert>
                                    <Alert severity="info">
                                        <AlertTitle>Info</AlertTitle>
                                        To jest informacja systemowa.
                                    </Alert>
                                    <Alert severity="warning">
                                        <AlertTitle>Warning</AlertTitle>
                                        Uwaga! Sprawdź te dane.
                                    </Alert>
                                    <Alert severity="error">
                                        <AlertTitle>Error</AlertTitle>
                                        Wystąpił błąd podczas operacji.
                                    </Alert>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Progress Indicators */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Linear Progress</Typography>
                                <Stack spacing={2}>
                                    <LinearProgress color="primary" />
                                    <LinearProgress color="secondary" variant="determinate" value={60} />
                                    <LinearProgress color="success" variant="determinate" value={100} />
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Circular Progress</Typography>
                                <Stack direction="row" spacing={3} justifyContent="center">
                                    <CircularProgress color="primary" />
                                    <CircularProgress color="secondary" variant="determinate" value={60} />
                                    <CircularProgress color="success" variant="determinate" value={100} />
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Typography */}
                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Typography</Typography>
                                <Stack spacing={1}>
                                    <Typography variant="h1">Heading 1</Typography>
                                    <Typography variant="h2">Heading 2</Typography>
                                    <Typography variant="h3">Heading 3</Typography>
                                    <Typography variant="h4">Heading 4</Typography>
                                    <Typography variant="h5">Heading 5</Typography>
                                    <Typography variant="h6">Heading 6</Typography>
                                    <Typography variant="body1">Body 1 - Lorem ipsum dolor sit amet</Typography>
                                    <Typography variant="body2">Body 2 - Lorem ipsum dolor sit amet</Typography>
                                    <Typography variant="caption" color="text.secondary">Caption text</Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </SurfaceCard>

                {/* Footer Info */}
                <SurfaceCard sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        🧪 Strona testowa - Wszystkie komponenty używają <code>theme.vars.palette</code>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Przełącz tryb Dark/Light aby zobaczyć automatyczne dostosowanie kolorów
                    </Typography>
                </SurfaceCard>
            </Container>
        </Box>
    );
};

export default TestAllComponentsPage;
