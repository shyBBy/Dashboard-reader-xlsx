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
    Grid,
    Chip,
    Paper,
    Stepper,
    Step,
    StepLabel,
    StepContent
} from '@mui/material';
import { 
    ThumbUp, 
    Balance, 
    RemoveRedEye,
    TrendingUp,
    Assessment,
    Dashboard,
    ArrowBack,
    Analytics,
    Speed,
    AutoAwesome,
    CheckCircle,
    Info,
    Business,
    Inventory,
    Science,
    Recommend
} from '@mui/icons-material';
import { Link } from 'react-router';

const InfoPage = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    // Kategorie wpływu na blokery
    const influenceCategories = [
        {
            title: "WYSOKI WPŁYW",
            weight: "1.0",
            color: theme.palette.success.main,
            bgColor: theme.palette.success.light,
            icon: ThumbUp,
            description: "Maksymalny priorytet działań",
            details: "Parametry systemowe pod pełną kontrolą DZZWD - możemy bezpośrednio wpłynąć na rozwiązanie problemu",
            examples: ["StoreVolume", "Box", "PCP"]
        },
        {
            title: "NISKI WPŁYW", 
            weight: "0.3",
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light,
            icon: Balance,
            description: "Wymagają decyzji biznesowych",
            details: "Ograniczone możliwości wpływu - wymagają decyzji wyższego szczebla lub zmian procesowych",
            examples: ["Blockade", "LineOfShame", "maxStock"]
        },
        {
            title: "ZEROWY WPŁYW",
            weight: "0.0", 
            color: theme.palette.info.main,
            bgColor: theme.palette.info.light,
            icon: RemoveRedEye,
            description: "Monitorowanie i eskalacja",
            details: "Brak możliwości bezpośredniego wpływu - skupiamy się na monitorowaniu i eskalacji problemów",
            examples: ["WhsStock", "MK", "NewsBlockade", "Regi"]
        }
    ];

    // Kroki procesu systemu (na podstawie Twoich screenów)
    const systemSteps = [
        {
            number: 1,
            title: "Klasyfikacja Blokerów",
            description: "Każdy powód blokera otrzymuje kategorię wpływu: WYSOKI / NISKI / ZEROWY",
            details: "System automatycznie przypisuje wagę każdemu typowi blokera na podstawie naszych możliwości wpływu",
            icon: Assessment,
            color: "primary"
        },
        {
            number: 2, 
            title: "Obliczenie Wagi Problemu",
            description: "Kombinacja: częstość występowania × możliwość wpływu × udział w sklepie",
            details: "Algorytm uwzględnia nie tylko typ blokera, ale także jego częstość i wpływ na konkretny sklep",
            icon: Science,
            color: "secondary"
        },
        {
            number: 3,
            title: "Priorytetyzacja", 
            description: "Ranking problemów - najpierw te z najwyższą wagą i możliwością działania",
            details: "System tworzy listę priorytetów skupiając się na problemach, które możemy faktycznie rozwiązać",
            icon: TrendingUp,
            color: "success"
        },
        {
            number: 4,
            title: "Generowanie Rekomendacji",
            description: "Konkretne, actionable kroki dla TOP 3 problemów w każdym sklepie",
            details: "Dla każdego sklepu system generuje konkretne działania do podjęcia przez zespół DZZWD",
            icon: Recommend,
            color: "warning"
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
                borderBottom: `1px solid ${theme.palette.divider}`,
                boxShadow: 1
            }}>
                <Container maxWidth="xl">
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBack />}
                        color="primary"
                        size="large"
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
                            boxShadow: `0 12px 24px ${theme.palette.primary.main}30`
                        }}
                    >
                        <Info sx={{ fontSize: 50 }} />
                    </Avatar>
                    
                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary.main">
                        System Analiz Blokerów DZZWD
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                        Kompleksowe narzędzie do analizy i zarządzania blokerami w procesach magazynowych
                    </Typography>
                </Box>

                {/* Cel systemu - główny focus */}
                <Card 
                    elevation={4} 
                    sx={{ 
                        mb: 8, 
                        borderRadius: 3,
                        background: `linear-gradient(145deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}15 100%)`,
                        border: `2px solid ${theme.palette.primary.main}20`
                    }}
                >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                            🎯
                        </Avatar>
                        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.main">
                            Cel: Fokus na problemy NA KTÓRE MAMY WPŁYW
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Priorytetyzujemy działania które przyniosą największe rezultaty dla zespołu DZZWD
                        </Typography>
                    </CardContent>
                </Card>

                {/* Kategorie Wpływu - jak na Twoim screenie */}
                <Box sx={{ mb: 8 }}>
                    <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold" sx={{ mb: 2 }}>
                        📊 Kategorie Wpływu na Blokery
                    </Typography>
                    <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}>
                        System klasyfikuje blokery według naszych możliwości wpływu na rozwiązanie problemu
                    </Typography>
                    
                    <Grid container spacing={4}>
                        {influenceCategories.map((category, index) => (
                            <Grid item xs={12} lg={4} key={index}>
                                <Card 
                                    elevation={6}
                                    sx={{ 
                                        height: '100%',
                                        borderRadius: 3,
                                        background: `linear-gradient(145deg, ${category.bgColor}15 0%, ${category.bgColor}25 100%)`,
                                        border: `2px solid ${category.color}30`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: `0 12px 24px ${category.color}20`
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: category.color,
                                                    width: 56,
                                                    height: 56,
                                                    mr: 2
                                                }}
                                            >
                                                <category.icon sx={{ fontSize: 32 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h5" fontWeight="bold" color={category.color} gutterBottom>
                                                    {category.title}
                                                </Typography>
                                                <Chip 
                                                    label={`Waga: ${category.weight}`}
                                                    size="small"
                                                    sx={{ bgcolor: category.color, color: 'white' }}
                                                />
                                            </Box>
                                        </Box>
                                        
                                        <Typography variant="body1" gutterBottom fontWeight="medium">
                                            {category.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {category.details}
                                        </Typography>
                                        
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                Przykłady:
                                            </Typography>
                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                {category.examples.map((example, idx) => (
                                                    <Chip 
                                                        key={idx}
                                                        label={example}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ borderColor: category.color }}
                                                    />
                                                ))}
                                            </Stack>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Koncepcja Systemu - proces 4 kroków */}
                <Card elevation={4} sx={{ mb: 6, borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                                <Business />
                            </Avatar>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                💡 Koncepcja Systemu
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                Proces analizy i generowania rekomendacji w 4 krokach
                            </Typography>
                        </Box>

                        <Stepper orientation="vertical" sx={{ mt: 4 }}>
                            {systemSteps.map((step, index) => (
                                <Step key={index} active={true}>
                                    <StepLabel
                                        StepIconComponent={() => (
                                            <Avatar 
                                                sx={{ 
                                                    bgcolor: `${step.color}.main`,
                                                    width: 40,
                                                    height: 40,
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {step.number}
                                            </Avatar>
                                        )}
                                    >
                                        <Box sx={{ ml: 2 }}>
                                            <Typography variant="h5" fontWeight="bold" color={`${step.color}.main`}>
                                                {step.title}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {step.description}
                                            </Typography>
                                        </Box>
                                    </StepLabel>
                                    <StepContent>
                                        <Paper 
                                            elevation={2}
                                            sx={{ 
                                                p: 3,
                                                ml: 7,
                                                mb: 2,
                                                borderRadius: 2,
                                                background: `linear-gradient(145deg, ${theme.palette[step.color].main}08 0%, ${theme.palette[step.color].main}15 100%)`
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: `${step.color}.main`, width: 32, height: 32 }}>
                                                    <step.icon />
                                                </Avatar>
                                                <Typography variant="body1" color="text.secondary">
                                                    {step.details}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                    </CardContent>
                </Card>

                {/* Co to jest DZZWD */}
                <Card elevation={4} sx={{ mb: 6, borderRadius: 3 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ bgcolor: 'info.main', mr: 2, width: 56, height: 56 }}>
                                <Inventory />
                            </Avatar>
                            <Typography variant="h4" fontWeight="bold">
                                Czym jest DZZWD?
                            </Typography>
                        </Box>
                        
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                            <strong>DZZWD</strong> to kluczowy dział odpowiedzialny za optymalizację procesów 
                            magazynowych w sieci drogerii. Nasz zespół zajmuje się identyfikacją, analizą 
                            i rozwiązywaniem problemów mogących wpływać na płynność dostaw i dostępność produktów.
                        </Typography>
                        
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                            Dashboard analiz blokerów to narzędzie zaprojektowane specjalnie dla zespołów DZZWD, 
                            umożliwiające szybką identyfikację problemów na które mamy bezpośredni wpływ oraz 
                            generowanie konkretnych, actionable rekomendacji działań.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Call to Action */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Rozpocznij analizę blokerów
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Przejdź do dashboardu aby rozpocząć pracę z systemem
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