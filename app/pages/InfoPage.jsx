import React from 'react';
import { 
    Box, 
    Container,
    Typography, 
    Button,
    Stack,
    Card,
    CardContent,
    Avatar,
    useTheme,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Grid,
    Chip,

    Paper
} from '@mui/material';
import { 
    Dashboard,
    ArrowBack,
    Analytics,
    Speed,
    TrendingUp,
    AutoAwesome,
    CheckCircle,
    Info,
    Business,
    Assessment,
    Settings,
    Group
} from '@mui/icons-material';
import { Link } from 'react-router';

const InfoPage = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    const features = [
        {
            icon: Analytics,
            title: "Zaawansowana Analityka",
            description: "Automatyczne przetwarzanie danych z plików Excel i generowanie szczegółowych raportów"
        },
        {
            icon: Speed,
            title: "Szybka Klasyfikacja",
            description: "Inteligentny system kategoryzacji blokerów według wpływu na procesy biznesowe"
        },
        {
            icon: TrendingUp,
            title: "Priorytetyzacja",
            description: "Ranking problemów według wagi i możliwości wpływu na rozwiązanie"
        },
        {
            icon: AutoAwesome,
            title: "Rekomendacje AI",
            description: "Automatyczne generowanie actionable kroków dla każdego sklepu"
        }
    ];

    const timelineItems = [
        {
            title: "Identyfikacja Problemu",
            description: "Rozpoznanie potrzeby lepszej analizy blokerów w procesach magazynowych",
            color: "error"
        },
        {
            title: "Analiza Wymagań",
            description: "Szczegółowa analiza potrzeb biznesowych i technicznych dla systemu DZZWD",
            color: "warning"
        },
        {
            title: "Projektowanie Systemu",
            description: "Opracowanie architektury i interfejsu użytkownika dashboardu",
            color: "info"
        },
        {
            title: "Implementacja",
            description: "Rozwój funkcjonalności analizy danych i generowania rekomendacji",
            color: "primary"
        },
        {
            title: "Optymalizacja",
            description: "Ciągłe doskonalenie algorytmów i dodawanie nowych funkcjonalności",
            color: "success"
        }
    ];

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Navigation */}
            <Box sx={{ 
                py: 2,
                backgroundColor: 'background.paper',
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Container maxWidth="xl">
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBack />}
                        color="primary"
                    >
                        Powrót do strony głównej
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
                {/* Hero Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            mb: 3,
                            boxShadow: `0 12px 24px ${theme.palette.primary.main}40`
                        }}
                    >
                        <Info sx={{ fontSize: 50 }} />
                    </Avatar>
                    
                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary.main">
                        Blokery DZZWD
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                        Kompleksowy system analizy i zarządzania blokerami w procesach magazynowych
                    </Typography>
                </Box>

                {/* Co to jest DZZWD */}
                <Card elevation={4} sx={{ mb: 6, borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                <Business />
                            </Avatar>
                            <Typography variant="h4" fontWeight="bold">
                                Czym jest DZZWD?
                            </Typography>
                        </Box>
                        
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                            <strong>DZZWD (Departament Zarządzania Zaopatrzeniem i Wydawaniem Drogerii)</strong> to 
                            kluczowy dział odpowiedzialny za optymalizację procesów magazynowych w sieci drogerii. 
                            System blokerów DZZWD służy do identyfikacji, kategoryzacji i rozwiązywania problemów 
                            mogących wpływać na płynność dostaw i dostępność produktów.
                        </Typography>
                        
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                            Dashboard analiz blokerów to narzędzie zaprojektowane specjalnie dla zespołów DZZWD, 
                            umożliwiające szybką identyfikację problemów na które mamy bezpośredni wpływ oraz 
                            generowanie konkretnych rekomendacji działań.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Kluczowe Funkcjonalności */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold" sx={{ mb: 4 }}>
                        Kluczowe Funkcjonalności
                    </Typography>
                    
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card 
                                    elevation={3}
                                    sx={{ 
                                        height: '100%',
                                        borderRadius: 3,
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    mr: 2,
                                                    width: 48,
                                                    height: 48
                                                }}
                                            >
                                                <feature.icon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    {feature.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {feature.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Proces Rozwoju */}
                <Card elevation={4} sx={{ mb: 6, borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                                <Settings />
                            </Avatar>
                            <Typography variant="h4" fontWeight="bold">
                                Proces Rozwoju Systemu
                            </Typography>
                        </Box>

                        <Stack spacing={3}>
                            {timelineItems.map((item, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: `${item.color}.main`, width: 40, height: 40 }}>
                                        <CheckCircle />
                                    </Avatar>
                                    <Paper 
                                        elevation={2} 
                                        sx={{ 
                                            p: 3, 
                                            flex: 1,
                                            borderRadius: 2,
                                            background: `linear-gradient(145deg, ${theme.palette[item.color].main}08 0%, ${theme.palette[item.color].main}15 100%)`
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="bold" color={`${item.color}.main`} gutterBottom>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </Paper>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Zespół */}
                <Card elevation={4} sx={{ mb: 6, borderRadius: 3 }}>
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                            <Group />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Zespół DZZWD
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            System został opracowany przez zespół analityków i deweloperów DZZWD 
                            we współpracy z ekspertami z dziedziny zarządzania łańcuchem dostaw 
                            i analityki biznesowej.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Kategorie Wpływu - przeniesione ze strony głównej */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold" sx={{ mb: 4 }}>
                        📊 Kategorie Wpływu na Blokery
                    </Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
                        System klasyfikuje wszystkie blokery według naszej możliwości wpływu na rozwiązanie problemu
                    </Typography>
                    
                    <Grid container spacing={4}>
                        <Grid item xs={12} lg={4}>
                            <Card elevation={4} sx={{ borderRadius: 3, border: `2px solid ${theme.palette.success.main}40` }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
                                            <ThumbUp />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                                WYSOKI WPŁYW
                                            </Typography>
                                            <Chip label="Waga: 1.0" size="small" color="success" />
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Parametry systemowe pod naszą kontrolą - możemy bezpośrednio wpłynąć na rozwiązanie
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} lg={4}>
                            <Card elevation={4} sx={{ borderRadius: 3, border: `2px solid ${theme.palette.warning.main}40` }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 48, height: 48 }}>
                                            <Balance />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" color="warning.main">
                                                NISKI WPŁYW
                                            </Typography>
                                            <Chip label="Waga: 0.3" size="small" color="warning" />
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Ograniczone możliwości - wymagają decyzji biznesowych wyższego szczebla
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} lg={4}>
                            <Card elevation={4} sx={{ borderRadius: 3, border: `2px solid ${theme.palette.text.secondary}40` }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: 'text.secondary', mr: 2, width: 48, height: 48 }}>
                                            <RemoveRedEye />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                                ZEROWY WPŁYW
                                            </Typography>
                                            <Chip label="Waga: 0.0" size="small" />
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Brak możliwości bezpośredniego wpływu - monitorowanie i eskalacja problemów
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Call to Action */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Rozpocznij pracę z systemem
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Przejdź do dashboardu aby rozpocząć analizę blokerów
                    </Typography>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button
                            component={Link}
                            to="/dashboard"
                            variant="contained"
                            size="large"
                            startIcon={<Dashboard />}
                            sx={{ 
                                px: 4, 
                                py: 2,
                                fontSize: '1.1rem',
                                borderRadius: 3
                            }}
                        >
                            Przejdź do Dashboard
                        </Button>
                        <Button
                            component={Link}
                            to="/"
                            variant="outlined" 
                            size="large"
                            startIcon={<ArrowBack />}
                            sx={{ px: 4, py: 2, fontSize: '1.1rem', borderRadius: 3 }}
                        >
                            Powrót do strony głównej
                        </Button>
                    </Stack>
                </Box>
            </Container>

            {/* Footer */}
            <Box sx={{ 
                mt: 'auto',
                py: 3,
                backgroundColor: 'background.paper',
                borderTop: `1px solid ${theme.palette.divider}`
            }}>
                <Container maxWidth="xl">
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        © {currentYear} Dashboard Analiz Blokerów DZZWD. Wszystkie prawa zastrzeżone.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default InfoPage;